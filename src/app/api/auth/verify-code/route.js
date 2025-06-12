import dbConnect from "@/lib/dbConnect";
import TempUser from "@/model/tempUser";
import User from "@/model/user";

export async function POST(req) {
    try {
        await dbConnect();

        const { email, verifyCode } = await req.json();

        // Validate input
        if (!email || !verifyCode) {
            return new Response(JSON.stringify({ success: false, error: "Email and verification code are required" }), { status: 400 });
        }

        // Find the temporary user by email and verify code
        const tempUser = await TempUser.findOne({ 
            email, 
            verifyCode, 
            verifyCodeExpires: { $gt: Date.now() } 
        });

        if (!tempUser) {
            return new Response(JSON.stringify({ success: false, error: "Invalid verification code or email" }), { status: 400 });
        }

        // Create a new user with the verified details  
        const newUser = new User({
            username: tempUser.username,
            email: tempUser.email,
            password: tempUser.password, // This is already hashed
            profilePicture: tempUser.profilePicture || "",
        });
        
        try {
            await newUser.save();
        } catch (saveError) {
            console.log("User save error:", saveError);
            return new Response(JSON.stringify({ success: false, error: "Failed to create user: " + saveError.message }), { status: 500 });
        }

        if(!newUser) {
            return new Response(JSON.stringify({ success: false, error: "User Not Created!" }), { status: 500 });
        }

        // Delete the temporary user
        await TempUser.findByIdAndDelete(tempUser._id);

        const createdUser = await User.findById(newUser._id).select("-password")

        if(!createdUser) {
            return new Response(JSON.stringify({ success: false, error: "User Not Created!" }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, message: "User created successfully", user: createdUser }), { status: 201 });

    } catch (error) {
        console.log("Error verifying code:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error: " + error.message }), { status: 500 });
    }
}

// export const dynamic = "force-dynamic"; // Ensure this route is always fresh
// export const revalidate = 0; // Disable revalidation for this route
// export const runtime = "edge"; // Use Edge runtime for better performance
// export const preferredRegion = "auto"; // Automatically select the best region for deployment
// export const fetchCache = "force-no-store"; // Disable caching for this route
// export const runtimeCache = "force-no-store"; // Disable runtime caching for this route
// export const maxDuration = 60; // Set a maximum duration for the request to complete
// export const tags = ["verify-code"]; // Tag for this route
// export const fetchPriority = "high"; // Set high priority for fetching this route

