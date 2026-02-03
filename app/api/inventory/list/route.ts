import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const salonId = searchParams.get("salonId");

        if (!salonId) {
            return NextResponse.json({ success: false, message: "Salon ID required" });
        }

        const products = await Product.find({ salonId }).sort({ name: 1 });
        return NextResponse.json({ success: true, products });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
