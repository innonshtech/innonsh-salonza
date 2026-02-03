// /api/public/salon/[slug]/route.ts

import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Salon from "@/models/Salon";
import Service from "@/models/Service";
import Testimonial from "@/models/Testimonial";
import Offer from "@/models/Offer";

export async function GET(req: Request, { params }: any) {
  try {
    await dbConnect();
    const { slug } = await params;
    const salon = await Salon.findOne({ slug }).lean();
    if (!salon) {
      return NextResponse.json({
        success: false,
        message: "Salon not found",
      });
    }

    // Since lean() is used, salon is a POJO. We cast it to ISalon or use its properties carefully.
    const salonData = salon as any;
    const services = await Service.find({ salonId: salonData._id }).lean();
    const testimonials = await Testimonial.find({ salonId: salonData._id }).lean();
    const offers = await Offer.find({ salonId: salonData._id, isActive: true }).lean();

    return NextResponse.json({
      success: true,
      salon,
      services,
      testimonials,
      offers,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "An error occurred" });
  }
}
