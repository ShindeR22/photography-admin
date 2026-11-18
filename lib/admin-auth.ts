import "server-only";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { prisma } from "@/lib/prisma";
import type { AdminRole } from "@/lib/admin-session";

const scrypt = promisify(scryptCallback);

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

export async function authenticateAdmin(id: string, password: string): Promise<{ role: AdminRole } | null> {
  let admin = await prisma.admin.findUnique({ where: { loginId: id } });

  const bootstrapAccount = [
    { id: process.env.ADMIN_LOGIN_ID, password: process.env.ADMIN_LOGIN_PASSWORD, role: "admin" as const },
    { id: process.env.VIEWER_LOGIN_ID, password: process.env.VIEWER_LOGIN_PASSWORD, role: "viewer" as const },
  ].find((account) => account.id === id && account.password === password);

  if (!admin && bootstrapAccount) {
    try {
      admin = await prisma.admin.create({
        data: { loginId: id, passwordHash: await hashPassword(password), role: bootstrapAccount.role },
      });
    } catch {
      // A concurrent first login may have created the same unique login ID.
      admin = await prisma.admin.findUnique({ where: { loginId: id } });
    }
  }

  if (!admin || !(await passwordMatches(password, admin.passwordHash))) return null;
  return { role: admin.role === "viewer" ? "viewer" : "admin" };
}
