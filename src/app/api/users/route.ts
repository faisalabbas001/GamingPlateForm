import { NextResponse, NextRequest } from "next/server";
import { mongooseConnect } from "@/lib/dbConnect";
import { User } from "@/model/User";
import { withMaintenance } from "../middleware/withMaintenance";

// Function to get all users
const getAllUsers = async (request: NextRequest) => {
  await mongooseConnect();

  try {
    const page = Number(request.nextUrl.searchParams.get("page")) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments({ role: "user", isDelete: false });
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find({ role: "user", isDelete: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalUsers
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users." },
      { status: 500 }
    );
  }
};

// Function to get all users by search
const searchUsers = async (request: NextRequest) => {
  await mongooseConnect();
  const searchQuery = request.nextUrl.searchParams.get("query");
  const page = Number(request.nextUrl.searchParams.get("page")) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  if (!searchQuery) {
    return NextResponse.json(
      { error: "Search query is required." },
      { status: 400 }
    );
  }

  try {
    const query = {
      role: "user",
      isDelete: false,
      $or: [
        { username: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalUsers
      }
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Failed to search users." },
      { status: 500 }
    );
  }
};

// Function to get a user by ID
const getUserById = async (request: NextRequest) => {
  await mongooseConnect();
  const id = request.nextUrl.searchParams.get("id");

  const maintenanceCheck = await withMaintenance(request);
  if (!maintenanceCheck.authorized) {
    return NextResponse.json(
      { error: maintenanceCheck.message },
      { status: maintenanceCheck.status }
    );
  }


  if (!id) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 }
    );
  }

  try {
    const user = await User.findById(id); // Fetch user by ID
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    if (user.isDelete) {
      return NextResponse.json(
        { error: "User account has been deleted." },
        { status: 404 }
      );
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user." },
      { status: 500 }
    );
  }
};

const handleGetRequest = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id");
  const searchQuery = request.nextUrl.searchParams.get("query");

  if (searchQuery) {
    return searchUsers(request); // Call searchUsers if a search query is present
  } else if (id) {
    return getUserById(request); // Call getUserById if ID is present
  } else {
    return getAllUsers(request); // Call getAllUsers if no ID or query is present
  }
};

// Function to update a user
const updateUser = async (request: NextRequest) => {
  await mongooseConnect();
  const data = await request.json();
 
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 }
    );
  }
  //   username, email, tickets, credits, level, isActive
  try {
    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true }); // Update user data
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user." },
      { status: 500 }
    );
  }
};
const softDeleteUser = async (request: NextRequest) => {
  await mongooseConnect();
  const id = request.nextUrl.searchParams.get("deleteId");

  if (!id) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isDelete: true }, // Mark as deleted
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      message: "User marked as deleted successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error marking user as deleted:", error);
    return NextResponse.json(
      { error: "Failed to mark user as deleted." },
      { status: 500 }
    );
  }
};

const handlePutRequest = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id");
  const deleteId = request.nextUrl.searchParams.get("deleteId");

  if (id) {
    return updateUser(request);
  } else if (deleteId) {
    return softDeleteUser(request);
  }
};

// Function to delete a user
const deleteUser = async (request: NextRequest) => {
  await mongooseConnect();
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 }
    );
  }

  try {
    const result = await User.deleteOne({ _id: id }); // Delete user by ID
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user." },
      { status: 500 }
    );
  }
};

export {
  handleGetRequest as GET,
  handlePutRequest as PUT,
  deleteUser as DELETE,
};
