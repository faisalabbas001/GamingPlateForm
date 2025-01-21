import mongoose from "mongoose";

const GameSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    result: { type: Number, required: true },
    creditsWon: { type: Number, required: true },
    ticketUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
); // Enable timestamps

export const Game = mongoose.models.Game || mongoose.model("Game", GameSchema);
