import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MarketplaceProduct from "@/models/MarketplaceProduct";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // In a real app, we'd get supplierId from the session
        if (!body.supplierId || !body.name || !body.price) {
            return NextResponse.json({ success: false, message: "Missing required fields" });
        }

        const product = await MarketplaceProduct.create(body);
        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
