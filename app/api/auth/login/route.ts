import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/admin-auth";
import { ADMIN_COOKIE, createSessionToken, sessionMaxAge } from "@/lib/admin-session";

export async function POST(request: Request) {
  let body: { id?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof body.id !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const account = await authenticateAdmin(body.id, body.password);
  if (!account) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(body.id, account.role), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAge,
  });
  return response;
}
