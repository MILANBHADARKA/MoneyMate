import SplitRoom from "@/model/splitRoom";
import User from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import { cookies } from 'next/headers';
import { verifyToken } from "@/lib/jwt";

export async function POST(request) {
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

        const mongoUser = await User.findById({ _id: user.id });

        if (!mongoUser) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
        }

        const { roomId } = await request.json();

        if (!roomId) {
            return new Response(JSON.stringify({ success: false, error: "Room ID is required" }), { status: 400 });
        }

        const splitRoom = await SplitRoom.findById(roomId);

        if (!splitRoom) {
            return new Response(JSON.stringify({ success: false, error: "Split room not found" }), { status: 404 });
        }

        if (splitRoom.users.includes(user.id) || mongoUser.splitRooms.includes(splitRoom._id)) {
            return new Response(JSON.stringify({ success: false, error: "You are already a member of this split room" }), { status: 409 });
        }

        splitRoom.users.push(user.id);
        await splitRoom.save();

        mongoUser.splitRooms.push(splitRoom._id);
        await mongoUser.save();


        return new Response(JSON.stringify({ success: true, message: "Joined split room successfully", splitRoom }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.log('Error joining split room:', error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}