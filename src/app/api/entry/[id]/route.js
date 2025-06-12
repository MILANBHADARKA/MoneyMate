import Entry from "@/model/entry";
import Customer from "@/model/customer";
import dbConnect from "@/lib/dbConnect";

export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = params;

        if (!id) {
            return new Response(JSON.stringify({ success: false, error: "Entry ID is required" }), { status: 400 });
        }

        const entry = await Entry.findById(id);

        if (!entry) {
            return new Response(JSON.stringify({ success: false, error: "Entry not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, entry }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.log("Error fetching entry:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}


export async function PUT(req, { params }) {
    try {
        await dbConnect();

        const { id } = params;

        if (!id) {
            return new Response(JSON.stringify({ success: false, error: "Entry ID is required" }), { status: 400 });
        }

        const { amount, reason } = await req.json();

        if (!amount || amount.toString().trim() === "") {
            return new Response(JSON.stringify({ success: false, error: "Amount is required" }), { status: 400 });
        }

        const entry = await Entry.findByIdAndUpdate(id, {
            amount,
            reason: reason || '',
        }, { new: true });

        if (!entry) {
            return new Response(JSON.stringify({ success: false, error: "Entry not updated" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, message: "Entry updated successfully", entry }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.log("Error updating entry:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}


export async function DELETE(req, { params }) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const customerId = searchParams.get("customerId");

        const { id } = params;

        if (!id) {
            return new Response(JSON.stringify({ success: false, error: "Entry ID is required" }), { status: 400 });
        }

        const entry = await Entry.findByIdAndDelete(id);

        if (!entry) {
            return new Response(JSON.stringify({ success: false, error: "Entry not found" }), { status: 404 });
        }

        const customer = await Customer.findById(customerId);

        if (!customer) {
            return new Response(JSON.stringify({ success: false, error: "Customer not found" }), { status: 404 });
        }

        customer.entries = customer.entries.filter(e => e.toString() !== id);
        await customer.save();

        return new Response(JSON.stringify({ success: true, message: "Entry deleted successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.log("Error deleting entry:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}