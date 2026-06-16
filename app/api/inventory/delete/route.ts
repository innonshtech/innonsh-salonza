import { NextResponse } from "next/server";
import { InventoryRepository } from "@/repositories/InventoryRepository";
import { withAuth } from "@/lib/apiAuth";

async function handler(req: Request, decoded: any) {
  try {
    // IDOR Protection: Always use salonId from JWT for owners
    const salonId = decoded.salonId;
    if (!salonId && decoded.role !== "super_admin") {
      return NextResponse.json({ success: false, message: "Unauthorized: No salon associated" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const targetSalonId = decoded.role === "super_admin" ? (searchParams.get("salonId") || salonId) : salonId;

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    // Verify ownership before deleting
    const product = await InventoryRepository.findById(id);
    if (!product || product.salonId !== targetSalonId) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    await InventoryRepository.delete(id);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const DELETE = withAuth(handler, ["salon_owner", "super_admin"]);
