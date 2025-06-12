import dbConnect from "@/lib/dbConnect";
import TempUser from "@/model/tempUser";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req) {
    try {
        await dbConnect();

        const { email } = await req.json();

        if (!email) {
            return new Response(JSON.stringify({ success: false, error: "Email is required" }), { status: 400 });
        }

        const tempUser = await TempUser.findOne({ email });

        if (!tempUser) {
            return new Response(JSON.stringify({ success: false, error: "No pending verification found for this email" }), { status: 404 });
        }

        // Generate new verification code
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifyCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Update temp user with new code
        tempUser.verifyCode = verifyCode;
        tempUser.verifyCodeExpires = verifyCodeExpires;
        await tempUser.save();

        const emailSent = await sendVerificationEmail({
            to: tempUser.email,
            username: tempUser.username,
            verifyCode: tempUser.verifyCode
        });

        if (!emailSent.success) {
            return new Response(JSON.stringify({ success: false, error: emailSent.error }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, message: "Verification code resent successfully" }), { status: 200 });

    } catch (error) {
        console.error("Error resending verification:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), { status: 500 });
    }
}
