import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Paths that require authentication
const protectedPaths = ["/todos"];

// Paths that are only for unauthenticated users
const authPaths = ["/signin", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("session_token");

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Check if path is for unauthenticated users only
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // Redirect unauthenticated users from protected paths to signin
  if (isProtectedPath && !sessionToken) {
    const url = new URL("/signin", request.url);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users from auth paths to todos
  if (isAuthPath && sessionToken) {
    const url = new URL("/todos", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
