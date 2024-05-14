import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

async function sendEmail(toEmail: any, subject: any) {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_NAME,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            servername: process.env.EMAIL_SERVER_NAME
        }
    });
    const uid = uuidv4();
    const otp = Math.floor(parseInt(uid.replace(/-/g, ''), 16) % 1000000);
    const otpString = otp.toString().padStart(6, '0');
    const htmlFilePath = path.join(__dirname, '../views', 'email.html');
    const htmlContent = await fs.promises.readFile(htmlFilePath, 'utf8');
    const updatedHTMLContent = htmlContent.replace('{{otp}}', otpString);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject,
        html: updatedHTMLContent
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email berhasil dikirim ke ${toEmail}`);
        return otpString
    } catch (error) {
        console.log(`Gagal mengirim email: ${error}`);
    }
}
function validateTimeOtp(created_at:any) {
    const currentTime = new Date().valueOf();
    const otpExpirationTime = created_at + (5 * 60 * 1000);
    if (currentTime > otpExpirationTime) {
        return false;
    }
    return true;
}
export { sendEmail, validateTimeOtp };
