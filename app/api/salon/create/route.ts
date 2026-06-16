import { NextResponse } from "next/server";
import { SalonRepository } from "@/repositories/SalonRepository";
import { UserRepository } from "@/repositories/UserRepository";
import { withAuth } from "@/lib/apiAuth";
import { withValidation } from "@/lib/validate";
import { salonCreateSchema } from "@/lib/validations";

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function handler(req: Request, decoded: any) {
  try {
    const { name, address, phone, email } = await req.json();

    // IDOR Protection: Always use userId from JWT as ownerId
    const ownerId = decoded.userId || decoded.id;

    if (!ownerId) {
       return NextResponse.json({ success: false, message: "Unauthorized: No user session found" }, { status: 401 });
    }

    let slug = generateSlug(name);
    const slugExists = await SalonRepository.findOne({ slug });
    if (slugExists) {
      slug = slug + Math.floor(Math.random() * 1000); // make unique
    }

    const salon = await SalonRepository.create({
      ownerId,
      name,
      address,
      phone,
      email,
      slug,
    });

    if (!salon) {
      return NextResponse.json({ success: false, message: "Failed to create salon" }, { status: 500 });
    }

    await UserRepository.update(ownerId, {
      salon_id: salon.id,
    });

    return NextResponse.json({
      success: true,
      message: "Salon created successfully",
      salon,
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong",
    }, { status: 500 });
  }
}

export const POST = withAuth(withValidation(salonCreateSchema, handler), ["salon_owner", "super_admin"]);
