// middleware/withAuthRole.ts
import { getToken } from "next-auth/jwt"; // Alternative to getSession for App Router compatibility
import { NextRequest } from "next/server";

type TokenType = {
  role?: string;
  // other properties if needed
};

export const withAuthRole = async (
  req: NextRequest,
  allowedRoles: string[]
) => {
  // Get the token (session data) from the request
  const token = (await getToken({ req })) as TokenType | null; // getToken works with NextRequest
  // console.log("token",token)
  if (!token || !token.role) {
    return { authorized: false, message: "Unauthorized", status: 401 };
  }

  if (!allowedRoles.includes(token.role)) {
    return { authorized: false, message: "Forbidden", status: 403 };
  }

  return { authorized: true };
};
