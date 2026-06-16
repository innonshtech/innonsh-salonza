import { NextResponse } from "next/server";
import { MembershipRepository } from "@/repositories/SupportRepositories";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    const salonId = decoded.salonId;
    console.log("Fetching Membership plans for salonId:", salonId);

    let query: any = { salonId };
    
    // If super_admin and no salonId provided, they can see everything (or we can keep it scoped)
    if (!salonId && decoded.role === "super_admin") {
      query = {}; // Super admin sees all plans if no specific salon context
    } else if (!salonId) {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
    }

    const memberships = await MembershipRepository.find(query);
    console.log("✅ Found plans:", memberships.length);
    return NextResponse.json({ success: true, data: memberships });
  } catch (error: any) {
    console.error("💥 Error in membership list API:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const GET = withAuth(handler, ["salon_owner", "super_admin"]);
