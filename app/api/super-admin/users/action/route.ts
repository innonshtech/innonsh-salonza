import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { userId, action } = await req.json(); // action: "verify" or "reject"

        if (!userId || !action) {
            return NextResponse.json({ success: false, message: "Missing userId or action" });
        }

        const status = action === "verify" ? "verified" : "rejected";

        const user = await User.findByIdAndUpdate(userId, {
            verificationStatus: status
        }, { new: true });

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        return NextResponse.json({
            success: true,
            message: `Supplier ${status} successfully`,
            user
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
}
