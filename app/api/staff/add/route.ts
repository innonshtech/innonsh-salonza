import { NextResponse } from "next/server";
import { StaffRepository } from "@/repositories/StaffRepository";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    const body = await req.json();
    const { name, phone, skills, profileImage } = body;

    // IDOR Protection: Always use salonId from JWT
    const salonId = decoded.salonId;
    if (!salonId) {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
    }

    const staff = await StaffRepository.create({
      salonId,
      name,
      phone,
      skills,
      profileImage,
      status: "available"
    });

    return NextResponse.json({ success: true, staff });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to add staff" }, { status: 500 });
  }
}

export const POST = withAuth(handler, ["salon_owner", "super_admin"]);
