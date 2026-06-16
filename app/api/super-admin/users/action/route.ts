import { NextResponse } from "next/server";
import { UserRepository } from "@/repositories/UserRepository";

export async function POST(req: Request) {
    try {
        const { userId, action } = await req.json(); // action: "verify" or "reject"

        if (!userId || !action) {
            return NextResponse.json({ success: false, message: "Missing userId or action" });
        }

        const status = action === "verify" ? "verified" : "rejected";

        // Check if user exists
        const existingUser = await UserRepository.findById(userId);
        if (!existingUser) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        const user = await UserRepository.update(userId, {
            verification_status: status
        });

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
