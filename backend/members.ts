import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { memberSchema } from "@/lib/zod/member";

export async function getMembers() {
  try {
    return Response.json(await prisma.member.findMany({ where: { deletedAt: null }, orderBy: { joinedAt: "desc" } }));
  } catch {
    return Response.json({ error: "Could not load members from the database." }, { status: 500 });
  }
}

export async function createMember(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = memberSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      { error: validation.error.issues.map((issue) => issue.message).join(" ") },
      { status: 400 },
    );
  }

  const joinedAt = new Date(`${validation.data.registrationDate}T12:00:00`);
  const expiresAt = new Date(joinedAt);
  expiresAt.setFullYear(expiresAt.getFullYear() + validation.data.membershipPeriodYears);
  try {
    const memberCount = await prisma.member.count();
    const member = await prisma.member.create({
      data: {
        ...validation.data,
        registrationDate: joinedAt,
        email: validation.data.email || `member-${randomUUID()}@pcpa.invalid`,
        memberNumber: `PCMC-${String(memberCount + 1).padStart(4, "0")}`,
        joinedAt,
        expiresAt,
      },
    });
    return Response.json(member, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return Response.json({ error: "A member with this email already exists." }, { status: 409 });
    }
    return Response.json({ error: "Could not save the member." }, { status: 500 });
  }
}

export async function updateMember(request: Request, id: string) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }
  const validation = memberSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      { error: validation.error.issues.map((issue) => issue.message).join(" ") },
      { status: 400 },
    );
  }
  const joinedAt = new Date(`${validation.data.registrationDate}T12:00:00`);
  const expiresAt = new Date(joinedAt);
  expiresAt.setFullYear(expiresAt.getFullYear() + validation.data.membershipPeriodYears);
  const { registrationDate, ...memberData } = validation.data;
  void registrationDate;
  try {
    const member = await prisma.member.update({
      where: { id },
      data: {
        ...memberData,
        email: validation.data.email || `member-${randomUUID()}@pcpa.invalid`,
        registrationDate: joinedAt,
        joinedAt,
        expiresAt,
      },
    });
    return Response.json(member);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return Response.json({ error: "Member not found." }, { status: 404 });
    }
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return Response.json({ error: "A member with this email already exists." }, { status: 409 });
    }
    return Response.json({ error: "Could not update the member." }, { status: 500 });
  }
}

export async function approveMember(id: string) {
  try {
    const result = await prisma.member.updateMany({
      where: { id, status: "Pending" },
      data: { status: "Active" },
    });
    if (!result.count) {
      const exists = await prisma.member.findUnique({ where: { id }, select: { id: true } });
      return Response.json({ error: exists ? "Member is not pending approval." : "Member not found." }, { status: exists ? 409 : 404 });
    }
    const member = await prisma.member.findUnique({ where: { id } });
    return Response.json(member);
  } catch {
    return Response.json({ error: "Could not approve the member." }, { status: 500 });
  }
}

export async function softDeleteMember(id: string) {
  try {
    const member = await prisma.member.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (!member.count) {
      return Response.json({ error: "Member not found or already deleted." }, { status: 404 });
    }
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Could not delete the member." }, { status: 500 });
  }
}
