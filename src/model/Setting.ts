// models/Setting.js
import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    maintenanceMode: { type: Boolean, default: false },
    freeSpinInterval: { type: Number, default: 24 },
    welcomeBonus: { type: Number, default: 100 },
    purchaseBonus: { type: Number, default: 5 },
    referralLevels: [
      {
        name: { type: String, required: true },
        percentage: { type: Number, required: true },
      },
    ],
    prizes: [
      {
        name: { type: String, required: true },
        value: { type: Number, required: true },
        probability: { type: Number, required: true },
        freeProbability: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
); // Enable timestamps

export const Setting =
  mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
