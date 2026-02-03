import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const {
            userId,
            businessName,
            gstNumber,
            businessAddress,
            businessDescription
        } = await req.json();

        if (!userId || !businessName || !gstNumber) {
            return NextResponse.json({ success: false, message: "Missing required fields" });
        }

        const user = await User.findByIdAndUpdate(userId, {
            businessName,
            gstNumber,
            businessAddress,
            businessDescription,
            verificationStatus: "pending"
        }, { new: true });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        return NextResponse.json({
            success: true,
            message: "Verification application submitted successfully",
            user
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
}
