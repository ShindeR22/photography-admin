import { prisma } from "@/lib/prisma";
import { workshopSchema } from "@/lib/zod/workshop";

export async function getWorkshops() {
  try {
    const workshops = await prisma.workshop.findMany({
      where: {
        OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }],
      },
      orderBy: { date: "asc" },
    });
    return Response.json(workshops);
  } catch (error) {
    console.error("Could not load workshops from the database:", error);
    return Response.json({ error: "Could not load workshops from the database." }, { status: 500 });
  }
}

export async function createWorkshop(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = workshopSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      { error: validation.error.issues.map((issue) => issue.message).join(" ") },
      { status: 400 },
    );
  }

  const { date: dateValue, ...workshopData } = validation.data;
  try {
    const workshop = await prisma.workshop.create({
      data: { ...workshopData, date: new Date(`${dateValue}T12:00:00.000Z`) },
    });

    return Response.json(workshop, { status: 201 });
  } catch (error) {
    console.error("Could not save the workshop:", error);
    return Response.json(
      {
        error: "Could not save the workshop.",
        ...(process.env.NODE_ENV === "development" && error instanceof Error
          ? { detail: error.message }
          : {}),
      },
      { status: 500 },
    );
  }
}

export async function updateWorkshop(request: Request, id: string) {
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return Response.json({ error: "Workshop not found." }, { status: 404 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const validation = workshopSchema.safeParse(body);
  if (!validation.success) {
    return Response.json(
      { error: validation.error.issues.map((issue) => issue.message).join(" ") },
      { status: 400 },
    );
  }

  const { date: dateValue, ...workshopData } = validation.data;
  try {
    const workshop = await prisma.workshop.update({
      where: {
        id,
        OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }],
      },
      data: { ...workshopData, date: new Date(`${dateValue}T12:00:00.000Z`) },
    });
    return Response.json(workshop);
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "PrismaClientKnownRequestError" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return Response.json({ error: "Workshop not found." }, { status: 404 });
    }
    console.error("Could not update the workshop:", error);
    return Response.json({ error: "Could not update the workshop." }, { status: 500 });
  }
}

export async function softDeleteWorkshop(id: string) {
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return Response.json({ error: "Workshop not found." }, { status: 404 });
  }

  try {
    await prisma.workshop.update({
      where: {
        id,
        OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }],
      },
      data: { deletedAt: new Date() },
    });
    return Response.json({ success: true });
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "PrismaClientKnownRequestError" &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return Response.json({ error: "Workshop not found." }, { status: 404 });
    }
    console.error("Could not delete the workshop:", error);
    return Response.json({ error: "Could not delete the workshop." }, { status: 500 });
  }
}
