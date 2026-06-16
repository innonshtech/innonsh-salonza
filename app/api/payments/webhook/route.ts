import { NextResponse } from "next/server";
import { SubscriptionRepository } from "@/repositories/SupportRepositories";
import { isPaymentsEnabled } from "@/lib/razorpay";

export async function POST(req: Request) {

  // Feature flag: Ignore webhooks when payments are disabled
  if (!isPaymentsEnabled()) {
    return NextResponse.json({
      success: true,
      message: "Webhook received but payments are disabled. No action taken.",
      mock: true,
    });
  }

  const body = await req.json();

  const event = body.event;
  const subId = body?.payload?.subscription?.entity?.id;

  if (!subId) {
    return NextResponse.json({ success: false });
  }

  if (event === "subscription.activated") {
    await SubscriptionRepository.findOneAndUpdate(
      { razorpaySubscriptionId: subId },
      { status: "active" }
    );
  }

  if (event === "subscription.halted" || event === "subscription.completed") {
    await SubscriptionRepository.findOneAndUpdate(
      { razorpaySubscriptionId: subId },
      { status: "expired" }
    );
  }

  return NextResponse.json({ success: true });
}
