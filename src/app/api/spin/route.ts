import { NextResponse, NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect";
import { User } from "@/model/User";
import { Game } from "@/model/Game";
import { Activity } from "@/model/Activity";
import { updateUserLevel } from "../helper";
import { Setting } from "@/model/Setting";
import { withMaintenance } from "../middleware/withMaintenance";


// Function to handle the credit deduction and game result logic
const playGame = async (request: NextRequest) => {
  await mongooseConnect();

  // check maintenance mode is on
  const maintenanceCheck = await withMaintenance(request);
  if (!maintenanceCheck.authorized) {
    return NextResponse.json(
      { error: maintenanceCheck.message },
      { status: maintenanceCheck.status }
    );
  }


  const body = await request.json();
  const { userId, isFree } = body;

  if (!userId) {
    return NextResponse.json(
      { error: "userId, and creditsWon are required." },
      { status: 400 }
    );
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // Fetch settings to get the welcome bonus
    const settings = await Setting.findOne();
    const freeSpinInterval = settings?.freeSpinInterval ?? 0;
    const freeSpinCooldown = freeSpinInterval * 60 * 60 * 1000;


    const prizes = settings?.prizes || [];

    // Calculate winning prize using weighted probabilities based on free or paid spin
    const weights = prizes.map((prize: { probability: number; freeProbability: number }) => 
      isFree ? prize.freeProbability : prize.probability
    );
    const totalWeight = weights.reduce((a: number, b: number) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    let winningIndex = prizes.length - 1;
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        winningIndex = i;
        break;
      }
    }
    
    const winningPrize = prizes[winningIndex];

    if (isFree) {
      // console.log("isFree")
      const now = Date.now();
      if (now - user.lastFreeSpin.getTime() < freeSpinCooldown) {
        const nextAvailable = new Date(
          user.lastFreeSpin.getTime() + freeSpinCooldown
        );
        return NextResponse.json(
          {
            message: "Free spin not available yet",
            nextAvailable,
          },
          { status: 400 }
        );
      }
      user.lastFreeSpin = now;
    } else {
      // console.log("tick")
      if (user.tickets < 1) {
        return NextResponse.json(
          { message: "Not enough tickets" },
          { status: 400 }
        );
      }
      user.tickets -= 1;
    }

    user.credits += winningPrize.value;

    const game = new Game({
      user: user._id,
      type: "spin",
      result: winningIndex,
      creditsWon:winningPrize.value,
      ticketUsed: !isFree,
    });

    const activity = new Activity({
      user: user._id,
      activityname: "Spin",
      amount: isFree ? 0 : 1,
      result: winningPrize.value,
    });

    await game.save();
    await user.save();
    await activity.save();

    await updateUserLevel(user._id);

    return NextResponse.json({
      prizeIndex: winningIndex,
      prize: winningPrize,
    });
  } catch (error) {
    console.error("Error processing game logic:", error);
    return NextResponse.json(
      { error: "Failed to process game logic." },
      { status: 500 }
    );
  }
};

export { playGame as POST };
