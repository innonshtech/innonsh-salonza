import { NextResponse } from "next/server";
import { withAuth } from "@/lib/apiAuth";
import { UserRepository } from "@/repositories/UserRepository";
import { SalonRepository } from "@/repositories/SalonRepository";

/**
 * GET /api/auth/me
 * This endpoint verifies the user's JWT and returns the fresh user data
 * straight from the database to prevent localStorage tampering.
 */
async function handler(req: Request, decoded: any) {
  try {
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return NextResponse.json({ success: false, message: "Invalid token payload" }, { status: 401 });
    }

    // Fetch the full user from the database to get the current role
    const user = await UserRepository.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Include the salon if it exists
    let salon = null;
    if (user.role === "salon_owner") {
      salon = await SalonRepository.findOne({ ownerId: user.id });
    }

    return NextResponse.json({
      success: true,
      user,
      salon
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.stack || "Failed to fetch user data" 
    }, { status: 500 });
  }
}

export const GET = withAuth(handler);
