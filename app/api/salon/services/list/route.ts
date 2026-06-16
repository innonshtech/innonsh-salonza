import { NextResponse } from "next/server";
import { ServiceRepository } from "@/repositories/ServiceRepository";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    // IDOR Protection: Always use salonId from JWT for owners
    const salonId = decoded.salonId;
    if (!salonId && decoded.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const targetSalonId = decoded.role === "super_admin" ? (searchParams.get("id") || salonId) : salonId;

    if (!targetSalonId) {
      return NextResponse.json({ success: false, message: "salonId is required" }, { status: 400 });
    }

    const services = await ServiceRepository.find({ salonId: targetSalonId });
    return NextResponse.json({ success: true, services });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const GET = withAuth(handler, ["salon_owner", "super_admin"]);
