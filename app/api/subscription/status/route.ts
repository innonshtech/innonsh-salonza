import { NextResponse } from "next/server";
import { SubscriptionRepository } from "@/repositories/SupportRepositories";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const salonId = searchParams.get("salonId");

  const PAYMENTS_ENABLED = process.env.PAYMENTS_ENABLED === "true";

  // If payments are disabled, always return active (trial mode)
  if (!PAYMENTS_ENABLED) {
    return NextResponse.json({
      active: true,
      subscription: null,
      trial: true,
      message: "Payments disabled - trial mode active",
    });
  }

  // Payments enabled - check real subscription status
  const sub = await SubscriptionRepository.findOne({ salonId: salonId || undefined });
  console.log("Fetched subscription for salonId", salonId, ":", sub);

  return NextResponse.json({
    active: sub?.status === "active",
    subscription: sub || null,
    trial: false,
  });
}
