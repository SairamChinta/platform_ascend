import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const TOPIC_NAME = 'ceed-events'
const client = new PrismaClient();

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

async function main(){
    const producer = kafka.producer();
    await producer.connect();

    while(1){
        const pendingRows = await client.ceedRunOutbox.findMany({
            where: {},
            take: 10
        })
        console.log(pendingRows);

        producer.send({
            topic: TOPIC_NAME,
            messages: pendingRows.map(r =>{
                return {
                    value: JSON.stringify({ ceedRunId: r.ceedRunId, stage: 0})
                }
            })
        })
        await client.ceedRunOutbox.deleteMany({
            where: {
                id:{
                    in: pendingRows.map(x => x.id)
                }
            }
        })
        await new Promise (r =>setTimeout(r, 3000));
    }
}

main();