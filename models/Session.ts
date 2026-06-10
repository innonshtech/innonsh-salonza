import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true }, // Can store a hash of the refresh token to identify the session
  userAgent: { type: String, default: "Unknown Device" },
  ip: { type: String, default: "Unknown IP" },
  lastActive: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

// TTL index to automatically remove expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Session || mongoose.model("Session", sessionSchema);
