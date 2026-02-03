import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Client from "@/models/Client";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const salonId = searchParams.get("salonId");

        if (!salonId) {
            return NextResponse.json({ success: false, message: "Salon ID required" });
        }

        const clients = await Client.find({ salonId }).sort({ lastVisit: -1 });
        return NextResponse.json({ success: true, clients });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
