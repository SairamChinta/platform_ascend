import nodemailer from "nodemailer";

 const transport = nodemailer.createTransport({
        host: process.env.SMTP_ENDPOINT,
        port: 587,
        secure: false, 
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

export async function sendEmail(to: string | undefined, body: string | undefined, userEmail: string) {
    
    if (!to || to.trim() === "") {
        console.error(`Email recipient (to:) is missing or empty. Skipping email.`);
        return;
    }
    if (!userEmail || userEmail.trim() === "") {
        console.error(`Email sender (from:) is missing or empty. Skipping email.`);
        return;
    }
    if (!body) {
        console.error(`Email body is missing. Skipping email.`);
        return;
    }

   try {
    console.log(`Sending email from ${userEmail} to ${to}...`);

    await transport.sendMail({
        from: userEmail,
        sender: userEmail,
        to,
        subject: "Message from Ascend-platform",
        text: body
    });

    console.log(`Email successfully sent to ${to}`);

   } catch (error) {
    console.error("Error sending email:", error)
   }
}