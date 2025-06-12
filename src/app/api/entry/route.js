import Customer from "@/model/customer";
import Entry from "@/model/entry";
import dbConnect from "@/lib/dbConnect";

export async function POST(req) {
    try {

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const customerId = searchParams.get("customerId");

        const { amount, reason, entryType } = await req.json();

        if (!customerId) {
            return new Response(JSON.stringify({ success: false, error: "Customer ID is required" }), { status: 400 });
        }

        if (!amount || amount.toString().trim() === "") {
            return new Response(JSON.stringify({ success: false, error: "Amount is required" }), { status: 400 });
        }

        if (!entryType || (entryType !== "You Gave" && entryType !== "You Get")) {
            return new Response(JSON.stringify({ success: false, error: "Entry type must be either 'income' or 'expense'" }), { status: 400 });
        }

        const customer = await Customer.findById(customerId);

        if (!customer) {
            return new Response(JSON.stringify({ success: false, error: "Customer not found" }), { status: 404 });
        }

        const entry = await Entry.create({
            amount,
            entryType,
            reason: reason || '',
            customer: customerId,
        });

        if (!entry) {
            return new Response(JSON.stringify({ success: false, error: "Entry not created" }), { status: 500 });
        }

        customer.entries.push(entry._id);
        await customer.save();

        const createdEntry = await Entry.findById(entry._id);

        if (!createdEntry) {
            return new Response(JSON.stringify({ success: false, error: "Entry not created" }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, message: "Entry created successfully", entry: createdEntry }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.log("Error creating entry:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}


export async function GET(req, { params }) {
    try {

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const customerId = searchParams.get("customerId");

        if (!customerId) {
            return new Response(JSON.stringify({ success: false, error: "Customer ID is required" }), { status: 400 });
        }

        const entries = await Entry.find({ customer: customerId });

        if (!entries || entries.length === 0) {
            return new Response(JSON.stringify({ success: false, error: "No entries found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ success: true, entries }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.log("Error fetching entries:", error);
        return new Response(JSON.stringify({ success: false, error: "Internal server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}