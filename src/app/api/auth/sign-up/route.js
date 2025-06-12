import dbConnect from "@/lib/dbConnect";
import User from "@/model/user";
import TempUser from "@/model/tempUser";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req) {
    try {
        await dbConnect();

        const { username, email, password } = await req.json();

        // Validate input
        if (!username || !email || !password) {
            return new Response(JSON.stringify({ success: false, error: "All fields are required" }), { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{username}, {email}]})

        if(existingUser){
            return new Response(JSON.stringify({ success: false, error: "User with this email or username already exists" }), { status: 409 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create verify code only numbers 10 minute expiry
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifyCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        //check tempuser
        const existingTempUser = await TempUser.findOne({ $or: [{username}, {email}] });

        if(existingTempUser){
            await TempUser.findByIdAndDelete(existingTempUser._id);
        }

        const tempUser = new TempUser({
            username,
            email,
            password: hashedPassword,
            profilePicture: "",
            verifyCode,
            verifyCodeExpires
        });
        await tempUser.save();

        if(!tempUser){
            return new Response(JSON.stringify({ success: false, error: "User Not Created!" }), { status: 500 });
        }

        const emailSent = await sendVerificationEmail({
            to: tempUser.email,
            username: tempUser.username,
            verifyCode: tempUser.verifyCode
        });

        if (!emailSent.success) {
            return new Response(JSON.stringify({ success: false, error: emailSent.error }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, message: "Verification code sent successfully. Please check your email." }), { status: 201 });

    } catch (error) {
        console.log("Error in sign-up route:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), { status: 500 });
    }
}