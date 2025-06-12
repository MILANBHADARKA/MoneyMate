import Customer from "@/model/customer";
import User from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import { cookies } from 'next/headers';
import { verifyToken } from "@/lib/jwt";

export async function POST(req) {
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

        const { name } = await req.json();
        // console.log(name);

        if (!name || name.trim() === "") {
            return new Response(JSON.stringify({ success: false, error: "Customer name is required" }), { status: 400 });
        }

        const existingCustomer = await Customer.findOne({ name, user: user.id });

        if (existingCustomer) {
            return new Response(JSON.stringify({ success: false, error: "Customer with this name already exists" }), { status: 409 });
        }
        
        const cusomer = new Customer({
            name,
            user: user.id,
        });
        await cusomer.save();


        if (!cusomer) {
            return new Response(JSON.stringify({ success: false, error: "Customer not created" }), { status: 500 });
        }

        const mongoUser = await User.findById({ _id: user.id });
        mongoUser.customers.push(cusomer._id);
        await mongoUser.save();

        const createdCustomer = await Customer.findById(cusomer._id);

        if (!createdCustomer) {
            return new Response(JSON.stringify({ success: false, error: "Customer not created" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, message: "Customer created successfully", customer: createdCustomer }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.log("Error creating customer:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });       
    }
}

export async function GET(req) {
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

        const customers = await Customer.find({ user: user.id });
        // console.log("Customers found:", customers);

        if (!customers || customers.length === 0) {
            return new Response(JSON.stringify({ success: false, error: "No customers found" }), { status: 404 });
        }

        const customerCount = await Customer.countDocuments({ user: user.id });

        return new Response(JSON.stringify({ success: true, customers, count: customerCount }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.log("Error fetching customers:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}