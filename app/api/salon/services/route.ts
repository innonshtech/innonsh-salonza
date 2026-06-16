import { NextResponse } from "next/server";
import { ServiceRepository } from "@/repositories/ServiceRepository";
import { withAuth } from "@/lib/apiAuth";
import { withValidation } from "@/lib/validate";
import { serviceCreateSchema, serviceUpdateSchema } from "@/lib/validations";

async function postHandler(req: Request, decoded: any) {
  try {
    const { name, duration, price, description, image } = await req.json();

    // IDOR Protection: Always use salonId from JWT, NEVER trust the request body
    if (!decoded.salonId) {
      return NextResponse.json({ success: false, message: "User is not associated with any salon" }, { status: 403 });
    }

    const service = await ServiceRepository.create({
      salonId: decoded.salonId, // Forced from authenticated session
      name,
      duration: Number(duration),
      price: Number(price),
      description,
      image
    });

    return NextResponse.json({ success: true, service });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

async function putHandler(req: Request, decoded: any) {
  try {
    const { id, name, duration, price, description, image } = await req.json();

    // Verify ownership before updating
    const service = await ServiceRepository.findById(id);
    if (!service || service.salonId.toString() !== decoded.salonId.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden: You don't own this service" }, { status: 403 });
    }

    // Update the service
    const updatedService = await ServiceRepository.update(
      id,
      {
        name,
        duration: duration !== undefined ? Number(duration) : undefined,
        price: price !== undefined ? Number(price) : undefined,
        description,
        image
      }
    );

    return NextResponse.json({ success: true, service: updatedService });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

async function deleteHandler(req: Request, decoded: any) {
  try {
    const { id } = await req.json();

    // Verify ownership before deleting
    const service = await ServiceRepository.findById(id);
    if (!service || service.salonId.toString() !== decoded.salonId.toString()) {
      return NextResponse.json({ success: false, message: "Forbidden: You don't own this service" }, { status: 403 });
    }

    await ServiceRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const POST = withAuth(withValidation(serviceCreateSchema, postHandler), ["salon_owner", "super_admin"]);
export const PUT = withAuth(withValidation(serviceUpdateSchema, putHandler), ["salon_owner", "super_admin"]);
export const DELETE = withAuth(deleteHandler, ["salon_owner", "super_admin"]);


