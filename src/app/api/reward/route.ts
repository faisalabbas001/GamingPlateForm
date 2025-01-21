import { NextResponse, NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect";
import { User } from "@/model/User";
import { RewardAdmin } from "@/model/RewardAdmin";
import { Reward } from "@/model/Reward";

// Function to create a reward
const createReward = async (request: NextRequest) => {
  await mongooseConnect();
  const { name, cost, userId ,  redeemed} = await request.json();
  console.log("checking the rewards is that here",cost, userId,name,userId,userId)

  if (!name || !userId || typeof cost !== "number") {
    return NextResponse.json(
      { error: "User iD, Name and cost are required." },
      { status: 400 }
    );
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Check if the user role is 'admin'
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required." },
        { status: 403 }
      );
    }

    const reward = new RewardAdmin({ name, cost , claimed:redeemed });
    await reward.save(); // Save the new reward
    return NextResponse.json(reward, { status: 201 }); // Return the created reward
  } catch (error) {
    console.error("Error creating reward:", error);
    return NextResponse.json(
      { error: "Failed to create reward." },
      { status: 500 }
    );
  }
};

// Function to get all rewards
const getAllRewards = async () => {
  await mongooseConnect();

  try {
    const rewards = await RewardAdmin.find(); // Fetch all rewards
    return NextResponse.json(rewards);
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return NextResponse.json(
      { error: "Failed fetching rewards." },
      { status: 500 }
    );
  }
};

// Function to get a reward by ID
const getRewardById = async (request: NextRequest) => {
  await mongooseConnect();
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Reward ID is required." },
      { status: 400 }
    );
  }

  try {
    const reward = await RewardAdmin.findById(id); // Fetch reward by ID
    if (!reward) {
      return NextResponse.json({ error: "Reward not found." }, { status: 404 });
    }
    return NextResponse.json(reward);
  } catch (error) {
    console.error("Error fetching reward:", error);
    return NextResponse.json(
      { error: "Failed to fetch reward." },
      { status: 500 }
    );
  }
};

const handleGetRequest = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id");
  
  if (id) {
    return getRewardById(request);
  } else {
    return getAllRewards();
  }
  
};


// Function to update a reward
const updateReward = async (request: NextRequest) => {
  await mongooseConnect();

  const { name, cost, userId , redeemed } = await request.json();

  // const data = await request.json();
  const id = request.nextUrl.searchParams.get("id");

  if (!userId || !id) {
    return NextResponse.json(
      { error: "UserId and Reward ID are required." },
      { status: 400 }
    );
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required." },
        { status: 403 }
      );
    }

    const updatedReward = await RewardAdmin.findByIdAndUpdate(
      id,
      { name, cost, user: userId , claimed:redeemed },
      {
        new: true,
        runValidators: true,
      }
    ); // Update reward data
    if (!updatedReward) {
      return NextResponse.json({ error: "Reward not found." }, { status: 404 });
    }
    return NextResponse.json(updatedReward);
  } catch (error) {
    console.error("Error updating reward:", error);
    return NextResponse.json(
      { error: "Failed to update reward." },
      { status: 500 }
    );
  }
};

// Function to delete a reward
const deleteReward = async (request: NextRequest) => {
  await mongooseConnect();
  const userId = request.nextUrl.searchParams.get("userId");
  const id = request.nextUrl.searchParams.get("id");

  if (!userId || !id) {
    return NextResponse.json(
      { error: "UserId and Reward ID are required." },
      { status: 400 }
    );
  }

  try {

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Check if the user is an admin
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required." },
        { status: 403 }
      );
    }

    const result = await RewardAdmin.deleteOne({ _id: id }); // Delete reward by ID
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Reward not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Reward deleted successfully." });
  } catch (error) {
    console.error("Error deleting reward:", error);
    return NextResponse.json(
      { error: "Failed to delete reward." },
      { status: 500 }
    );
  }
};



// const getTotalRedeemedRewards = async (request: NextRequest) => {
//   await mongooseConnect();

//   const userId = request.nextUrl.searchParams.get("userId");
//   try {
//     console.log("Checking rewards for user:", userId);  // Log the userId to ensure it's correct

//     // Fetch all rewards for the specific user where redeemed > 0
//     const rewards = await Reward.find({ user:userId, redeemed: { $gt: 0 },  status: "Accepted" });

//     console.log("Fetched rewards:", rewards);  // Log the fetched rewards

//     // Calculate total redeemed rewards (sum of 'cost' for all redeemed rewards)
//     const totalRedeemed = rewards.reduce((total, reward) => total + (reward.redeemed || 0), 0);

//     // Return the total redeemed rewards for the user
//     return NextResponse.json({
//       message: "Total redeemed rewards fetched successfully",
//       totalRedeemed,
//     });
//   } catch (error) {
//     console.error("Error fetching total redeemed rewards:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch total redeemed rewards." },
//       { status: 500 }
//     );
//   }
// };


// Export API methods
export {
  handleGetRequest as GET,
  updateReward as PUT,
  deleteReward as DELETE,
  createReward as POST,
};
