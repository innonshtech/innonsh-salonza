import { NextResponse } from "next/server";
import { UserRepository } from "@/repositories/UserRepository";

export async function POST(req: Request) {
    try {
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

        // Verify the user exists first
        const existingUser = await UserRepository.findById(userId);
        if (!existingUser) {
            return NextResponse.json({ success: false, message: "User not found" });
        }

        const user = await UserRepository.update(userId, {
            business_name: businessName,
            gst_number: gstNumber,
            business_address: businessAddress,
            business_description: businessDescription,
            verification_status: "pending"
        });

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
