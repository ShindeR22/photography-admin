import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "pcpa_admin_session";
export type AdminRole = "admin" | "viewer";
export type AdminSession = { loginId: string; role: AdminRole; expiresAt: number };
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_SESSION_SECRET must be configured");
  return value;
}

export function createSessionToken(loginId: string, role: AdminRole) {
  const session: AdminSession = {
    loginId,
    role,
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function getAdminSession(token: string | undefined): AdminSession | null {
  if (!token) return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;
  const expected = createHmac("sha256", secret()).update(payload).digest();
  const actual = Buffer.from(signature, "hex");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as AdminSession;
    if (
      typeof session.loginId !== "string" ||
      (session.role !== "admin" && session.role !== "viewer") ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= Math.floor(Date.now() / 1000)
    ) return null;
    return session;
  } catch {
    return null;
  }
}

export const sessionMaxAge = SESSION_TTL_SECONDS;
