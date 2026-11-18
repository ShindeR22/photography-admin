import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { createRegistrationSchema, publicWorkshopRegistrationSchema, updateRegistrationSchema } from "@/lib/zod/registration";

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
      prisma.workshop.findFirst({
        where: {
          id: validation.data.workshopId,
          OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }],
        },
      }),
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

export async function createPublicWorkshopRegistration(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = publicWorkshopRegistrationSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      { error: validation.error.issues.map((issue) => issue.message).join(" ") },
      { status: 400 },
    );
  }

  try {
    const { workshopId, memberNumber } = validation.data;
    if (!/^[a-f\d]{24}$/i.test(workshopId)) {
      return Response.json({ error: "Invalid workshop ID." }, { status: 400 });
    }
    const workshop = await prisma.workshop.findFirst({
      where: {
        id: workshopId,
        isActive: true,
        OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }],
      },
    });
    if (!workshop) {
      return Response.json({ error: "Workshop not found or registration is closed." }, { status: 404 });
    }

    const member = memberNumber
      ? await prisma.member.findUnique({ where: { memberNumber } })
      : null;
    const isActiveMember = Boolean(member && member.status === "Active" && (!member.expiresAt || member.expiresAt > new Date()));
    if (memberNumber && !isActiveMember) {
      return Response.json({ error: "Member number not found or membership is inactive." }, { status: 400 });
    }
    const name = isActiveMember ? member!.name : validation.data.name?.trim();
    const phoneNumber = isActiveMember ? member!.phone : validation.data.phoneNumber?.trim();
    const studioName = isActiveMember ? member!.studioName : validation.data.studioName?.trim();
    const address = isActiveMember ? member!.address : validation.data.address?.trim();
    const profession = isActiveMember
      ? member!.professions.filter(Boolean).join(", ")
      : validation.data.profession?.trim();
    if (!isActiveMember && (!name || !phoneNumber || !studioName || !address || !profession)) {
      return Response.json({
        error: "For non-members, name, phoneNumber, studioName, address, and profession are required.",
      }, { status: 400 });
    }
    const registrationName = name ?? "";
    const registrationPhone = phoneNumber ?? "";
    const registrationStudio = studioName ?? "";
    const registrationAddress = address ?? "";
    const registrationProfession = profession ?? "";
    const amount = isActiveMember ? workshop.registrationFee * 0.5 : workshop.registrationFee;

    const existingRegistration = await prisma.registration.findFirst({
      where: {
        workshopId: workshop.id,
        ...(isActiveMember
          ? { memberNumber }
          : { phoneNumber: registrationPhone }),
      },
      select: { id: true },
    });
    if (existingRegistration) {
      return Response.json(
        { error: "You are already registered for this workshop." },
        { status: 409 },
      );
    }

    const registration = await prisma.registration.create({
      data: {
        registrationNumber: `REG-${randomUUID().slice(0, 8).toUpperCase()}`,
        memberId: member?.id,
        memberNumber,
        memberName: registrationName,
        memberEmail: member?.email,
        phoneNumber: registrationPhone,
        studioName: registrationStudio,
        address: registrationAddress,
        profession: registrationProfession,
        workshopId: workshop.id,
        workshopTitle: workshop.title,
        amount,
      },
    });

    return Response.json({
      registration,
      fee: amount,
      feeType: isActiveMember ? "member" : "standard",
    }, { status: 201 });
  } catch (error) {
    console.error("Could not save public workshop registration:", error);
    return Response.json({
      error: "Could not save the registration.",
      ...(process.env.NODE_ENV === "development" && error instanceof Error
        ? { detail: error.message }
        : {}),
    }, { status: 500 });
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
