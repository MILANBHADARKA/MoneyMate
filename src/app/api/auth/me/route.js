import dbConnect from "@/lib/dbConnect";
import User from "@/model/user";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await dbConnect();
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return new Response(JSON.stringify({ success: false, error: "Not authenticated" }), { status: 401 });
    }

    const decoded = verifyToken(token.value);

    // If the token is invalid or expired, decoded will be null
    if (!decoded) {
      return new Response(JSON.stringify({ success: false, error: "Invalid token" }), { status: 401 });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }), { status: 200 });

  } catch (error) {
    console.error("Auth error:", error);
    return new Response(JSON.stringify({ success: false, error: "Internal server error" }), { status: 500 });
  }
}
