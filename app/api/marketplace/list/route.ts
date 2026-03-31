import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MarketplaceProduct from "@/models/MarketplaceProduct";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        let query = { isActive: true };
        if (category) {
            (query as any).category = category;
        }

        const products = await MarketplaceProduct.find(query)
            .populate("supplierId", "name")
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, products });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export const GET = withAuth(handler, ["salon_owner", "super_admin", "supplier"]);
