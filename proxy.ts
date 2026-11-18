import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, getAdminSession } from "@/lib/admin-session";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/members") {
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // The route handler provides CORS and enforces admin access for writes.
    return NextResponse.next();
  }

  const session = getAdminSession(request.cookies.get(ADMIN_COOKIE)?.value);
  if (request.nextUrl.pathname === "/login") {
    return session ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }
  const isSafeMethod = ["GET", "HEAD", "OPTIONS"].includes(request.method);
  if (session?.role === "viewer" && !isSafeMethod) {
    return NextResponse.json({ error: "This account has read-only access." }, { status: 403 });
  }
  if (request.nextUrl.pathname.startsWith("/api/public/")) return NextResponse.next();
  if (session) return NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!login|api/auth|workshops/register|_next/static|_next/image|favicon.ico|pcpa-logo.png).*)", "/login"],
};
