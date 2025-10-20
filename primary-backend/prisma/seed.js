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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prismaClient = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prismaClient.availableTrigger.create({
            data: {
                id: "webhook",
                name: "Webhook",
                image: "https://cdn.iconscout.com/icon/free/png-512/free-webhooks-icon-download-in-svg-png-gif-file-formats--brand-company-logo-world-logos-vol-3-pack-icons-282425.png?f=webp&w=512"
            }
        });
        yield prismaClient.availableAction.create({
            data: {
                id: "email",
                name: "Email",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKck5s3UWdgrr3em_7d49uCjtPSlI_idwekg&s"
            }
        });
        yield prismaClient.availableAction.create({
            data: {
                id: "send-sol",
                name: "Solana",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtfrlTuPfQaeZxHkZeo4KhuloR6S5s2Zxf-Q&s"
            }
        });
    });
}
main();
