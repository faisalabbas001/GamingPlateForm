import { NextResponse, NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect";
import { Activity } from "@/model/Activity";
import { withMaintenance } from "../middleware/withMaintenance";

// Function to get all activities by userId with optional filtering by activity name
const getActivitiesbyUserId = async (request: NextRequest) => {
  await mongooseConnect();

  // check maintenance mode is on
  const maintenanceCheck = await withMaintenance(request);
  if (!maintenanceCheck.authorized) {
    return NextResponse.json(
      { error: maintenanceCheck.message },
      { status: maintenanceCheck.status }
    );
  }

  const userId = request.nextUrl.searchParams.get("userId");
  const activityname = request.nextUrl.searchParams.get("activityName");
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = 10;

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 }
    );
  }

  try {
    const query: { user: string; activityname?: string } = { user: userId };

    if (activityname && activityname.trim() !== "") {
      query.activityname = activityname;
    }

    const totalActivities = await Activity.countDocuments(query);
    const totalPages = Math.ceil(totalActivities / limit);
    
    const activities = await Activity.find(query)
      .populate("user")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      activities,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalActivities
      }
    });
  } catch (error) {
    console.error("Error fetching activities by user ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities." },
      { status: 500 }
    );
  }
};

const getAllActivities = async (request: NextRequest) => {
  await mongooseConnect();

  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = 10;

  try {
    const query = { "user.role": "user" };

    const totalActivities = await Activity.countDocuments().populate({
      path: "user",
      match: { role: "user" }
    });

    const totalPages = Math.ceil(totalActivities / limit);

    const activitiesWithoutAdmin = await Activity.find()
      .populate({
        path: "user",
        match: { role: "user" },
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const activities = activitiesWithoutAdmin.filter(
      (activity) => activity.user
    );

    return NextResponse.json({
      activities,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalActivities
      }
    });
  } catch (error) {
    console.error("Error fetching all activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch all activities." },
      { status: 500 }
    );
  }
};

const handleGetRequest = async (request: NextRequest) => {
  const userId = request.nextUrl.searchParams.get("userId");
  if (userId) {
    return getActivitiesbyUserId(request);
  } else {
    return getAllActivities(request);
  }
};

export { handleGetRequest as GET };
