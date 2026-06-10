import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Session from "@/models/Session";
import { verifyToken } from "@/lib/auth";

// GET active sessions for the current user
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("authToken")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded: any = verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });

    await dbConnect();
    const sessions = await Session.find({ userId: decoded.userId }).sort({ lastActive: -1 });

    // Identify current session
    const currentRefreshToken = req.cookies.get("refreshToken")?.value;
    let currentSessionHash = "";
    if (currentRefreshToken) {
      const crypto = require("crypto");
      currentSessionHash = crypto.createHash("sha256").update(currentRefreshToken).digest("hex");
    }

    const mappedSessions = sessions.map(s => ({
      id: s._id,
      userAgent: s.userAgent,
      ip: s.ip,
      lastActive: s.lastActive,
      isCurrent: s.token === currentSessionHash
    }));

    return NextResponse.json({ success: true, sessions: mappedSessions });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE a specific session or all sessions (except current)
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("authToken")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const decoded: any = verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });

    await dbConnect();
    
    // Check if body provides a specific sessionId to delete
    let body: any = {};
    try {
      body = await req.json();
    } catch (e) {} // Ignore empty body

    const currentRefreshToken = req.cookies.get("refreshToken")?.value;
    let currentSessionHash = "";
    if (currentRefreshToken) {
      const crypto = require("crypto");
      currentSessionHash = crypto.createHash("sha256").update(currentRefreshToken).digest("hex");
    }

    if (body.sessionId) {
      // Delete specific session
      await Session.deleteOne({ _id: body.sessionId, userId: decoded.userId });
      return NextResponse.json({ success: true, message: "Session revoked successfully" });
    } else {
      // Delete ALL sessions EXCEPT the current one
      await Session.deleteMany({ userId: decoded.userId, token: { $ne: currentSessionHash } });
      return NextResponse.json({ success: true, message: "All other sessions revoked successfully" });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
