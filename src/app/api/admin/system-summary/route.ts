import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect";
import { User } from "@/model/User";
import { Activity } from "@/model/Activity";

// Function to get system summary for users with role "user"
const getSystemSummary = async () => {
  await mongooseConnect();

  try {
    // Total number of users with role "user"
    const totalUsers = await User.countDocuments({ role: "user" });

    // Sum of all tickets for users with role "user"
    const totalTickets = await User.aggregate([
      { $match: { role: "user" } },
      { $group: { _id: null, totalTickets: { $sum: "$tickets" } } },
    ]);

    // Sum of all credits for users with role "user"
    const totalCredits = await User.aggregate([
      { $match: { role: "user" } },
      { $group: { _id: null, totalCredits: { $sum: "$credits" } } },
    ]);

    const totalRewardsData = await Activity.aggregate([
      {
        $lookup: {
          from: "users", 
          localField: "user", 
          foreignField: "_id", 
          as: "userDetails" 
        }
      },
      {
        $unwind: "$userDetails" 
      },
      {
        $match: {
          "userDetails.role": "user" 
        }
      },
      {
        $group: {
          _id: null,
          totalRewards: { $sum: "$claimed" } // Sum the "claimed" field
        }
      }
    ]);
    
    const totalRewards = totalRewardsData.length > 0 ? totalRewardsData[0].totalRewards : 0;
    

    // Monthly data for users, tickets, credits, and rewards
    const monthlyData = await User.aggregate([
      { $match: { role: "user" } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalUsers: { $sum: 1 },
          totalTickets: { $sum: "$tickets" },
          totalCredits: { $sum: "$credits" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyRewardsData = await Activity.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalRewards: { $sum: "$claimed" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return {
      totalUsers,
      totalTickets: totalTickets[0]?.totalTickets || 0,
      totalCredits: totalCredits[0]?.totalCredits || 0,
      totalRewards,
      monthlyData,
      monthlyRewardsData,
    };
  } catch (error) {
    console.error("Error fetching system summary:", error);
    throw new Error("Failed to fetch system summary");
  }
};

const handleGetRequest = async () => {
  try {
    const summary = await getSystemSummary();
    return NextResponse.json(summary);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Handle other error types (e.g., string, object) if necessary
    return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    // return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export { handleGetRequest as GET };
