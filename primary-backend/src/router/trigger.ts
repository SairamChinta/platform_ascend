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
    res.json({
        availableTriggers
    })
})

export const triggerRouter = router;