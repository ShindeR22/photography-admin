import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { createRegistrationSchema, updateRegistrationSchema } from "@/lib/zod/registration";

export async function getRegistrations() {
  try {
    return Response.json(await prisma.registration.findMany({ orderBy: { registeredAt: "desc" } }));
  } catch {
    return Response.json(
      { error: "Could not load registrations from the database." },
      { status: 500 },
    );
  }
}

export async function createRegistration(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = createRegistrationSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      { error: validation.error.issues.map((issue) => issue.message).join(" ") },
      { status: 400 },
    );
  }

  try {
    const [member, workshop] = await Promise.all([
      prisma.member.findUnique({ where: { id: validation.data.memberId } }),
      prisma.workshop.findUnique({ where: { id: validation.data.workshopId } }),
    ]);

    if (!member || !workshop) {
      return Response.json({ error: "Select an existing member and workshop." }, { status: 404 });
    }

    const registration = await prisma.registration.create({
      data: {
        registrationNumber: `REG-${randomUUID().slice(0, 8).toUpperCase()}`,
        memberId: member.id,
        memberNumber: member.memberNumber,
        memberName: member.name,
        memberEmail: member.email,
        workshopId: workshop.id,
        workshopTitle: workshop.title,
        amount: workshop.registrationFee,
      },
    });
    return Response.json(registration, { status: 201 });
  } catch {
    return Response.json({ error: "Could not save the registration." }, { status: 500 });
  }
}

export async function updateRegistration(id: string, request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = updateRegistrationSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      { error: validation.error.issues.map((issue) => issue.message).join(" ") },
      { status: 400 },
    );
  }

  try {
    const registration = await prisma.registration.update({
      where: { id },
      data: validation.data,
    });
    return Response.json(registration);
  } catch {
    return Response.json({ error: "Could not update the registration." }, { status: 404 });
  }
}
