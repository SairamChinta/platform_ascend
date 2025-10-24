require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { Kafka } from 'kafkajs';

const app = express();
const prismaClient = new PrismaClient();
const PORT = process.env.PORT || 3002;
const TOPIC_NAME = "ceed-events"; 

// Setup Kafka Producer
const kafka = new Kafka({
  clientId: 'github-webhook-trigger',
  brokers: ['localhost:9092']
});
const producer = kafka.producer();

// // Validate email format
// function isValidEmail(email: string): boolean {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

// // Validate Solana address
// function isValidAddress(address: string): boolean {
//   const solanaRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
//   return solanaRegex.test(address);
// }

// // Validate amount
// function isValidAmount(amount: string): boolean {
//   const num = parseFloat(amount);
//   return !isNaN(num) && num > 0;
// }

interface BountyComment {
  comment: {
    email: string;
    amount: string;
    address: string;
  };
}

app.use(express.json());

// Use a dynamic URL to capture the ceedId
app.post('/hooks/catch/:userId/:ceedId', async (req: Request, res: Response) => {
  try {
    const { ceedId } = req.params;
    const eventType = req.headers['x-github-event'];

    if (eventType !== 'issue_comment') {
      return res.status(200).send('Not an issue comment event');
    }

    const commentBody = req.body.comment?.body;
    if (!commentBody) {
      return res.status(200).send('No comment body');
    }

    let parsedComment: BountyComment;
    try {
      parsedComment = JSON.parse(commentBody);
    } catch (e) {
      return res.status(200).send('Comment is not JSON format');
    }

    // Validate the structure
    if (parsedComment.comment && 
        parsedComment.comment.email && 
        parsedComment.comment.amount && 
        parsedComment.comment.address) {
      
      const { email, amount, address } = parsedComment.comment;

      // if (!isValidEmail(email)) {
      //   return res.status(200).json({ success: false, error: 'Invalid email format' });
      // }
      // if (!isValidAmount(amount)) {
      //   return res.status(200).json({ success: false, error: 'Invalid amount' });
      // }
      // if (!isValidAddress(address)) {
      //   return res.status(200).json({ success: false, error: 'Invalid Solana address' });
      // }
      
      console.log('Webhook Validated. Creating CeedRun...');

      // Create the CeedRun in your database
      // The 'metadata' is the full payload, which your parser will use
      const ceedRun = await prismaClient.ceedRun.create({
        data: {
          ceedId: ceedId,
          metadata: {
            comment: parsedComment.comment, 
            github: {
                issue: req.body.issue,
                commenter: req.body.comment?.user?.login
            }
          }
        }
      });

      //Send the first job to the Kafka worker
      await producer.send({
        topic: TOPIC_NAME,
        messages: [{
          value: JSON.stringify({
            ceedRunId: ceedRun.id,
            stage: 0 
          })
        }]
      });

      console.log(`Queued job for CeedRun ID: ${ceedRun.id}`);

      return res.status(200).json({ 
        success: true, 
        message: 'Bounty payment job queued',
        ceedRunId: ceedRun.id
      });
    }

    res.status(200).send('Not a bounty announcement');

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'Webhook server running' });
});

// Connect producer and start server
async function startServer() {
  await producer.connect();
  app.listen(PORT, () => {
    console.log(`Trigger server (webhook) running on port ${PORT}`);
    console.log('Webhook signature verification DISABLED');
  });
}

startServer();