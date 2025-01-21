import { NextResponse, NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect";
import { Referral } from "@/model/Referral";
import { withMaintenance } from "../middleware/withMaintenance";

// Fetch referrals by userId and status (Active/Pending)
const getReferralsByUserId = async (request: NextRequest) => {
  await mongooseConnect();

  const maintenanceCheck = await withMaintenance(request);
  if (!maintenanceCheck.authorized) {
    return NextResponse.json(
      { error: maintenanceCheck.message },
      { status: maintenanceCheck.status }
    );
  }

  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 }
    );
  }

  try {
    // Find all referrals for the given userId
    const referrals = await Referral.find({ referrer: userId });

    // Separate active and pending referrals
    const activeReferrals = referrals.filter(referral => referral.status === "Active");
    const pendingReferrals = referrals.filter(referral => referral.status === "Pending");

    // Calculate total referrals and earned credits
    const totalReferrals = referrals.length;
    const earnedCredits = referrals.reduce(
      (total, referral) => total + (referral.creditsEarned || 0),
      0
    );

    // Calculate active referral rate (Active referrals / Total referrals)
    const activeReferralRate = totalReferrals > 0 ? (activeReferrals.length / totalReferrals) * 100 : 0;

    return NextResponse.json({
      message: "Referral statistics fetched successfully",
      totalReferrals,
      earnedCredits,
      activeReferralsCount: activeReferrals.length,
      pendingReferralsCount: pendingReferrals.length,
      activeReferralRate: activeReferralRate.toFixed(0),  // Rounded to 2 decimal places
    });
  } catch (error) {
    console.error("Error fetching referral statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch referral statistics." },
      { status: 500 }
    );
  }
};

// Fetch all referrals (optional, for admin use)
const getAllReferrals = async () => {
  await mongooseConnect();

  try {
    const referrals = await Referral.find()
      .populate("referrer", "username")
      .populate("referred", "username");

    return NextResponse.json(referrals);
  } catch (error) {
    console.error("Error fetching all referrals:", error);
    return NextResponse.json(
      { error: "Failed to fetch referrals." },
      { status: 500 }
    );
  }
};

// Handle GET request
const handleGetRequest = async (request: NextRequest) => {
  const userId = request.nextUrl.searchParams.get("userId");
  if (userId) {
    return getReferralsByUserId(request);
  } else {
    return getAllReferrals();
  }
};

export { handleGetRequest as GET };
