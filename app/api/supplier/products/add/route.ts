import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import MarketplaceProduct from "@/models/MarketplaceProduct";
import { withAuth } from "@/lib/apiAuth";

async function postHandler(req: Request, decoded: any) {
    try {
        await dbConnect();
        const body = await req.json();

        if (!body.name || !body.price) {
            return NextResponse.json({ success: false, message: "Missing required fields" });
        }

        const product = await MarketplaceProduct.create({
            ...body,
            supplierId: decoded.userId // Get supplierId from authenticated session
        });
        
        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}

export const POST = withAuth(postHandler, ["supplier"]);

