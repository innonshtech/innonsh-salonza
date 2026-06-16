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

    const body = await req.json();
    const { id, name, category, price, costPrice, stockCount, minStockAlert, unit } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    // Verify ownership before updating
    const product = await InventoryRepository.findById(id);
    if (!product || product.salonId !== targetSalonId) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Update allowed fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (costPrice !== undefined) updateData.costPrice = costPrice;
    if (stockCount !== undefined) updateData.stockCount = stockCount;
    if (minStockAlert !== undefined) updateData.minStockAlert = minStockAlert;
    if (unit !== undefined) updateData.unit = unit;

    const updatedProduct = await InventoryRepository.update(id, updateData);

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export const PUT = withAuth(handler, ["salon_owner", "super_admin"]);
