// models/Service.js

import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon" },
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String, default: "" },
  category: { type: String, default: "General" },
  image: { type: String, default: "" }, // Cloudinary URL
  createdAt: { type: Date, default: Date.now }
});
delete mongoose.models.Service;
export default mongoose.models.Service ||
 mongoose.model("Service", ServiceSchema);
