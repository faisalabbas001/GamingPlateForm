declare module "next-auth" {
  interface User {
    id: string;
    role?: string;
    social?: boolean;
    email?: string;
    username?: string;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
      social?: boolean;
      email?: string;
      username?: string;
    };
  }

  interface JWT {
    id?: string;
    role?: string;
    social?: boolean;
    email?: string;
    username?: string;
  }
}



import { MongoClient } from "mongodb";

declare global {
   // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}
