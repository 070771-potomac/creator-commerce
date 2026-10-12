// Proxy (Next.js 16 name for middleware): runs BEFORE a route renders.
//
// This is only a fast, OPTIMISTIC check: it looks at whether a session
// cookie is present, without asking the database (the Next.js auth guide
// warns against database calls here, because Proxy runs on every matched
// request, including prefetches). A forged or expired cookie passes this
// check — the real check is requireUser() in lib/dal/auth.ts, which runs
// before any data is read.
//
// What it adds: a logged-out visitor gets a real 307 redirect to /login
// immediately, instead of the dashboard shell starting to load first.
import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hasSessionCookie = getSessionCookie(request) !== null;
  const { pathname, search } = request.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  // Logged-in user opening /login or /signup → send them to the dashboard.
  if (isAuthPage) {
    return hasSessionCookie
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.next();
  }

  // Dashboard page without a session cookie → /login, remembering where the
  // user wanted to go (?next=), so they land there after logging in.
  if (!hasSessionCookie) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

// Only the dashboard pages (the (master) route group) and the two auth
// pages. Public pages, storefronts, /api and static files never run Proxy.
export const config = {
  matcher: [
    "/dashboard",
    "/products/:path*",
    "/sales",
    "/purchases",
    "/downloads",
    "/wishlist",
    "/following",
    "/settings",
    "/help/:path*",
    "/login",
    "/signup",
  ],
};
