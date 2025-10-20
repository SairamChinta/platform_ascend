// import { Router } from "express";
// import { authMiddleware } from "../middleware";
// import { SigninSchema, SignupSchema } from "../types";
// import { prismaClient } from "../db";
// import  jwt  from "jsonwebtoken"
// import { JWT_PASSWORD } from "../config";

// const router = Router();
// //@ts-ignore
// router.post("/signup", async (req, res) => {
//     const body = req.body.username;
//     const parsedData = SignupSchema.safeParse(body);

//     if(!parsedData.success){
//         return res.status(411).json({
//             message:"Incorrect inputs"
//         })
//     }

//     const userExists = await prismaClient.user.findFirst({
//         where:{
//             email: parsedData.data.username
//         }
//     });
//     if(userExists){
//         return res.status(403).json({
//             message: "User Already EXists"
//         })
//     }
//     await prismaClient.user.create({
//         data: {
//             email: parsedData.data.username,
//             // we are stored password in plain we have to hash it
//             password: parsedData.data.password,
//             name: parsedData.data.name,
//         }
//     });
// //aawait sendEmail()'
//     return res.json({
//         message:"Please verify your account by checking your email"
//     })
// })
// //@ts-ignore
// router.post("/signin",async (req,res) => {
//     const body = req.body.username;
//     const parsedData = SigninSchema.safeParse(body);

//     if(!parsedData.success){
//         return res.status(411).json({
//             message:"Incorrect inputs"
//         })
//     }

//     const user = await prismaClient.user.findFirst({
//         where: {
//             email: parsedData.data.username,
//             password: parsedData.data.password,
//         }
//     })

//     if(!user){
//         return res.status(403).json({
//             message: "Sorry Credentials are Incorrect"
//         })
//     }
//     //sign jwt
//     const token = jwt.sign({
//         if: user.id,
        
//     },JWT_PASSWORD);

//     res.json({
//         token: token,
//     });

// })
// //@ts-ignore
// router.get("/user", authMiddleware, async (req, res)=>{
//     //todo:fix this type error
//     //@ts-ignore
//     const id = req.id;
//     const user = await prismaClient.user.findFirst({
//         where:{
//             id
//         },select:{
//             name: true,
//             email: true
//         }
//     });

//     return res.json({
//         user
//     });
// })
 
// export const userRouter = router;

import { Router } from "express";
import { authMiddleware } from "../middleware";
import { SigninSchema, SignupSchema } from "../types";
import { prismaClient } from "../db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import bcrypt from "bcrypt"; 
import express from "express";


const app = express();
app.use(express.json());
const router = Router();


//@ts-ignore
router.post("/signup", async (req, res) => {
    
    try {
        const parsedData = SignupSchema.safeParse(req.body);

        if (!parsedData.success) {
            console.log(parsedData.error);
            return res.status(411).json({ message: "Incorrect inputs" });
        }

        const { email, password, name } = parsedData.data;

        // Check if user exists
        const userExists = await prismaClient.user.findFirst({
            where: { email }
        });

        if (userExists) {
            return res.status(403).json({ message: "User Already Exists" });
        }

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await prismaClient.user.create({
            data: { email, password: hashedPassword, name }
        });

        return res.json({ message: "Please verify your account by checking your email" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
   

});

//@ts-ignore
router.post("/signin", async (req, res) => {
    try {
      const parsedData = SigninSchema.safeParse(req.body);
  
      if (!parsedData.success) {
        return res.status(411).json({ message: "Incorrect inputs" });
      }
  
      const { email, password } = parsedData.data;
  
      // Find user by email
      const user = await prismaClient.user.findFirst({ where: { email } });
  
      if (!user) {
        return res.status(403).json({ message: "Invalid credentials" });
      }
  
      // Compare password with hashed version in DB
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(403).json({ message: "Invalid credentials" });
      }
  
      // Create JWT token
      const token = jwt.sign({ id: user.id }, JWT_PASSWORD, { expiresIn: "1h" });
  
      res.json({ token });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  });
  
//@ts-ignore
router.get("/", authMiddleware, async (req, res) => {
    try {
        const id = (req as any).id;

        const user = await prismaClient.user.findFirst({
            where: { id },
            select: { name: true, email: true }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ user });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});

export const userRouter = router;
