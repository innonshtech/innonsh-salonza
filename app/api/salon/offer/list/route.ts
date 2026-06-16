// /api/salon/offer/list/route.ts

import { NextResponse } from "next/server";
import { OfferRepository } from "@/repositories/SupportRepositories";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const salonId = searchParams.get("salonId");

        if (!salonId) {
            return NextResponse.json({ success: false, message: "salonId is required" });
        }

        const offers = await OfferRepository.find({ salonId });

        return NextResponse.json({
            success: true,
            offers,
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message });
    }
}
