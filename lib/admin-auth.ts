import "server-only";
import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { prisma } from "@/lib/prisma";

export const ADMIN_COOKIE = "pcpa_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const scrypt = promisify(scryptCallback);

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_SESSION_SECRET must be configured");
  return value;
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function passwordMatches(password: string, storedHash: string) {
  const [salt, expectedHex, extra] = storedHash.split(":");
  if (!salt || !expectedHex || extra) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return expected.length > 0 && timingSafeEqual(actual, expected);
}

export async function credentialsAreValid(id: string, password: string) {
  let admin = await prisma.admin.findUnique({ where: { loginId: id } });

  // On the first login, provision the configured administrator into MongoDB.
  // Subsequent logins authenticate only against the stored password hash.
  if (!admin && id === process.env.ADMIN_LOGIN_ID && password === process.env.ADMIN_LOGIN_PASSWORD) {
    try {
      admin = await prisma.admin.create({
        data: { loginId: id, passwordHash: await hashPassword(password) },
      });
    } catch {
      // A concurrent first login may have created the same unique login ID.
      admin = await prisma.admin.findUnique({ where: { loginId: id } });
    }
  }

  return Boolean(admin && (await passwordMatches(password, admin.passwordHash)));
}

export function createSessionToken() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(expires);
  const signature = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function isValidSession(token: string | undefined) {
  if (!token) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra || !/^\d+$/.test(payload)) return false;
  if (Number(payload) <= Math.floor(Date.now() / 1000)) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest();
  let actual: Buffer;
  try {
    actual = Buffer.from(signature, "hex");
  } catch {
    return false;
  }
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export const sessionMaxAge = SESSION_TTL_SECONDS;
