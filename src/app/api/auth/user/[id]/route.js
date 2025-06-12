import User from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import { cookies } from 'next/headers';
import { verifyToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function PUT(request, { params }) {
    try {
        await dbConnect();

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
        }

        const user = verifyToken(token);

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "Invalid token" }), { status: 401 });
        }

        const { id } = params;
        // console.log("User ID from params:", id.toString());
        // console.log("User ID from token:", user.id.toString());

        if (user.id.toString() !== id.toString()) {
            return new Response(JSON.stringify({ success: false, error: "Forbidden" }), { status: 403 });
        }

        const body = await request.json();
        const { username, password } = body;

        let mongoUser = await User.findById(id);

        if (!mongoUser) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
        }

        // Update user details
        if (username) {
            if (username.trim() === "") {
                return new Response(JSON.stringify({ success: false, error: "Username cannot be empty" }), { status: 400 });
            }

            const existingUser = await User.findOne({ username });

            if (existingUser && existingUser.id !== id) {
                return new Response(JSON.stringify({ success: false, error: "Username already exists" }), { status: 400 });
            }

            mongoUser.username = username;
            await mongoUser.save();

            mongoUser = await User.findById(id).select('-password -verifyCode -verifyCodeExpires');

            return new Response(JSON.stringify({ success: true, message: "Username updated Successfully!", user: mongoUser }), { status: 200 });
        }

        // Update password
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);

            mongoUser.password = hashedPassword;
            await mongoUser.save();

            mongoUser = await User.findById(id).select('-password -verifyCode -verifyCodeExpires');

            return new Response(JSON.stringify({ success: true, message: "Password updated Successfully!", user: mongoUser }), { status: 200 });
        }

        return new Response(JSON.stringify({ success: false, error: "No valid fields to update" }), { status: 400 });

    } catch (error) {
        console.log('Error updating user:', error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), { status: 500 });
    }
}