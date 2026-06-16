import { NextResponse } from "next/server";
import { TestimonialRepository } from "@/repositories/SupportRepositories";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    const payload = await req.json();

    // IDOR Protection: Always use salonId from JWT
    const salonId = decoded.salonId;
    if (!salonId) {
       return NextResponse.json({ success: false, message: "Forbidden: No salon associated" }, { status: 403 });
    }

    await TestimonialRepository.create({
      ...payload,
      salonId: salonId // Overwrite body salonId
    });

    return NextResponse.json({
      success: true,
      message: "Testimonial added",
    });
  } catch (err: any) {
     return NextResponse.json({ success: false, message: err.message || "An error occurred" }, { status: 500 });
  }
}

export const POST = withAuth(handler, ["salon_owner", "super_admin"]);
