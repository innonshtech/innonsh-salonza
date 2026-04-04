import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Membership from "@/models/Membership";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    await dbConnect();
    const salonId = decoded.salonId;
    console.log("Fetching Membership plans for salonId:", salonId);

    if (!salonId && decoded.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
    }

    const memberships = await Membership.find({ salonId }).sort({ createdAt: -1 });
    console.log("✅ Found plans:", memberships.length);
    return NextResponse.json({ success: true, data: memberships });
  } catch (error: any) {
    console.error("💥 Error in membership list API:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const GET = withAuth(handler, ["salon_owner", "super_admin"]);
