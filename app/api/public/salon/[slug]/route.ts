// /api/public/salon/[slug]/route.ts

import { NextResponse } from "next/server";
import { SalonRepository } from "@/repositories/SalonRepository";
import { ServiceRepository } from "@/repositories/ServiceRepository";
import { TestimonialRepository, OfferRepository } from "@/repositories/SupportRepositories";

export async function GET(req: Request, { params }: any) {
  try {
    const { slug } = await params;
    const salon = await SalonRepository.findOne({ slug });
    if (!salon) {
      return NextResponse.json({
        success: false,
        message: "Salon not found",
      });
    }

    const salonData = salon as any;
    const services = await ServiceRepository.find({ salonId: salonData.id, isActive: true });
    const testimonials = await TestimonialRepository.find({ salonId: salonData.id });
    const offers = await OfferRepository.find({ salonId: salonData.id, isActive: true });

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
