import { resend } from "@/lib/resend";
import ForgotPasswordEmailVerification from "../../emails/ForgotPasswordVerificationEmail";

export async function sendForgotPasswordVerificationEmail({ to, username, verifyCode }) {
    try {
        
        await resend.emails.send({
            from: "MoneyMate <onboarding@resend.dev>",
            to,
            subject: "MoneyMate - Reset Password",
            react: ForgotPasswordEmailVerification({
                username,verifyCode
            }),
            headers: {
                "X-Email-Verification": "true"
            }
        });

        return {
            success: true,
            message: "Verification email sent successfully"
        }
    } catch (emailError) {
        console.log("Error sending verification email:", emailError);
        return {
            success: false,
            error: "Failed to send verification email"
        };
    }
}