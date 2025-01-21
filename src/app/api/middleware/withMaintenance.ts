/* eslint-disable */
// @ts-nocheck
import { NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect";
import { Setting } from "@/model/Setting";

export const withMaintenance = async (req: NextRequest) => {
  await mongooseConnect();
  // console.log("withMaintenance", req);
  try {
    const settings = await Setting.findOne();
    
    if (settings?.maintenanceMode) {
      return {
        authorized: false,
        message: "System is currently under maintenance",
        status: 503
      };
    }

    return { authorized: true };
  } catch (error) {
    console.error("Error checking maintenance mode:", error);
    return {
      authorized: false,
      message: "Error checking maintenance status",
      status: 500
    };
  }
}; 