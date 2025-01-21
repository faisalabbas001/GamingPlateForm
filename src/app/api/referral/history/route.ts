import { NextResponse, NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect";
import { Referral } from "@/model/Referral";
import { withMaintenance } from "../../middleware/withMaintenance";

const getHistoryReferralsByUserId = async (request: NextRequest) => {
  await mongooseConnect();

  const maintenanceCheck = await withMaintenance(request);
  if (!maintenanceCheck.authorized) {
    return NextResponse.json(
      { error: maintenanceCheck.message },
      { status: maintenanceCheck.status }
    );
  }

  const userId = request.nextUrl.searchParams.get("userId");
  const status = request.nextUrl.searchParams.get("status");
  const minCredits = request.nextUrl.searchParams.get("minCredits");
  const maxCredits = request.nextUrl.searchParams.get("maxCredits");
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
  const limit = 10; // Items per page

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 }
    );
  }

  try {
    // Build base query
    const query = {
      referrer: userId
    } as {
      referrer: string;
      status?: string;
      creditsEarned?: {
        $gte?: number;
        $lte?: number;
      };
    };

    // Add status filter if provided and not "all"
    if (status && status !== "all") {
      query.status = status;
    }

    // Add credits range filter if provided
    if (minCredits || maxCredits) {
      query.creditsEarned = {};
      if (minCredits) {
        query.creditsEarned.$gte = Number(minCredits);
      }
      if (maxCredits) {
        query.creditsEarned.$lte = Number(maxCredits);
      }
    }

    // Get total count for pagination
    const totalReferrals = await Referral.countDocuments(query);
    const totalPages = Math.ceil(totalReferrals / limit);

    // Find referrals for the given user with filters and pagination
    const referrals = await Referral.find(query)
      .populate("referred", "username")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Format the data for the response
    const referralHistory = referrals.map((referral) => ({
      referredUsername: referral.referred?.username || "Unknown",
      date: referral.createdAt,
      status: referral.status,
      creditsEarned: referral.creditsEarned,
    }));

    return NextResponse.json({
      message: "Referral history fetched successfully",
      referralHistory,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalReferrals
      }
    });
  } catch (error) {
    console.error("Error fetching referral history:", error);
    return NextResponse.json(
      { error: "Failed to fetch referral history." },
      { status: 500 }
    );
  }
};

export { getHistoryReferralsByUserId as GET };
