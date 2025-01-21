import { NextResponse, NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect";
import { Reward } from "@/model/Reward";
import { User } from "@/model/User";
import mongoose from "mongoose";
const getTotalRedeemedRewards = async (request: NextRequest) => {
  await mongooseConnect();

  let userId = request.nextUrl.searchParams.get("userId");
  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: "Invalid or missing userId" }, { status: 400 });
  }

  userId = userId.trim(); // Ensure no extra whitespace or newline

  // Validate if the userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ error: "Invalid userId format" }, { status: 400 });
  }

  try {
    console.log("Checking rewards for user:", userId);

    // Fetch all rewards for the specific user where redeemed > 0
    const rewards = await Reward.find({ user: userId, redeemed: { $gt: 0 }, status: "Accepted" });

    console.log("Fetched rewards:", rewards);

    // Calculate total redeemed rewards (sum of 'cost' for all redeemed rewards)
    const totalRedeemed = rewards.reduce((total, reward) => total + (reward.redeemed || 0), 0);

    // Return the total redeemed rewards for the user
    return NextResponse.json({
      message: "Total redeemed rewards fetched successfully",
      totalRedeemed,
    });
  } catch (error) {
    console.error("Error fetching total redeemed rewards:", error);
    return NextResponse.json(
      { error: "Failed to fetch total redeemed rewards." },
      { status: 500 }
    );
  }
};

// Export the handler
export const GET = getTotalRedeemedRewards;
