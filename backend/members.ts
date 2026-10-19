import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { memberSchema } from "@/lib/zod/member";

export async function getMembers() {
  try {
    return Response.json(await prisma.member.findMany({ orderBy: { joinedAt: "desc" } }));
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

  const joinedAt = new Date();
  const expiresAt = new Date(joinedAt);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  try {
    const member = await prisma.member.create({
      data: {
        ...validation.data,
        memberNumber: `PCA-${randomUUID().slice(0, 8).toUpperCase()}`,
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
