import Razorpay from "razorpay";

// Feature flag: Set to false to disable payments during deployment
const PAYMENTS_ENABLED = process.env.PAYMENTS_ENABLED === "true";

let razorpayInstance: Razorpay | null = null;

// Only initialize Razorpay if payments are enabled AND env vars exist
if (PAYMENTS_ENABLED && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export const getRazorpayInstance = () => razorpayInstance;

// Helper function to check if payments are enabled
export const isPaymentsEnabled = (): boolean => {
  return PAYMENTS_ENABLED && !!razorpayInstance;
};
