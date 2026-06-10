// /api/salon/offer/list/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Offer from "@/models/Offer";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const salonId = searchParams.get("salonId");

        if (!salonId) {
            return NextResponse.json({ success: false, message: "salonId is required" });
        }

        const offers = await Offer.find({ salonId }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            offers,
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
    }
}
