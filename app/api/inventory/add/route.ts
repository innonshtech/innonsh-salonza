import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
    try {
        await dbConnect();
        const body = await req.json();

        // IDOR Protection: Always use salonId from JWT
        const salonId = decoded.salonId;
        if (!salonId) {
            return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
        }

        if (!body.name || body.price === undefined) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const product = await Product.create({
            ...body,
            salonId: salonId // Overwrite any salonId from body
        });
        
        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export const POST = withAuth(handler, ["salon_owner", "super_admin"]);
