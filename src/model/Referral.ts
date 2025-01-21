// models/Referral.js
import mongoose from "mongoose";

const ReferralSchema = new mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referred: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
    },
    creditsEarned: { type: Number, default: 0 },
  },
  { timestamps: true }
); // Enable timestamps

export const Referral =
  mongoose.models.Referral || mongoose.model("Referral", ReferralSchema);
