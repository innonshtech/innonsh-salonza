import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Client from "@/models/Client";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        if (!body.salonId || !body.name || !body.phone) {
            return NextResponse.json({ success: false, message: "Name and Phone are required" });
        }

        const client = await Client.create(body);
        return NextResponse.json({ success: true, client });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: "A client with this phone number already exists." });
        }
        return NextResponse.json({ success: false, error: error.message });
    }
}
