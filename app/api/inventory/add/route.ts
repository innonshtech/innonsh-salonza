import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        if (!body.salonId || !body.name || body.price === undefined) {
            return NextResponse.json({ success: false, message: "Missing required fields" });
        }

        const product = await Product.create(body);
        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
