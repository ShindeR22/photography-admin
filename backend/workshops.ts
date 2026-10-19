import { prisma } from "@/lib/prisma";
import { workshopSchema } from "@/lib/zod/workshop";

export async function getWorkshops() {
  try {
    const workshops = await prisma.workshop.findMany({ orderBy: { date: "asc" } });
    return Response.json(workshops);
  } catch {
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
  } catch {
    return Response.json({ error: "Could not save the workshop." }, { status: 500 });
  }
}
