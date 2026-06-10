import mongoose from "mongoose";

const BlacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

// Create a TTL index to automatically delete expired tokens from the collection
BlacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const BlacklistedToken =
  mongoose.models.BlacklistedToken || mongoose.model("BlacklistedToken", BlacklistedTokenSchema);
