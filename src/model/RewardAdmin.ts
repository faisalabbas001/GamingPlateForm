// models/RewardAdminAdmin.js
import mongoose from "mongoose";

const RewardAdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    claimed: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
); // Enable timestamps

export const RewardAdmin =
  mongoose.models.RewardAdmin || mongoose.model("RewardAdmin", RewardAdminSchema);
