// pages/api/users/purchase-tickets.ts
import { NextRequest, NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect";
import { User } from "@/model/User";
import { Activity } from "@/model/Activity";
import { Referral } from "@/model/Referral";
import { Setting } from "@/model/Setting";
import { withMaintenance } from "../middleware/withMaintenance";


interface UserType {
  _id: string;
  username: string;
  email: string;
  image?: string;
  password?: string;
  emailVerified?: Date;
  role: "user" | "admin";
  tickets: number;
  credits: number;
  level: "Bronce" | "Plata" | "Oro" | "Platino" | "Diamante";
  isActive: boolean;
  lastFreeSpin: Date;
  referralCode: string;
  referredBy?: string;
  notificationsEnabled: boolean;
  twoFactorEnabled: boolean;
  social: boolean;
}

interface ReferralLevelType {
  name: string;
  percentage: number;
}


interface SettingType {
  referralLevels: ReferralLevelType[];
}



const purchaseTickets = async (request: NextRequest) => {
  await mongooseConnect();

  // check maintenance mode is on
  const maintenanceCheck = await withMaintenance(request);
  if (!maintenanceCheck.authorized) {
    return NextResponse.json(
      { error: maintenanceCheck.message },
      { status: maintenanceCheck.status }
    );
  }

  // Extract request parameters
  const userId = request.nextUrl.searchParams.get("userId");
  const { amount, paymentMethod, activityname } = await request.json();

  // Validate input
  if (!userId || !amount || !paymentMethod || !activityname) {
    return NextResponse.json(
      {
        error:
          "User ID, amount, payment method, and activity name are required.",
      },
      { status: 400 }
    );
  }

  try {
    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    // console.log("User before update:", user);

    // Process referral bonus if the user was referred
    if (user.referredBy) {
      await processReferralBonus(user, amount);
    }

    // Update user's tickets and credits
    user.tickets += amount;
    user.credits -= amount;
    await user.save();
    // console.log("User after update:", user);

    // Log the activity
    const activity = new Activity({
      user: user._id,
      activityname,
      paymentmethod: paymentMethod,
      amount,
      result: amount, // Updated ticket balance
    });
    await activity.save();
    // console.log("Activity log created:", activity);

    return NextResponse.json({
      message: "Tickets purchased successfully",
      newTicketsBalance: user.tickets,
    });
  } catch (error) {
    console.error("Error purchasing tickets:", error);
    return NextResponse.json(
      { error: "Error purchasing tickets" },
      { status: 500 }
    );
  }
};

// Function to process referral bonuses
const processReferralBonus = async (user: UserType, amount: number) => {
  try {
    // Find pending referral record
    const referral = await Referral.findOne({
      referred: user._id,
      status: "Pending",
    });

    if (!referral) {
      console.log("No pending referral record found.");
      return;
    }

    console.log("Referral record found:", referral);

    // Fetch referral bonus percentage based on user level
    const settings: SettingType | null = await Setting.findOne();
    const referralLevel = settings?.referralLevels.find(
      (level) => level.name === user.level
    );

    if (!referralLevel) {
      console.log(
        `No referral level found for user level: ${user.level}. Skipping referral bonus.`
      );
      return;
    }

    const referralBonusPercentage = referralLevel.percentage || 0;
    const bonusCredits = Math.floor((amount * referralBonusPercentage) / 100);
    console.log("added bonusCredits",bonusCredits)
    // Update referrer's credits
    const updatedReferrer = await User.findByIdAndUpdate(
      referral.referrer,
      { $inc: { credits: bonusCredits } }, // Increment credits
      { new: true } // Return updated document
    );

    if (updatedReferrer) {
      console.log("Referrer updated with bonus credits:", updatedReferrer);
    } else {
      console.error("Failed to find and update referrer user.");
    }

    // Update referral record
    referral.status = "Active";
    referral.creditsEarned = bonusCredits;
    await referral.save();
    console.log("Referral record updated to Active with earned credits.");
  } catch (error) {
    console.error("Error processing referral bonus:", error);
  }
};

export { purchaseTickets as POST };
