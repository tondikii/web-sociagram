// middleware.ts
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const url = request.url;
  if (url.includes("/signin") || url.includes("/signup")) {
    if (accessToken?.value) {
      return NextResponse.redirect("http://localhost:3001/");
    }
  } else {
    if (!accessToken?.value)
      return NextResponse.redirect("http://localhost:3001/signin");
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/profile",
    "/liked",
    "/profile/:username*",
  ],
};
