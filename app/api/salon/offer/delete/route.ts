import { NextResponse } from "next/server";
import { OfferRepository } from "@/repositories/SupportRepositories";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
    try {
        const { offerId } = await req.json();

        if (!offerId) {
            return NextResponse.json({ success: false, message: "offerId is required" }, { status: 400 });
        }

        // Verify ownership
        const offer = await OfferRepository.findById(offerId);
        if (!offer || offer.salonId.toString() !== decoded.salonId.toString()) {
            return NextResponse.json({ success: false, message: "Forbidden: You do not own this offer" }, { status: 403 });
        }

        await OfferRepository.deleteOne({ _id: offerId });

        return NextResponse.json({
            success: true,
            message: "Offer deleted",
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

export const DELETE = withAuth(handler, ["salon_owner", "super_admin"]);
