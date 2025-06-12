import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    },
    // debug: true, 
    // logger: true  
});


const sendMail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to,
            subject,
            text, 
            html  
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
