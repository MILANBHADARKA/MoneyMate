import User from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export async function POST(req){
    try {
        await dbConnect();

        const { email, newPassword, verifyCode } = await req.json();

        // Validate input
        if (!email || !newPassword || !verifyCode) {
            return new Response(JSON.stringify({ success: false, error: "All fields are required!" }), { status: 400 });
        }

        const user = await User.findOne({ 
            email, 
            verifyCode,
            verifyCodeExpires: { $gt: Date.now() }
         });

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "Invalid verification code or email" }), { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.verifyCode = null; 
        user.verifyCodeExpires = null; 
        await user.save();

        return new Response(JSON.stringify({ success: true, message: "Password reset successfully" }), { status: 200 });

    } catch (error) {
        console.log("Error in reset password route:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), { status: 500 });
    }
}