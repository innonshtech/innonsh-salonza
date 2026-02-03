// /api/salon/offer/delete/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Offer from "@/models/Offer";

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const { offerId } = await req.json();

        if (!offerId) {
            return NextResponse.json({ success: false, message: "offerId is required" });
        }

        await Offer.findByIdAndDelete(offerId);

        return NextResponse.json({
            success: true,
            message: "Offer deleted",
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
    }
}
