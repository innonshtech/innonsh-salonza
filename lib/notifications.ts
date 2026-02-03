// lib/notifications.ts
import nodemailer from "nodemailer";
import twilio from "twilio";

const SMTP_HOST = process.env.SMTP_HOST!;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER!;
const SMTP_PASS = process.env.SMTP_PASS!;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER || "";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Twilio client - only initialize if credentials provided
const twilioClient =
  TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN
    ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    : null;

/** Send email (returns info or throws) */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  const info = await transporter.sendMail({
    from: FROM_EMAIL,
    to,
    subject,
    text,
    html,
  });
  return info;
}

/** Send SMS via Twilio (if configured) */
export async function sendSMS({
  to,
  body,
}: {
  to: string;
  body: string;
}) {
  if (!twilioClient) {
    console.warn("Twilio not configured — SMS skipped");
    return null;
  }

  // ensure E.164 format
  const msg = await twilioClient.messages.create({
    body,
    from: TWILIO_PHONE_NUMBER,
    to,
  });
  return msg;
}

/** Send WhatsApp message via Twilio (if configured) */
export async function sendWhatsApp({
  to,
  body,
}: {
  to: string; // e.g., whatsapp:+9198xxxxxxxx
  body: string;
}) {
  if (!twilioClient) {
    console.warn("Twilio not configured — WhatsApp skipped");
    return null;
  }

  const msg = await twilioClient.messages.create({
    body,
    from: TWILIO_WHATSAPP_NUMBER,
    to,
  });
  return msg;
}
