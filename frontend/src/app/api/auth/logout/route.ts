import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/register", req.url));

  // Remove auth_token cookie
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });



  return response;
}
