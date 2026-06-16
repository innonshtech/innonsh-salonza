import { NextRequest, NextResponse } from "next/server";
import { generateToken, verifyToken } from "@/lib/auth";
import { UserRepository } from "@/repositories/UserRepository";
import { BlacklistedTokenRepository } from "@/repositories/SupportRepositories";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ success: false, message: "No refresh token provided" }, { status: 401 });
    }

    // Check if token is blacklisted
    const isBlacklisted = await BlacklistedTokenRepository.findOne({ token: refreshToken });
    if (isBlacklisted) {
      return NextResponse.json({ success: false, message: "Token has been revoked" }, { status: 403 });
    }

    // Verify refresh token
    const decoded: any = verifyToken(refreshToken);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid or expired refresh token" }, { status: 403 });
    }

    // Ensure user still exists
    const user = await UserRepository.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User no longer exists" }, { status: 404 });
    }

    // Generate new access token
    const newAccessToken = generateToken({
      userId: user.id,
      role: user.role,
      salonId: user.salonId,
      supplierId: (user as any).supplierId || (user as any).supplier_id,
    });

    const response = NextResponse.json({ success: true, message: "Token refreshed successfully" });

    // Set new access token cookie
    response.cookies.set("authToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Refresh token error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
