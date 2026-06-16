import { NextResponse } from "next/server";
import { CustomerRepository } from "@/repositories/CustomerRepository";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
    try {
        // IDOR Protection: Always use salonId from JWT for owners
        const salonId = decoded.salonId;

        if (!salonId && decoded.role !== "super_admin") {
            return NextResponse.json({ success: false, message: "Unauthorized: No salon associated with this account" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const targetSalonId = decoded.role === "super_admin" ? (searchParams.get("salonId") || salonId) : salonId;

        if (!targetSalonId) {
            return NextResponse.json({ success: false, message: "salonId is required for admin view" }, { status: 400 });
        }

        const clients = await CustomerRepository.find({ salonId: targetSalonId });
        // The original code sorted by lastVisit. In Supabase, the repository does order("name") by default.
        // We can sort in memory by lastVisit if needed, or leave as name-sorted. Let's sort in memory to preserve lastVisit sorting:
        clients.sort((a: any, b: any) => {
            const dateA = a.lastVisit ? new Date(a.lastVisit).getTime() : 0;
            const dateB = b.lastVisit ? new Date(b.lastVisit).getTime() : 0;
            return dateB - dateA;
        });

        return NextResponse.json({ success: true, clients });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export const GET = withAuth(handler, ["salon_owner", "super_admin"]);
