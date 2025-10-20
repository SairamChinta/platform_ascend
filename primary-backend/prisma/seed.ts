 
 import { PrismaClient } from "@prisma/client";

 const prismaClient = new PrismaClient();

 async function main(){
    await prismaClient.availableTrigger.create({
        data:{
            id:"webhook",
            name:"Webhook",
            image:"https://cdn.iconscout.com/icon/free/png-512/free-webhooks-icon-download-in-svg-png-gif-file-formats--brand-company-logo-world-logos-vol-3-pack-icons-282425.png?f=webp&w=512"
        }
    })
    await prismaClient.availableAction.create({
        data:{
            id:"email",
            name:"Email",
            image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKck5s3UWdgrr3em_7d49uCjtPSlI_idwekg&s"
        }
    })
    await prismaClient.availableAction.create({
        data:{
            id:"send-sol",
            name:"Solana",
            image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtfrlTuPfQaeZxHkZeo4KhuloR6S5s2Zxf-Q&s"
        }
    })
 }
 main();