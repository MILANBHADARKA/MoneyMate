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

        const { name } = await request.json();

        if (!name || name.trim() === "") {
            return new Response(JSON.stringify({ success: false, error: "Room name is required" }), { status: 400 });
        }

        const splitRoom = new SplitRoom({
            name,
            createdBy: user.id,
            users: [user.id],
        });

        await splitRoom.save();

        const createdSplitRoom = await SplitRoom.findById(splitRoom._id);

        if (!createdSplitRoom) {
            return new Response(JSON.stringify({ success: false, error: "Split room not created" }), { status: 500 });
        }

        mongoUser.splitRooms.push(createdSplitRoom._id);
        await mongoUser.save();

        return new Response(JSON.stringify({ success: true, message: "Split room created successfully", splitRoom: createdSplitRoom }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.log('Error creating split room:', error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}



export async function GET() {
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

        const mongoUser = await User.findById({ _id: user.id }).populate('splitRooms');

        if (!mongoUser) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
        }

        if (!mongoUser.splitRooms || mongoUser.splitRooms.length === 0) {
            return new Response(JSON.stringify({ success: false, error: "No split rooms found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, splitRooms: mongoUser.splitRooms }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.log('Error fetching split rooms:', error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}   