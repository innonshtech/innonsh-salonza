import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Salon from "@/models/Salon";

export async function DELETE(req: Request) {
  try {
    await dbConnect();

    const { salonId, imageUrl } = await req.json();

    if (!salonId || !imageUrl) {
      return NextResponse.json({
        success: false,
        message: "salonId and imageUrl are required",
      });
    }

    // Remove image from gallery array
    const updated = await Salon.findByIdAndUpdate(
      salonId,
      { $pull: { gallery: imageUrl } },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({
        success: false,
        message: "Salon not found",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
      gallery: updated.gallery,
    });
  } catch (err: any) {
    console.error("Delete gallery image error:", err);
    return NextResponse.json({
      success: false,
      message: err.message || "Server error",
    });
  }
}
