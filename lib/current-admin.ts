import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, getAdminSession } from "@/lib/admin-session";

export async function isReadOnlyAdmin() {
  const cookieStore = await cookies();
  return getAdminSession(cookieStore.get(ADMIN_COOKIE)?.value)?.role === "viewer";
}

export async function requireAdminWrite() {
  const cookieStore = await cookies();
  const session = getAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "admin") {
    return Response.json({ error: "This account has read-only access." }, { status: 403 });
  }
  return null;
}

export async function denyViewerWrite() {
  const cookieStore = await cookies();
  const session = getAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
  return session?.role === "viewer"
    ? Response.json({ error: "This account has read-only access." }, { status: 403 })
    : null;
}
