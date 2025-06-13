import User from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import { sendForgotPasswordVerificationEmail } from "@/helpers/sendForgotPasswordVerificationEmail";

export async function POST(req) {
    try {
        await dbConnect();

        const { email } = await req.json();

        if (!email) {
            return new Response(JSON.stringify({ success: false, error: "Email is required" }), { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
        }

        // Generate a verification code and expiry time
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifyCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Update the user with the verification code and expiry
        user.verifyCode = verifyCode;
        user.verifyCodeExpires = verifyCodeExpires;
        
        await user.save();

        const emailSent = await sendForgotPasswordVerificationEmail({
            to: user.email,
            username: user.username,
            verifyCode: user.verifyCode
        });

        // console.log("Email sent status:", emailSent);

        if (!emailSent.success) {
            return new Response(JSON.stringify({ success: false, error: emailSent.error }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, message: "Verification code sent to your email" }), { status: 200 });

       
    } catch (error) {
        console.error("Error in forgot password route:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), { status: 500 });
    }
}