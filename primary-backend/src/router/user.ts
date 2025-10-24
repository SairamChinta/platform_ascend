import { Router } from "express";
import { authMiddleware } from "../middleware";
import { SigninSchema, SignupSchema } from "../types";
import { prismaClient } from "../db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";
import bcrypt from "bcrypt"; 
import express from "express";
import { encrypt } from "../lib/encryption";
import { SESClient, 
    VerifyEmailIdentityCommand,
    GetIdentityVerificationAttributesCommand,
    GetIdentityVerificationAttributesCommandOutput } from "@aws-sdk/client-ses";

const app = express();
app.use(express.json());
const router = Router();

const sesClient = new SESClient({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    }
});

//@ts-ignore
router.post("/signup", async (req, res) => {
    
    try {
        const parsedData = SignupSchema.safeParse(req.body);

        if (!parsedData.success) {
            console.log(parsedData.error);
            return res.status(411).json({ message: "Incorrect inputs" });
        }

        const { email, password, name } = parsedData.data;

        const userExists = await prismaClient.user.findFirst({
            where: { email }
        });

        if (userExists) {
            return res.status(403).json({ message: "User Already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prismaClient.user.create({
            data: { email, password: hashedPassword, name }
        });

        return res.json({ message: "Account created successfully" });

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
  
      const user = await prismaClient.user.findFirst({ where: { email } });
  
      if (!user) {
        return res.status(403).json({ message: "Invalid credentials" });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(403).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ id: user.id }, JWT_PASSWORD, { expiresIn: "1h" });
  
      res.json({ token });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  });

//@ts-ignore
router.post("/verify-sender", authMiddleware, async (req, res) => {
    try {
        const userId = (req as any).id;

        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            select: { email: true, isSenderVerified: true }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isSenderVerified) {
             return res.status(400).json({ message: "Sender email is already verified." });
        }

        const command = new VerifyEmailIdentityCommand({
            EmailAddress: user.email,
        });

        await sesClient.send(command);

        return res.json({ 
            message: `Verification email sent to ${user.email}. Please check your inbox and click the link from Amazon.` 
        });

    } catch (error) {
        console.error("Verify Sender Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
//@ts-ignore
router.post("/save-key", authMiddleware, async (req, res) => {
    try {
        const userId = (req as any).id;
        const { privateKey } = req.body;

        if (!privateKey || typeof privateKey !== 'string') {
            return res.status(400).json({ message: "Invalid private key" });
        }

        // Encrypt the key before saving
        const encryptedKey = encrypt(privateKey);

        await prismaClient.user.update({
            where: { id: userId },
            data: { solanaPrivateKey: encryptedKey }
        });

        return res.json({ message: "Private key saved successfully." });

    } catch (error) {
        console.error("Save Key Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//@ts-ignore
router.get("/", authMiddleware, async (req, res) => {
    try {
        const id = (req as any).id;

        let user = await prismaClient.user.findFirst({
            where: { id },
            select: { 
                id: true, 
                name: true, 
                email: true, 
                isSenderVerified: true,
                solanaPrivateKey: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        try {
            const command = new GetIdentityVerificationAttributesCommand({
                Identities: [user.email]
            });
            const response = await sesClient.send(command) as GetIdentityVerificationAttributesCommandOutput;
            
            const attributes = response.VerificationAttributes;
            const awsStatus = attributes && attributes[user.email] ? attributes[user.email].VerificationStatus : "Failed";
            const isVerifiedOnAWS = awsStatus === "Success";

            if (isVerifiedOnAWS !== user.isSenderVerified) {
                user = await prismaClient.user.update({
                    where: { id: user.id },
                    data: { isSenderVerified: isVerifiedOnAWS },
                    select: { 
                        id: true, 
                        name: true, 
                        email: true, 
                        isSenderVerified: true,
                        solanaPrivateKey: true
                    }
                });
            }
        } catch (awsError) {
            console.error("AWS GetIdentityVerification Error:", awsError);
        }

        // Return user data, but replace the actual key with a boolean
        const { id: userId, solanaPrivateKey, ...userWithoutKey } = user;
        const finalUser = {
            ...userWithoutKey,
            isSolKeySet: !!solanaPrivateKey
        };

        return res.json({ user: finalUser });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});

export const userRouter = router;