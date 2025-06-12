import User from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import { cookies } from 'next/headers';
import { verifyToken } from "@/lib/jwt";

export async function GET(req) {
    try {
        await dbConnect();

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), { status: 401 });
        }

        const user = verifyToken(token);
        // console.log("User from token:", user);

        if (!user) {
            return new Response(JSON.stringify({ success: false, error: "Invalid token" }), { status: 401 });
        }

        const mongoUser = await User.findById({ _id: user.id }).select('-password -verifyCode -verifyCodeExpires');

        if (!mongoUser) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, user: mongoUser }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.log('Error fetching user:', error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), { status: 500 });
    }
}