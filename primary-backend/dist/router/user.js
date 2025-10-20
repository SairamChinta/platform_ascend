"use strict";
// import { Router } from "express";
// import { authMiddleware } from "../middleware";
// import { SigninSchema, SignupSchema } from "../types";
// import { prismaClient } from "../db";
// import  jwt  from "jsonwebtoken"
// import { JWT_PASSWORD } from "../config";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
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
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_2 = __importDefault(require("express"));
const app = (0, express_2.default)();
app.use(express_2.default.json());
const router = (0, express_1.Router)();
//@ts-ignore
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = types_1.SignupSchema.safeParse(req.body);
        if (!parsedData.success) {
            console.log(parsedData.error);
            return res.status(411).json({ message: "Incorrect inputs" });
        }
        const { email, password, name } = parsedData.data;
        // Check if user exists
        const userExists = yield db_1.prismaClient.user.findFirst({
            where: { email }
        });
        if (userExists) {
            return res.status(403).json({ message: "User Already Exists" });
        }
        // Hash password before storing
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Create user
        yield db_1.prismaClient.user.create({
            data: { email, password: hashedPassword, name }
        });
        return res.json({ message: "Please verify your account by checking your email" });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}));
//@ts-ignore
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = types_1.SigninSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(411).json({ message: "Incorrect inputs" });
        }
        const { email, password } = parsedData.data;
        // Find user by email
        const user = yield db_1.prismaClient.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(403).json({ message: "Invalid credentials" });
        }
        // Compare password with hashed version in DB
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Invalid credentials" });
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.JWT_PASSWORD, { expiresIn: "1h" });
        res.json({ token });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}));
//@ts-ignore
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.id;
        const user = yield db_1.prismaClient.user.findFirst({
            where: { id },
            select: { name: true, email: true }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json({ user });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}));
exports.userRouter = router;
