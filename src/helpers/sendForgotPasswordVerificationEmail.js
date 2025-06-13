import { resend } from "@/lib/resend";
import ForgotPasswordEmailVerification from "../../emails/ForgotPasswordVerificationEmail";

export async function sendForgotPasswordVerificationEmail({ to, username, verifyCode }) {
    try {
        
        const { data, error } = await resend.emails.send({
            from: "MoneyMate <moneymate@themoneymate.xyz>",
            to,
            subject: "MoneyMate - Reset Password",
            react: ForgotPasswordEmailVerification({
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