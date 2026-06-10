import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { BlacklistedToken } from "@/models/BlacklistedToken";
import { verifyToken } from "@/lib/auth";

import Session from "@/models/Session";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (refreshToken) {
      const decoded: any = verifyToken(refreshToken);
      if (decoded && decoded.exp) {
        await BlacklistedToken.create({
          token: refreshToken,
          expiresAt: new Date(decoded.exp * 1000),
        });
        
        // Remove Session
        const hashedSessionToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
        await Session.deleteOne({ token: hashedSessionToken });
      }
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    
    // Clear both tokens
    response.cookies.delete("authToken");
    response.cookies.delete("refreshToken");
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: false, message: "Server error during logout" }, { status: 500 });
  }
}
