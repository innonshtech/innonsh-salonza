import { NextResponse } from "next/server";
import { InventoryRepository } from "@/repositories/InventoryRepository";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
    try {
        // IDOR Protection: Always use salonId from JWT for owners
        const salonId = decoded.salonId;
        if (!salonId && decoded.role !== "super_admin") {
            return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const targetSalonId = decoded.role === "super_admin" ? (searchParams.get("salonId") || salonId) : salonId;

        if (!targetSalonId) {
            return NextResponse.json({ success: false, message: "Salon ID required for admin view" }, { status: 400 });
        }

        const products = await InventoryRepository.find({ salonId: targetSalonId });
        return NextResponse.json({ success: true, products });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export const GET = withAuth(handler, ["salon_owner", "super_admin"]);
