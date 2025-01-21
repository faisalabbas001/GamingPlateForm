import { NextResponse, NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect";
import { Setting } from "@/model/Setting";
import { User } from "@/model/User";

const initializeSettings = async () => {
  await mongooseConnect();

  try {
    const existingSetting = await Setting.findOne();
    if (!existingSetting) {
      const defaultSetting = new Setting({
        maintenanceMode: false,
        freeSpinInterval: 24,
        welcomeBonus: 100,
        purchaseBonus: 5,
        referralLevels: [
          { name: "Bronce", percentage: 5 },
          { name: "Plata", percentage: 10 },
          { name: "Oro", percentage: 15 },
          { name: "Platino", percentage: 20 },
        ],
        prizes: [
          { name: "100", value: 100, probability: 30, freeProbability: 30 },
          { name: "200", value: 200, probability: 25, freeProbability: 25 },
          { name: "300", value: 300, probability: 20, freeProbability: 20 },
          { name: "400", value: 400, probability: 10, freeProbability: 10 },
          { name: "500", value: 500, probability: 8, freeProbability: 8 },
          { name: "1000", value: 1000, probability: 5, freeProbability: 5 },
          { name: "2000", value: 2000, probability: 1.5, freeProbability: 1.5 },
          { name: "5000", value: 2050, probability: 0.5, freeProbability: 0.5 },
        ],
      });
      await defaultSetting.save();
      console.log("Default settings created successfully.");
    } else {
      console.log("Settings already initialized.");
    }
  } catch (error) {
    console.error("Error initializing settings:", error);
  }
};

initializeSettings();

// Function to get settings
const getSettings = async () => {
  await mongooseConnect();

  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
      await settings.save();
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { message: "Error fetching settings" },
      { status: 500 }
    );
  }
};

// Function to update settings
const updateSettings = async (request: NextRequest) => {
  await mongooseConnect();

  // Get query parameters
  const userId = request.nextUrl.searchParams.get("userId");
  const settingId = request.nextUrl.searchParams.get("settingId");

  if (!userId || !settingId) {
    return NextResponse.json(
      { error: "Both userId and settingId are required." },
      { status: 400 }
    );
  }

  try {
    // Verify user exists and has admin role
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

    // Find existing settings
    const settings = await Setting.findById(settingId);
    if (!settings) {
      return NextResponse.json(
        { error: "Settings not found." },
        { status: 404 }
      );
    }

    // Parse the body for fields to update
    const updates = await request.json();

    // Apply updates only for provided fields
    for (const key in updates) {
      if (updates[key] !== undefined && key in settings) {
        settings[key] = updates[key];
      }
    }

    // Save the updated settings
    await settings.save();

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { message: "Error updating settings" },
      { status: 500 }
    );
  }
};

const updatePrize = async (request: NextRequest) => {
  await mongooseConnect();

  const userId = request.nextUrl.searchParams.get("userId");
  const settingId = request.nextUrl.searchParams.get("settingId");
  const prizeId = request.nextUrl.searchParams.get("prizeId");

  if (!userId || !settingId || !prizeId) {
    return NextResponse.json(
      { error: "userId, settingId, and prizeId are required." },
      { status: 400 }
    );
  }

  try {
    // Verify user exists and has admin role
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

    const settings = await Setting.findById(settingId);
    if (!settings) {
      return NextResponse.json(
        { error: "Settings not found." },
        { status: 404 }
      );
    }

    const { value, probability, name, freeProbability } = await request.json();

    const prizeIndex = settings.prizes.findIndex(
      (prize: { _id: { toString: () => string } }) =>
        prize._id.toString() === prizeId
    );

    if (prizeIndex === -1) {
      return NextResponse.json({ error: "Prize not found." }, { status: 404 });
    }

    const updatedPrize = { ...settings.prizes[prizeIndex] };

    if (value !== undefined) updatedPrize.value = value;
    if (probability !== undefined) updatedPrize.probability = probability;
    if (name !== undefined) updatedPrize.name = name;
    if (freeProbability !== undefined)
      updatedPrize.freeProbability = freeProbability;

    settings.prizes[prizeIndex] = updatedPrize;

    await settings.save();

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating prize:", error);
    return NextResponse.json(
      { message: "Error updating prize" },
      { status: 500 }
    );
  }
};

const updateReferralLevel = async (request: NextRequest) => {
  await mongooseConnect();

  const userId = request.nextUrl.searchParams.get("userId");
  const settingId = request.nextUrl.searchParams.get("settingId");
  const referralLevelId = request.nextUrl.searchParams.get("referralLevelsId");
  console.log("idsss", referralLevelId && userId && settingId);

  if (!userId || !settingId || !referralLevelId) {
    return NextResponse.json(
      { error: "userId, settingId, and referralLevelsId are required." },
      { status: 400 }
    );
  }

  try {
    // Verify user exists and has admin role
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

    const settings = await Setting.findById(settingId);
    if (!settings) {
      return NextResponse.json(
        { error: "Settings not found." },
        { status: 404 }
      );
    }

    const { percentage } = await request.json();

    const referralIndex = settings.referralLevels.findIndex(
      (level: { _id: { toString: () => string } }) =>
        level._id.toString() === referralLevelId
    );

    if (referralIndex === -1) {
      return NextResponse.json(
        { error: "Referral Level not found." },
        { status: 404 }
      );
    }

    settings.referralLevels[referralIndex].percentage = percentage;

    await settings.save();

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating referral level:", error);
    return NextResponse.json(
      { message: "Error updating referral level" },
      { status: 500 }
    );
  }
};

const handlePatchRequest = async (request: NextRequest) => {
  const userId = request.nextUrl.searchParams.get("userId");
  const settingId = request.nextUrl.searchParams.get("settingId");
  const prizeId = request.nextUrl.searchParams.get("prizeId");

  const referralLevelId = request.nextUrl.searchParams.get("referralLevelsId");

  if (userId && settingId && prizeId) {
    return updatePrize(request);
  } else if (referralLevelId && userId && settingId) {
    return updateReferralLevel(request);
  } else {
    return updateSettings(request);
  }
};

export { getSettings as GET, handlePatchRequest as PATCH };
