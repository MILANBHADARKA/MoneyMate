import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create a transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true, // Enable debugging
    logger: true  // Enable logging
});

// Function to send an email
const sendMail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text, // Plain text version
            html  // HTML version
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
        return info;
    } catch (error) {
        console.error("Error sending email: ", error);
        throw error;
    }
};

export { sendMail };
