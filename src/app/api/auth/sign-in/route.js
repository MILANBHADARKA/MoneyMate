// import User from "@/model/user";
// import dbConnect from "@/lib/dbConnect";
// import bcrypt from "bcryptjs";

// export async function POST(request) {
//     try {

//         // Connect to the database
//         await dbConnect();

//         const { email, password } = await request.json();

//         const user = await User.findOne({ email });

//         if (!user) {
//             return new Response(JSON.stringify({ error: "User not found" }), {
//                 status: 404,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

//         // Check if the password matches
//         const isPasswordValid = await bcrypt.compare(password, user.password);

//         if (!isPasswordValid) {
//             return new Response(JSON.stringify({ error: "Invalid password" }), {
//                 status: 401,
//                 headers: { "Content-Type": "application/json" },
//             });
//         }

        

//     } catch (loginerror) {
//         console.log("Login error:", loginerror);
//         return new Response(JSON.stringify({ error: "Login failed" }), {
//             status: 500,
//             headers: { "Content-Type": "application/json" },
//         });
//     }

// }



import dbConnect from "@/lib/dbConnect";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import { setTokenCookie } from "@/lib/cookies";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ success: false, error: "All fields are required" }), { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new Response(JSON.stringify({ success: false, error: "Invalid credentials" }), { status: 401 });
    }

    const token = generateToken({ id: user._id, email: user.email, username: user.username });

    const cookie = setTokenCookie(token);

    return new Response(JSON.stringify({
      success: true,
      message: "Login successful"
    }), {
      status: 200,
      headers: {
        "Set-Cookie": cookie
      }
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: "Internal Server Error" }), { status: 500 });
  }
}
