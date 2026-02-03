import mongoose from "mongoose";


const testimonialSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon" },
  name: String,
  role: String,
  review: String,
  rating: { type: Number, default: 5 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Testimonial 
  || mongoose.model("Testimonial", testimonialSchema);
