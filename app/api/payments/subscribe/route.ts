import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Subscription from "@/models/Subscription";
import { isPaymentsEnabled, getRazorpayInstance } from "@/lib/razorpay";

export async function POST(req: Request) {
  await dbConnect();

  const { salonId, planType } = await req.json();

  // Feature flag: Check if payments are enabled
  if (!isPaymentsEnabled()) {
    // Create a mock subscription with trial status
    const mockSubscriptionId = `trial_${Date.now()}_${planType}`;

    const newSub = await Subscription.create({
      salonId,
      plan: planType,
      razorpaySubscriptionId: mockSubscriptionId,
      status: "active",
      startedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year trial
    });

    return NextResponse.json({
      success: true,
      message: "Payments are temporarily disabled. Trial subscription activated.",
      mock: true,
      subscriptionId: mockSubscriptionId,
    });
  }

  // Production Razorpay flow
  const razorpay = getRazorpayInstance();
  if (!razorpay) {
    return NextResponse.json(
      { success: false, message: "Razorpay not initialized. Check server configuration." },
      { status: 500 }
    );
  }

  const planId = (planType === "pro"
    ? process.env.PLAN_PRO
    : process.env.PLAN_BASIC) as string;

  if (!planId) {
    return NextResponse.json(
      { success: false, message: "Plan configuration missing" },
      { status: 500 }
    );
  }

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: 12, // yearly cycle
    quantity: 1,
    customer_notify: 1,
  });

  const newSub = await Subscription.create({
    salonId,
    plan: planType,
    razorpaySubscriptionId: subscription.id,
    status: "active",
    startedAt: new Date(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });

  return NextResponse.json({
    success: true,
    message: "Subscription created",
    subscriptionId: subscription.id,
  });
}
