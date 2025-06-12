import User from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import { cookies } from 'next/headers';
import { verifyToken } from "@/lib/jwt";
import { cloudinary } from "@/lib/cloudinary";

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

        const { id } = await params;

        if (user.id.toString() !== id.toString()) {
            return new Response(JSON.stringify({ success: false, error: "Forbidden" }), { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get('file');

        let mongoUser = await User.findById(id);

        if (!mongoUser) {
            return new Response(JSON.stringify({ success: false, error: "User not found" }), { status: 404 });
        }

        if (file) {
            // Convert file to buffer
            const buffer = await file.arrayBuffer();

            // Convert buffer to base64 string
            const base64String = Buffer.from(buffer).toString('base64');

            // Create data URI
            const dataURI = `data:${file.type};base64,${base64String}`;

            // Upload to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(dataURI, {
                folder: 'moneymate_user_profile_pictures',
                resource_type: 'image',
                transformation: [
                    { width: 200, height: 200, crop: 'fill' }
                ]
            });

            if (!uploadResult || !uploadResult.secure_url) {
                return new Response(JSON.stringify({ success: false, error: "Failed to upload image" }), { status: 500 });
            }

            // Update user avatar URL as string
            mongoUser.profilePicture = uploadResult.secure_url;
            await mongoUser.save();

            mongoUser = await User.findById(id).select('-password -verifyCode -verifyCodeExpires');

            return new Response(JSON.stringify({ success: true, message: "Profile Picture updated Successfully!", user: mongoUser }), { status: 200 });
        }

        return new Response(JSON.stringify({ success: false, error: "No valid fields to update" }), { status: 400 });

    } catch (error) {
        console.log("Error in profile picture update route:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), { status: 500 });
    }
}