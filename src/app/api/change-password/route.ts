import { NextResponse, NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect"; // MongoDB connection
import { User } from "@/model/User"; // User model
import bcrypt from "bcrypt"; // For password hashing

// Function to handle password change
const changePassword = async (request: NextRequest) => {
  try {
    // Parse request JSON and extract required fields
    const { userId, password } = await request.json();

    // Validate input parameters
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing userId." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Invalid or missing password. Must be at least 8 characters." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await mongooseConnect();

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    // Respond with success message
    return NextResponse.json(
      { message: "Password updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
};

// Export the API method for PUT requests
export { changePassword as PUT };
