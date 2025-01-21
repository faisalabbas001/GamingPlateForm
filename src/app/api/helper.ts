// helpers/userLevelHelper.js

import { User } from "@/model/User";


// Function to determine user level based on credits
export const determineUserLevel = (credits:number) => {
  if (credits < 1000) return 'Bronce';
  if (credits < 5000) return 'Plata';
  if (credits < 10000) return 'Oro';
  if (credits < 25000) return 'Platino';
  return 'Diamante';
};

// Function to update user level if it has changed
export const updateUserLevel = async (userId:string) => {
  const user = await User.findById(userId);
  if (!user) return;

  const newLevel = determineUserLevel(user.credits);

  if (user.level !== newLevel) {
    user.level = newLevel;
    await user.save();
  }
};
