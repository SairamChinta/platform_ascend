import nodemailer from "nodemailer";

 const transport = nodemailer.createTransport({
        host: process.env.SMTP_ENDPOINT,
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

export async function sendEmail(to: string | undefined, body: string | undefined) {
    if (!to) {
        console.error("Email recipient is missing!");
        return;
    }
    if (!body) {
        console.error("Email body is missing!");
        return;
    }
   try {
    transport.sendMail({
    from:"sairamyadav694@gmail.com",
    sender:"sairamyadav694@gmail.com",
    to,
    subject:"Hello! from Ascend-platform",
    text:body
   })
   } catch (error) {
    console.error("error sending email:",error)
   }
}