import { NextResponse, NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect"; // MongoDB connection
import { Reward } from "@/model/Reward"; // Reward model
import { withMaintenance } from "../middleware/withMaintenance";

// Function to get redeemed rewards by userId
const getAllRedeemByUserId = async (request: NextRequest) => {

  // check maintenance mode is on
  const maintenanceCheck = await withMaintenance(request);
  if (!maintenanceCheck.authorized) {
    return NextResponse.json(
      { error: maintenanceCheck.message },
      { status: maintenanceCheck.status }
    );
  }

  try {
    const userId = request.nextUrl.searchParams.get("id");
    const status = request.nextUrl.searchParams.get("status");
    const page = Number(request.nextUrl.searchParams.get("page")) || 1;
    const limit = 10; // Items per page

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await mongooseConnect();

    // Build query based on status filter
    const query: { user: string; status?: string } = { user: userId };
    if (status && status !== "all") {
      query.status = status;
    }

    // Get total count for pagination
    const totalItems = await Reward.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;

    // Find rewards with pagination
    const redeemedRewards = await Reward.find(query)
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const pagination = {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit
    };

    return NextResponse.json({ redeemedRewards, pagination }, { status: 200 });
  } catch (error) {
    console.error("Error fetching exchange history by userId:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchange history by user." },
      { status: 500 }
    );
  }
};

const getAllRedeem = async (request: NextRequest) => {
  try {
    // Connect to MongoDB
    await mongooseConnect();

    const page = Number(request.nextUrl.searchParams.get("page")) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalItems = await Reward.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    // Find all redeemed rewards with pagination
    const redeemedRewards = await Reward.find()
      .populate({
        path: "user",
        match: { role: "user" },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    
    const filteredRedeemedRewards = redeemedRewards.filter(
      (reward) => reward.user
    );

    // If no rewards are found in the system
    if (filteredRedeemedRewards.length === 0) {
      return NextResponse.json(
        { message: "No rewards have been redeemed yet." },
        { status: 404 }
      );
    }

    // Return the paginated list of redeemed rewards
    return NextResponse.json({
      redeemedRewards: filteredRedeemedRewards,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching all redeemed rewards:", error);
    return NextResponse.json(
      { error: "Failed to fetch all redeemed rewards." },
      { status: 500 }
    );
  }
};

const handleGetRequest = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id");
  if (id) {
    return getAllRedeemByUserId(request);
  } else {
    return getAllRedeem(request);
  }
};

// Export the API handler for GET requests
export { handleGetRequest as GET };
