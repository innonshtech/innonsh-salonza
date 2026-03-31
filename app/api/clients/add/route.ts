import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Client from "@/models/Client";
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

        if (!body.name || !body.phone) {
            return NextResponse.json({ success: false, message: "Name and Phone are required" }, { status: 400 });
        }

        const client = await Client.create({
            ...body,
            salonId: salonId // Overwrite any salonId from body
        });
        
        return NextResponse.json({ success: true, client });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ success: false, message: "A client with this phone number already exists." }, { status: 400 });
        }
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export const POST = withAuth(handler, ["salon_owner", "super_admin"]);
