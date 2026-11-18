import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createSessionToken, credentialsAreValid, sessionMaxAge } from "@/lib/admin-auth";

export async function POST(request: Request) {
  let body: { id?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof body.id !== "string" || typeof body.password !== "string" || !(await credentialsAreValid(body.id, body.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAge,
  });
  return response;
}
