import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail({ to, username, verifyCode }) {
    try {
        
        const { data, error } = await resend.emails.send({
            from: "MoneyMate <moneymate@themoneymate.xyz>",
            to,
            subject: "MoneyMate - Email Verification",
            react: VerificationEmail({
                username,verifyCode
            })
        });

        if (error) {
            console.error("Error sending email:", error);
            return {
                success: false,
                error: "Failed to send verification email"
            };
        }

        return {
            success: true,
            message: "Verification email sent successfully",
            data
        };

    } catch (emailError) {
        console.log("Error sending verification email:", emailError);
        return {
            success: false,
            error: "Failed to send verification email"
        };
    }
}