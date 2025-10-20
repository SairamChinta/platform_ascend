import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const app = express();
const client = new PrismaClient(); 

app.use(express.json());

app.post("/hooks/catch/:userId/:ceedId", async (req, res) => {
    const userId = req.params.userId;
    const ceedId = req.params.ceedId;
    const body = req.body;

    try {
        // Store in DB a new trigger
        await client.$transaction(async (tx: Prisma.TransactionClient) => {
            const run = await tx.ceedRun.create({
                data: {
                    ceedId: ceedId,
                    metadata: body,
                }
            });
            await tx.ceedRunOutbox.create({
                data: {
                    ceedRunId: run.id
                }
            });
        });

        res.json({ message: "webhook received" });
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(3002, () => {
    console.log("Server running on port 3002");
});
