require('dotenv').config();

import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { parse } from "./parser";
import { sendEmail } from "./email";
import { sendSol } from "./solana";
import { decrypt } from "./lib/encryption";

const prismaClient = new PrismaClient();
const TOPIC_NAME = "ceed-events";

const kafka = new Kafka({
    clientId: 'outbox-processor-2',
    brokers: ['localhost:9092']
});

async function main() {
    const consumer = kafka.consumer({ groupId: 'main-worker-2' });
    await consumer.connect();
    const producer = kafka.producer();
    await producer.connect();
    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            console.log("Processing message:", message.value?.toString());
            if (!message.value?.toString()) return;

            const parsedValue = JSON.parse(message.value?.toString());
            const ceedRunId = parsedValue.ceedRunId;
            const stage = parsedValue.stage;

            // Fetch the CeedRun, its Ceed, its Actions, and its User
            const ceedRunDetails = await prismaClient.ceedRun.findFirst({
                where: { id: ceedRunId },
                include: {
                    ceed: {
                        include: {
                            actions: { include: { type: true } },
                            user: true // Get the user associated with the ceed
                        }
                    },
                }
            });

            const user = ceedRunDetails?.ceed?.user;
            if (!user) {
                console.error(`User not found for CeedRun ID: ${ceedRunId}. Skipping job.`);
                await consumer.commitOffsets([{ topic: TOPIC_NAME, partition, offset: (parseInt(message.offset) + 1).toString() }]);
                return;
            }

            const currentAction = ceedRunDetails?.ceed.actions.find(
            (x: { sortingOrder: any; }) => x.sortingOrder === stage);


            if (!currentAction) {
                console.log(`Action not found for stage ${stage}. Skipping job.`);
                await consumer.commitOffsets([{ topic: TOPIC_NAME, partition, offset: (parseInt(message.offset) + 1).toString() }]);
                return;
            }

            const ceedRunMetadata = ceedRunDetails?.metadata;

            if (currentAction.type.id === "email") {
                const body = parse((currentAction.metadata as JsonObject)?.body as string, ceedRunMetadata);
                const to = parse((currentAction.metadata as JsonObject)?.email as string, ceedRunMetadata);
                
                // Pass the user's verified email as the 'from' address
                await sendEmail(to, body, user.email);
            }
            
            if (currentAction.type.id === "send-sol") {
               // Get the template strings from the action metadata
                const amountTemplate = (currentAction.metadata as JsonObject)?.amount as string;
                const addressTemplate = (currentAction.metadata as JsonObject)?.address as string;

                // Parse the templates using the webhook data
                const amount = parse(amountTemplate, ceedRunMetadata);
                const address = parse(addressTemplate, ceedRunMetadata);

                if (!user.solanaPrivateKey) {
                    console.error(`User ${user.email} has no Solana private key set. Skipping SOL send.`);
                    await sendEmail(user.email, `Your workflow failed: You tried to send ${amount} SOL, but you have no Solana private key configured.`, user.email);
                } else {
                    try {
                        // Decrypt the key and send the SOL
                        const decryptedKey = decrypt(user.solanaPrivateKey);
                        await sendSol(amount, address, decryptedKey);
                    } catch (e:any) {
                        console.error(`Failed to decrypt key or send SOL for user ${user.email}:`, e);
                        await sendEmail(user.email, `Your workflow failed: Could not send ${amount} SOL. The error was: ${e.message}`, user.email);
                    }
                }
            }
                
            await new Promise(r => setTimeout(r, 500));

            const lastStage = (ceedRunDetails?.ceed.actions?.length || 1) - 1;
            if (lastStage !== stage) {
                await producer.send({
                    topic: TOPIC_NAME,
                    messages: [{
                        value: JSON.stringify({
                            stage: stage + 1,
                            ceedRunId
                        })
                    }]
                })
            }

            console.log("Processing done");
                
            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                partition: partition,
                offset: (parseInt(message.offset) + 1).toString() 
            }])
        },
    })
}

main();