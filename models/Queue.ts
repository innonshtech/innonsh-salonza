import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  scheduledAt: { type: Date },
  isWalkIn: { type: Boolean, default: false },

  // Link to Booking (optional) - when customer has a pre-booking
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },

  // MULTIPLE SERVICES
  serviceIds: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Service" }
  ],

  // Denormalized service data for real-time calculation
  services: [{
    name: String,
    duration: Number
  }],

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
