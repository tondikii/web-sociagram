// middleware.ts
import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const url = request.url;
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://web-sociagram-fixed.vercel.app/"
      : "http://localhost:3000/";
  if (url.includes("/signin") || url.includes("/signup")) {
    if (accessToken?.value) {
      return NextResponse.redirect(baseUrl);
    }
  } else {
    if (!accessToken?.value) return NextResponse.redirect(baseUrl + "signin");
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)"],
};
