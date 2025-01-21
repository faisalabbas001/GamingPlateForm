import { NextResponse } from "next/server"; // Use NextResponse for handling responses
import { mongooseConnect } from "../../../lib/dbConnect";
import { User } from "@/model/User";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";
import { Referral } from "@/model/Referral";
import { Setting } from "@/model/Setting";

// Define the schema for user registration with a role
const userSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  role: z.enum(["user", "admin"]).optional().default("user"),
  referralCode: z.string().optional(),
});

// Define the POST request handler
const signupmethod = async (req: Request) => {
  try {
    const body = await req.json();
    const { email, username, password, role, referralCode } =
      userSchema.parse(body);

    await mongooseConnect();

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Fetch welcome bonus from settings
    const settings = await Setting.findOne();
    const welcomeBonus = settings?.welcomeBonus || 0;
    const freeSpinInterval = settings?.freeSpinInterval ?? 0;
    const freeSpin = Date.now() - (freeSpinInterval * 60 * 60 * 1000);
    

    // Validate referral code if provided
    let referredBy: string | null = null;
    if (referralCode && referralCode.trim() !== "") {
      const referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return NextResponse.json(
          { message: "Invalid referral code" },
          { status: 400 }
        );
      }
      referredBy = referrer._id.toString();
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);


    // Generate a unique referral code for the new user
    const newReferralCode = Math.random().toString(36).substring(7);

    // Explicitly type user data to include optional properties
    const userData: {
      email: string;
      username: string;
      password: string;
      role: "user" | "admin";
      social: boolean;
      referralCode: string;
      credits: number; // Add credits field
      referredBy?: string; // Mark referredBy as optional
      lastFreeSpin:number;
    } = {
      email,
      username,
      password: hashedPassword,
      role,
      social: false,
      referralCode: newReferralCode,
      credits: welcomeBonus,
      lastFreeSpin:freeSpin,
    };

    // Add referredBy only if it exists
    if (referredBy) {
      userData.referredBy = referredBy;
    }

    const user = new User(userData);
    await user.save();

    // If referredBy exists, call createReferral logic
    if (referredBy) {
      const referralData = {
        referrerCode: referralCode,
        referredId: user._id,
      };

      const referralResponse = await createReferralFromCode(referralData);

      if (referralResponse.error) {
        return NextResponse.json(
          { message: "Error creating referral" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: "User created successfully", role: user.role },
      { status: 201 }
    );
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};

export { signupmethod as POST };

// Helper function to call createReferral
const createReferralFromCode = async (referralData: {
  referrerCode: string | undefined;
  referredId: string;
}) => {
  try {
    const { referrerCode, referredId } = referralData;

    // Find the referrer using the referral code
    const referrer = await User.findOne({ referralCode: referrerCode });
    if (!referrer) {
      return { error: true, message: "Invalid referral code" };
    }

    // Create a referral with a default status of "Pending"
    const referral = new Referral({
      referrer: referrer._id,
      referred: referredId,
      status: "Pending",
      credits: 0,
    });
    await referral.save();

    return { error: false, referral };
  } catch (error) {
    console.error("Error creating referral:", error);
    return { error: true, message: "Error creating referral" };
  }
};
