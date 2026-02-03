import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon" },
  title: String,
  subtitle: String,
  description: String,
  originalPrice: Number,
  discountedPrice: Number,
  percentage: Number,   
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Offer 
  || mongoose.model("Offer", offerSchema);
