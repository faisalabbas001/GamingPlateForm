// models/Activity.js
import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    activityname: { type: String, required: true },
    paymentmethod: { type: String },
    amount: { type: Number, required: true },
    result: { type: Number, required: true },
    claimed: { type: Number, default: 0 },
  },
  { timestamps: true }
); 

export const Activity =
  mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
