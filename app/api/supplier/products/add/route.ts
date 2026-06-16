import { NextResponse } from "next/server";
import { MarketplaceProductRepository } from "@/repositories/SupportRepositories";
import { withAuth } from "@/lib/apiAuth";

async function postHandler(req: Request, decoded: any) {
    try {
        const body = await req.json();

        if (!body.name || !body.price) {
            return NextResponse.json({ success: false, message: "Missing required fields" });
        }

        const product = await MarketplaceProductRepository.create({
            ...body,
            supplierId: decoded.userId // Get supplierId from authenticated session
        });
        
        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message });
    }
}

export const POST = withAuth(postHandler, ["supplier"]);

