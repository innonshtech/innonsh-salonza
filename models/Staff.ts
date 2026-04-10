import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: "Salon", required: true },
  name: { type: String, required: true },
  phone: { type: String },
  skills: [String],
  profileImage: String,
  active: { type: Boolean, default: true },

  status: {
    type: String,
    enum: ["available", "busy", "break", "offline"],
    default: "available"
  },

  // Backward compatibility
  currentStatus: String,

  dailyLimit: Number,
  avgTime: Number,
  completedToday: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

// Middleware to sync status from currentStatus if status is missing
StaffSchema.pre('save', function(next) {
  if (this.currentStatus && !this.status) {
    this.status = this.currentStatus as any;
  }
  // Keep them in sync during transition
  if (this.status) {
    this.currentStatus = this.status;
  }
  next();
});

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
