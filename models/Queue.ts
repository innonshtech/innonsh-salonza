import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String },

  // MULTIPLE SERVICES
  serviceIds: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Service" }
  ],

  // For old compatibility
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },

  position: { type: Number, required: true },
  status: {
    type: String,
    enum: ["waiting", "serving"],
    default: "waiting"
  },
  estimatedMinutes: { type: Number }, // NEW

  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" },

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Queue ||
  mongoose.model("Queue", queueSchema);
