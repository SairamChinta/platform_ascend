"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_2 = __importDefault(require("express"));
const encryption_1 = require("../lib/encryption");
const client_ses_1 = require("@aws-sdk/client-ses");
const app = (0, express_2.default)();
app.use(express_2.default.json());
const router = (0, express_1.Router)();
const sesClient = new client_ses_1.SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});
//@ts-ignore
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedData = types_1.SignupSchema.safeParse(req.body);
        if (!parsedData.success) {
            console.log(parsedData.error);
            return res.status(411).json({ message: "Incorrect inputs" });
        }
        const { email, password, name } = parsedData.data;
        const userExists = yield db_1.prismaClient.user.findFirst({
            where: { email }
        });
        if (userExists) {
            return res.status(403).json({ message: "User Already Exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield db_1.prismaClient.user.create({
            data: { email, password: hashedPassword, name }
        });
        return res.json({ message: "Account created successfully" });
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
        const user = yield db_1.prismaClient.user.findFirst({ where: { email } });
        if (!user) {
            return res.status(403).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.JWT_PASSWORD, { expiresIn: "1h" });
        res.json({ token });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}));
//@ts-ignore
router.post("/verify-sender", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const user = yield db_1.prismaClient.user.findUnique({
            where: { id: userId },
            select: { email: true, isSenderVerified: true }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isSenderVerified) {
            return res.status(400).json({ message: "Sender email is already verified." });
        }
        const command = new client_ses_1.VerifyEmailIdentityCommand({
            EmailAddress: user.email,
        });
        yield sesClient.send(command);
        return res.json({
            message: `Verification email sent to ${user.email}. Please check your inbox and click the link from Amazon.`
        });
    }
    catch (error) {
        console.error("Verify Sender Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
//@ts-ignore
router.post("/save-key", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { privateKey } = req.body;
        if (!privateKey || typeof privateKey !== 'string') {
            return res.status(400).json({ message: "Invalid private key" });
        }
        // Encrypt the key before saving
        const encryptedKey = (0, encryption_1.encrypt)(privateKey);
        yield db_1.prismaClient.user.update({
            where: { id: userId },
            data: { solanaPrivateKey: encryptedKey }
        });
        return res.json({ message: "Private key saved successfully." });
    }
    catch (error) {
        console.error("Save Key Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}));
//@ts-ignore
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.id;
        let user = yield db_1.prismaClient.user.findFirst({
            where: { id },
            // Update select to fetch solanaPrivateKey
            select: {
                id: true,
                name: true,
                email: true,
                isSenderVerified: true,
                solanaPrivateKey: true // <-- Add this
            }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Auto-heal logic for sender verification
        try {
            const command = new client_ses_1.GetIdentityVerificationAttributesCommand({
                Identities: [user.email]
            });
            const response = yield sesClient.send(command);
            const attributes = response.VerificationAttributes;
            const awsStatus = attributes && attributes[user.email] ? attributes[user.email].VerificationStatus : "Failed";
            const isVerifiedOnAWS = awsStatus === "Success";
            if (isVerifiedOnAWS !== user.isSenderVerified) {
                user = yield db_1.prismaClient.user.update({
                    where: { id: user.id },
                    data: { isSenderVerified: isVerifiedOnAWS },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        isSenderVerified: true,
                        solanaPrivateKey: true // <-- Add this here too
                    }
                });
            }
        }
        catch (awsError) {
            console.error("AWS GetIdentityVerification Error:", awsError);
        }
        // Return user data, but replace the actual key with a boolean
        const { id: userId, solanaPrivateKey } = user, userWithoutKey = __rest(user, ["id", "solanaPrivateKey"]);
        const finalUser = Object.assign(Object.assign({}, userWithoutKey), { isSolKeySet: !!solanaPrivateKey // Send a boolean to the frontend
         });
        return res.json({ user: finalUser });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
}));
exports.userRouter = router;
