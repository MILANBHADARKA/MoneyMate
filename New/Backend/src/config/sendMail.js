import { sendMail } from "./emailService.js";

const sendOTP = async (to,otp,otpExpires) => {

    const subject = "Your OTP for MoneyMate";
    const text = `Your OTP is ${otp}. It expires in 10 minutes.`;
    const html = `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`;

    try {
        await sendMail(to, subject, text, html);
        // return { otp, otpExpires };
        return true;
    } catch (error) {
        throw error;
    }
};

export { sendOTP };
