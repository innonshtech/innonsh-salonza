import { NextResponse } from "next/server";
import { MarketplaceProductRepository } from "@/repositories/SupportRepositories";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        let query: any = { isActive: true };
        if (category) {
            query.category = category;
        }

        const products = await MarketplaceProductRepository.find(query);

        return NextResponse.json({ success: true, products });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export const GET = withAuth(handler, ["salon_owner", "super_admin", "supplier"]);
