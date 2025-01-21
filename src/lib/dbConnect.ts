import mongoose from "mongoose";

export const mongooseConnect = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined in environment variables.");
    throw new Error("Missing MongoDB connection string.");
  }

  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to the database.");
    return mongoose.connection;
  }

  try {
    const connection = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    });
    console.log("Connected to the database.");
    return connection;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};
