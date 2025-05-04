import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔒 Protect /user-profile (require temp_email for new users)
  if (pathname.startsWith("/user-profile")) {
    const tempEmail = request.cookies.get("temp_email")?.value;

    if (!tempEmail) {
      return NextResponse.redirect(new URL("/register", request.url));
    }
  }

  // 🔒 Protect / (require auth_token for logged-in users)
  if (pathname === "/") {
    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.redirect(new URL("/register", request.url));
    }
  }

  return NextResponse.next();
}

// 👇 This tells Next.js which routes to apply this middleware to
export const config = {
  matcher: ["/", "/user-profile"],
};
