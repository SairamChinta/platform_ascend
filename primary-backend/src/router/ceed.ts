import { Router } from "express";
import { authMiddleware } from "../middleware";
import { CeedCreateSchema } from "../types";
import { prismaClient } from "../db";

const router = Router();

//@ts-ignore
router.post("/", authMiddleware, async (req,res)=>{
    //@ts-ignore
    const id: string = req.id;
    const parsedData = CeedCreateSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(411).json({
            message:"Incorrest inputs",
            error:parsedData.error
        })
    }

  const ceedId = await prismaClient.$transaction( async tx => {
    const ceed = await prismaClient.ceed.create({
        data:{
            userId: parseInt(id),
            triggerId:"",
            actions:{
                create: parsedData.data.actions.map((x,index) => ({
                    actionId: x.availableActionId,
                    sortingOrder: index,
                    metadata: x.actionMetadata
                }))
            }
        }
    })
    const trigger = await tx.trigger.create({
        data:{
            triggerId: parsedData.data.availableTriggerId,
            ceedId: ceed.id
        }
    });
    await tx.ceed.update({
        where:{
            id: ceed.id
        },
        data:{
            triggerId:trigger.id
        }
    })
    
    return ceed.id;
  })

  return res.json({ ceedId })

})
//@ts-ignore
router.get("/", authMiddleware,async (req,res)=>{
    //@ts-ignore
    const id = req.id;
    const ceeds = await prismaClient.ceed.findMany({
        where:{
            userId : id
        },
        include:{
            actions:{
                include:{
                    type: true
                }
            },
            trigger:{
                include:{
                    type: true
                }
            }
        }
    });
    
    return res.json({
        ceeds
    })
}) 
//@ts-ignore
router.get("/:ceedId", authMiddleware, async (req,res)=>{
     //@ts-ignore
     const id = req.id;
     const ceedId = req.params.ceedId;

     const ceed = await prismaClient.ceed.findFirst({
         where:{
            id: ceedId,
            userId : id
             
         },
         include:{
             actions:{
                 include:{
                     type: true
                 }
             },
             trigger:{
                 include:{
                     type: true
                 }
             }
         }
     })
    
     return res.json({
        ceed 
     })
})

export const ceedRouter = router;