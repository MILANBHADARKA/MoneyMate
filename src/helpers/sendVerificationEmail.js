import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail({ to, username, verifyCode }) {
    try {
        
        await resend.emails.send({
            from: "MoneyMate <onboarding@resend.dev>",
            to,
            subject: "MoneyMate - Email Verification",
            react: VerificationEmail({
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