import { NextResponse, NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect"; // Your MongoDB connection
import { User } from "@/model/User"; // User model
import { Reward } from "@/model/Reward"; // Reward model
import { RewardAdmin } from "@/model/RewardAdmin";
import { Activity } from "@/model/Activity"; // Activity model
import { updateUserLevel } from "../helper";
import { withMaintenance } from "../middleware/withMaintenance";

// Function to redeem a reward
const redeemReward = async (request: NextRequest) => {
  await mongooseConnect();
  // check maintenance mode is on
  const maintenanceCheck = await withMaintenance(request);
  if (!maintenanceCheck.authorized) {
    return NextResponse.json(
      { error: maintenanceCheck.message },
      { status: maintenanceCheck.status }
    );
  }

  const { userId, rewardId, walletAddress, network, redeemed } =
    await request.json();
console.log("dataaa::userId, rewardId, walletAddress, network, redeemed")

  if (!userId || !rewardId || !walletAddress || !network || !redeemed) {
    return NextResponse.json(
      {
        error:
          "User ID, Reward ID, Wallet Address, redeemed and Network are required.",
      },
      { status: 400 }
    );
  }

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }



    // Find the reward
    const reward = await RewardAdmin.findById(rewardId);
    if (!reward) {
      return NextResponse.json({ error: "Reward not found." }, { status: 404 });
    }

    // Check if the user has sufficient credits
    if (user.credits < reward.cost) {
      return NextResponse.json(
        { error: "Insufficient credits.." },
        { status: 400 }
      );
    }
    
    user.credits -= reward.cost;
    await user.save();

    // Create a new reward claim with status 'pending'
    const claimedReward = new Reward({
      user: user._id,
      name: reward.name,
      cost: reward.cost,
      walletAddress,
      network,
      redeemed,
    });
    await claimedReward.save();

    console.log("claimedReward", claimedReward);
    console.log("user.credits", user);

    return NextResponse.json({
      message: "Reward redeemed successfully, pending admin approval.",
      newCreditsBalance: user.credits,
    });
  } catch (error) {
    console.error("Error redeeming reward:", error);
    return NextResponse.json(
      { error: "Failed to redeem reward." },
      { status: 500 }
    );
  }
};

// API function to accept or reject a reward redemption
const updateRewardStatus = async (request: NextRequest) => {
  try {
    // Connect to MongoDB
    await mongooseConnect();

    // Extract user ID and reward ID from URL params, and action from request body
    const userId = request.nextUrl.searchParams.get("userId");
    const rewardId = request.nextUrl.searchParams.get("rewardId");
    const { action } = await request.json();

    // Validate required parameters
    if (!userId || !rewardId || action === undefined) {
      return NextResponse.json(
        {
          error: "User ID, Reward ID, Wallet Address, and action are required.",
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Check if reward exists
    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return NextResponse.json({ error: "Reward not found." }, { status: 404 });
    }
    // TODO: here add wallet transcation logic
    console.log("reward", 
      reward.redeemed,
      reward.network,
      reward.walletAddress,
    );
    // TODO: here add wallet transcation logic
      // Deduct reward cost from user's credits
      // user.credits -= reward.cost;
      // await user.save();
    // Process acceptance or rejection
    if (action === true) {
      // Accepted
      // Check if user has enough credits
      if (user.credits < reward.cost) {
        return NextResponse.json(
          { error: "Insufficient credits." },
          { status: 400 }
        );
      }

    

      // Update reward status to Accepted
      reward.status = "Accepted";
      await reward.save();

      // Log activity
      const activity = new Activity({
        user: user._id,
        activityname: "Exchange",
        paymentmethod: "Exchange",
        amount: reward.cost,
        result: reward.redeemed,
        claimed: reward.redeemed,
      });
      await activity.save();

      // here update user level after Deduct credit
      await updateUserLevel(user._id);

      return NextResponse.json({
        message: "Reward accepted and credits deducted.",
        newCreditsBalance: user.credits,
      });
    } else if (action === false) {
      // Rejected
      // Update reward status to Rejected
      reward.status = "Rejected";
      await reward.save();

      // refund the creadit when the admin has been reject the 
      // Refund credits to user
  user.credits += reward.cost;
  await user.save();

      return NextResponse.json({ message: "Reward rejected." });
    } else {
      return NextResponse.json(
        {
          error:
            "Invalid action. Expected true (Accepted) or false (Rejected).",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error updating reward status:", error);
    return NextResponse.json(
      { error: "Failed to update reward status." },
      { status: 500 }
    );
  }
};


// Function to get all redeemed rewards by user
const getAllRedeemedRewards = async (userId: string) => {
  try {
    // Fetch all rewards redeemed by the user
    const redeemedRewards = await Reward.find({ user: userId, redeemed: true }).exec();

    return redeemedRewards;
  } catch (error) {
    console.error("Error fetching redeemed rewards:", error);
    return [];
  }
};





const handleGetRequest = async (request: NextRequest) => {
  const userId = request.nextUrl.searchParams.get("userId");
  const rewardId = request.nextUrl.searchParams.get("rewardId");
  if (userId && rewardId) {
    return updateRewardStatus(request);

  }
  
  if (userId) {
    const redeemedRewards = await getAllRedeemedRewards(userId);
    return NextResponse.json({ redeemedRewards });
  }
  
  else {
    return redeemReward(request);
  }


};



// Export the API method
export { handleGetRequest as POST };
