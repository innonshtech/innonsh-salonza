import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },

  // MULTIPLE SERVICES SUPPORT
  serviceIds: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Service" }
  ],

  // For backward compatibility (if any old booking uses serviceId)
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },

  customerName: { type: String, required: true },
  customerPhone: { type: String },

  totalDuration: { type: Number },
  totalPrice: { type: Number },

  date: { type: Date, required: true },
  scheduledAt: { type: Date, required: true },
  isWalkIn: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ["upcoming", "in-progress", "completed", "cancelled"],
    default: "upcoming",
  },

  // Payment tracking
  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  },
  paidAmount: {
    type: Number,
    default: 0
  },

  // Timestamps for tracking service lifecycle
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },

  createdAt: { type: Date, default: Date.now }
});

// Indexes for performance
bookingSchema.index({ salonId: 1, date: 1, paymentStatus: 1, status: 1 });
bookingSchema.index({ salonId: 1, date: 1 });

export default mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);
