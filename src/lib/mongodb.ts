import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri: string = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Check if we are running in development mode
if (process.env.NODE_ENV === "development") {
  // In development, use a global variable to preserve MongoClient across hot reloading
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, connect once
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

