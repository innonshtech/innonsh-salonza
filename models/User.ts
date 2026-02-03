import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["salon_owner", "supplier", "super_admin"], default: "salon_owner" },
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon" },

  // Supplier Verification Fields
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected", "unapplied"],
    default: "unapplied"
  },
  businessName: String,
  gstNumber: String,
  businessAddress: String,
  businessLogo: String,
  businessDescription: String,

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model("User", userSchema);
