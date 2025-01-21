import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true  },
    email: { type: String, required: true, unique: true },
    image: { type: String }, // Store Google profile image URL
    password: { type: String },
    emailVerified: Date,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    tickets: { type: Number, default: 0 },
    credits: { type: Number, default: 0 },
    level: {
      type: String,
      enum: ["Bronce", "Plata", "Oro", "Platino", "Diamante"],
      default: "Bronce",
    },
    isActive: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    lastFreeSpin: { type: Date, default: Date.now },
    referralCode: { type: String, unique: true, required: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notificationsEnabled: { type: Boolean, default: true },
    twoFactorEnabled: { type: Boolean, default: false },
    social: { type: Boolean, default: false },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpire: { type: Date, default: null },
    redeemedRewards: { type: Number, default: 0 }, // New field added
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
