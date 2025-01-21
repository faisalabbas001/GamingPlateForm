// models/Reward.js
import mongoose from "mongoose";

const RewardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    walletAddress: { type: String, required: true },
    network: { type: String, required: true },
    redeemed: { type: Number, required: true, default: 0  },
    status: { type: String, default: "Pending", enum: ['Pending', 'Accepted', 'Rejected'], },
  },
  { timestamps: true }
); // Enable timestamps

export const Reward =
  mongoose.models.Reward || mongoose.model("Reward", RewardSchema);
