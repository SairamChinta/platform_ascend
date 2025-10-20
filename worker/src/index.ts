require ('dotenv').config()

import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { parse } from "./parser";
import { sendEmail } from "./email";
import { sendSol } from "./solana";

const prismaClient = new PrismaClient();
const TOPIC_NAME = "ceed-events"

const kafka = new Kafka({
    clientId: 'outbox-processor-2',
    brokers: ['localhost:9092']
})

async function main() {
    const consumer = kafka.consumer({ groupId: 'main-worker-2' });
    await consumer.connect();
    const producer = kafka.producer();
    await producer.connect();

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            partition,
            offset: message.offset,
            value: message.value?.toString(),
          })
          if(!message.value?.toString()){
            return;
          }

          const parsedValue = JSON.parse(message.value?.toString());
          const ceedRunId = parsedValue.ceedRunId;
          const stage = parsedValue.stage;

          const ceedRunDetails = await prismaClient.ceedRun.findFirst({
            where:{
                id: ceedRunId
            },include:{
                ceed:{
                    include:{
                        actions: {
                            include:{
                                type: true
                            }
                        }
                    }
                },
            }
          });

          
         const currentAction = ceedRunDetails?.ceed.actions.find(
            x=>x.sortingOrder === stage);

          if(!currentAction){
            console.log("current action not found");
            return;
          }

          console.log(currentAction);
          const ceedRunMetadata = ceedRunDetails?.metadata;

          if(currentAction.type.id === "email"){
            const body = parse((currentAction.metadata as JsonObject)?.body as string, ceedRunMetadata);
            const to = parse((currentAction.metadata as JsonObject)?.email as string, ceedRunMetadata);
            console.log(`Sending out email to ${to} body is ${body}`); 
            await sendEmail(to,body);
          }
          
          if(currentAction.type.id === "send-sol"){
            const amount = parse((currentAction.metadata as JsonObject)?.amount as string, ceedRunMetadata);
            const address = parse((currentAction.metadata as JsonObject)?.address as string, ceedRunMetadata);
            console.log(`Sending out SOL of ${amount} to address ${address}`);
            await sendSol(amount,address);
          }
           
          await new Promise(r => setTimeout(r, 500));

          const ceedId = message.value?.toString();
          const lastStage = (ceedRunDetails?.ceed.actions?.length || 1) - 1;
          if(lastStage !== stage){
            await producer.send({
              topic: TOPIC_NAME,
              messages:[{
                  value: JSON.stringify({
                  stage: stage + 1,
                  ceedRunId
                })
              }]
          })
          }

          console.log("processing done");
           
          await consumer.commitOffsets([{
            topic: TOPIC_NAME,
            partition: partition,
            offset: (parseInt(message.offset) + 1).toString() // 5
          }])
        },
      })

}

main()