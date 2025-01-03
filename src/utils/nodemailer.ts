import logger from "../logger/logger";

const nodemailer = require('nodemailer');

// Create a transporter object using the Outlook SMTP service
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Correct SMTP server for Gmail
    port: 587,               // Use port 587 for TLS (recommended)
    secure: false, 
    auth: {
        user: 'laxis1598@gmail.com', // Your Outlook email address
        pass: 'ckxv gfhu dgbs mtkm' // Your Outlook password (or App password if 2FA is enabled)
    }
});

/**
 * 
 * @param from 
 * @param to 
 * @param subject 
 * @param text 
 * @param html 
 */
export const sendEmail = (from : string, to: string, subject: string, text: string, html: string) => {

    const mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html
    }
    // Send the email
    transporter.sendMail(mailOptions, (error: any, info: any) => {
        console.log()
        if (error) {
         logger.info('Error sending email:', error);
        } else {
            logger.log('Email sent:', info.response);
        }
    });
}

