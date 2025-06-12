import Customer from "@/model/customer";
import User from "@/model/user";
import { cookies } from 'next/headers';
import { verifyToken } from "@/lib/jwt";
import dbConnect from "@/lib/dbConnect";

export async function GET(req, { params }) {
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

        if (!id) {
            return new Response(JSON.stringify({ success: false, error: "Customer ID is required" }), { status: 400 });
        }

        const customer = await Customer.findOne({ _id: id, user: user.id });

        if (!customer) {
            return new Response(JSON.stringify({ success: false, error: "Customer not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, customer }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });


    } catch (error) {
        console.log("Error fetching customer:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}


export async function PUT(req, { params }){
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

        if (!id) {
            return new Response(JSON.stringify({ success: false, error: "Customer ID is required" }), { status: 400 });
        }

        const { name } = await req.json();

        if (!name) {
            return new Response(JSON.stringify({ success: false, error: "Customer name is required" }), { status: 400 });
        }

        const customer = await Customer.findOne({ _id: id, user: user.id });

        if (!customer) {
            return new Response(JSON.stringify({ success: false, error: "Customer not found" }), { status: 404 });
        }

        customer.name = name;
        await customer.save();

        return new Response(JSON.stringify({ success: true, message: "Customer updated successfully", customer }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
        
    } catch (error) {
        console.log("Error updating customer:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}


export async function DELETE(req, { params }) {
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

        if (!id) {
            return new Response(JSON.stringify({ success: false, error: "Customer ID is required" }), { status: 400 });
        }

        const customer = await Customer.findOneAndDelete({ _id: id, user: user.id });

        if (!customer) {
            return new Response(JSON.stringify({ success: false, error: "Customer not found" }), { status: 404 });
        }

        const mongoUser = await User.findById({ _id: user.id });
        mongoUser.customers = mongoUser.customers.filter(c => c.toString() !== id);

        await mongoUser.save();

        return new Response(JSON.stringify({ success: true, message: "Customer deleted successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.log("Error deleting customer:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}