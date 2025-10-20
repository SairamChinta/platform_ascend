import { Router } from "express";
import { prismaClient } from "../db";

const router = Router();

router.get("/available",async (req, res) =>{
    const availableTriggers = await prismaClient.availableTrigger.findMany({
        select: {
            id: true,
            name: true,
            image: true
          }
    })
    // await prismaClient.trigger.create({
    //     data: {
    //       name: 'Webhook',
    //       image: 'https://example.com/image.png'
    //     }
    //   });
    res.json({
        availableTriggers
    })
})

export const triggerRouter = router;