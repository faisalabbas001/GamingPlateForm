import { NextResponse, NextRequest } from "next/server";
import { User } from "@/model/User";
import { Referral } from "@/model/Referral";
import { mongooseConnect } from "@/lib/dbConnect";

// POST /api/referrals/create
const createReferral = async (request: NextRequest) => {
  try {
    await mongooseConnect();

    const userId = request.nextUrl.searchParams.get("userId");
    const referralCode = request.nextUrl.searchParams.get("referralCode");

    if (!userId || !referralCode) {
      return NextResponse.json(
        { message: "User ID and referral code are required" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if the user is already referred by someone else
    if (user.referredBy) {
      return NextResponse.json(
        { message: "User is already referred by another user" },
        { status: 400 }
      );
    }

    // Validate referral code
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return NextResponse.json(
        { message: "Invalid referral code" },
        { status: 400 }
      );
    }

    // Check if the referrer and referred are the same user
    if (referrer._id.toString() === user._id.toString()) {
      return NextResponse.json(
        { message: "You cannot use your own referral code" },
        { status: 400 }
      );
    }

    // Create the referral
    const referral = new Referral({
      referrer: referrer._id,
      referred: user._id,
      status: "Pending",
      credits: 0,
    });

    await referral.save();

    // Update the referredBy fiel d for the user
    user.referredBy = referrer._id;
    await user.save();

    return NextResponse.json(
      { message: "Referral created successfully", referral },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating referral:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export { createReferral as POST };
