/* eslint-disable */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../../lib/mongodb";
import { mongooseConnect } from "../../../../lib/dbConnect";
import { User as CustomUser } from "../../../../model/User";
import bcrypt from "bcrypt";
import { Setting } from "@/model/Setting";
// import { NextApiRequest, NextApiResponse } from "next";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // TODO Need to find better way but for time being this is all we got
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      id: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("Missing credentials");

        const { username, password } = credentials;

        // Connect to the MongoDB database
        await mongooseConnect();

        // Find user in the database by email
        const user = await CustomUser.findOne({ username });
        if (!user) throw new Error("Invalid username or password");
        if (!user.password) throw new Error("Invalid username or password");
        if (user.isDelete) throw new Error("User account has been deleted.");
        if (user.social) throw new Error("Please log in using Google");

        // Compare password with the stored hash
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) throw new Error("Invalid  username or password");

        return {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          social: user.social,
          referralCode: user.referralCode,
        };
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.social = user.social;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          role: token.role,
          social: token.social,
          email: token.email,
          username: token.username,
        };
      }
      return session;
    },
    async signIn({ user, account }) {
      await mongooseConnect();

      if (account?.provider === "google") {
        if (!user.email) throw new Error("No email found in Google account.");

        let dbUser = await CustomUser.findOne({ email: user.email });

        if (dbUser?.isDelete) {
          throw new Error("User account has been deleted.");
        }

        const settings = await Setting.findOne();
        const welcomeBonus = settings?.welcomeBonus || 0;
        const freeSpinInterval = settings?.freeSpinInterval ?? 0;
        const freeSpin = Date.now() - freeSpinInterval * 60 * 60 * 1000;

        if (!dbUser) {
          const referralCode = Math.random().toString(36).substring(7);
          dbUser = new CustomUser({
            username: user.name,
            email: user.email,
            image: user.image,
            role: "user",
            social: true,
            referralCode,
            credits: welcomeBonus,
            lastFreeSpin:freeSpin,
          });
          await dbUser.save();
        } else if (!dbUser.social) {
          throw new Error(
            "Account already exists with credentials. Please log in using your credentials."
          );
        }

        // Add user details to the session
        user.id = dbUser._id.toString();
        user.role = dbUser.role;
        user.social = true;
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
    // error: "/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   return await NextAuth(req, res, authOptions);
// };

export { handler as GET, handler as POST };
