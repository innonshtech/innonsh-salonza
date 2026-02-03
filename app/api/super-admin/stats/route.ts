import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Salon from "@/models/Salon";
import MarketplaceProduct from "@/models/MarketplaceProduct";

export async function GET() {
    try {
        await dbConnect();

        const totalSalons = await Salon.countDocuments();
        const totalSuppliers = await User.countDocuments({ role: "supplier" });
        const verifiedSuppliers = await User.countDocuments({ role: "supplier", verificationStatus: "verified" });
        const pendingVerifications = await User.find({ role: "supplier", verificationStatus: "pending" });
        const totalProducts = await MarketplaceProduct.countDocuments();

        return NextResponse.json({
            success: true,
            stats: {
                totalSalons,
                totalSuppliers,
                verifiedSuppliers,
                pendingCount: pendingVerifications.length,
                totalProducts
            },
            pendingVerifications
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
}
