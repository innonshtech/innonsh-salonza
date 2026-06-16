import { NextResponse } from "next/server";
import { ServiceRepository } from "@/repositories/ServiceRepository";
import { withAuth } from "@/lib/apiAuth";

async function patchHandler(req: Request, decoded: any) {
  try {
    const { serviceId } = await req.json();

    if (!serviceId) {
       return NextResponse.json({ success: false, message: "serviceId is required" }, { status: 400 });
    }

    const currentService = await ServiceRepository.findById(serviceId);
    if (!currentService || currentService.salonId.toString() !== decoded.salonId.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden: You don't own this service" }, { status: 403 });
    }

    const updatedService = await ServiceRepository.update(
      serviceId,
      { is_active: !currentService.isActive }
    );

    return NextResponse.json({ success: true, service: updatedService });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const PATCH = withAuth(patchHandler, ["salon_owner", "super_admin"]);
