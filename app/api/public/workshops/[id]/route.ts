import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[a-f\d]{24}$/i.test(id)) {
    return Response.json({ error: "Workshop not found." }, { status: 404 });
  }

  try {
    const workshop = await prisma.workshop.findFirst({
      where: {
        id,
        OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }],
      },
      select: {
        id: true,
        title: true,
        date: true,
        venue: true,
        registrationFee: true,
        description: true,
        mentorName: true,
        time: true,
        status: true,
        imageUrls: true,
        sponsors: true,
        arrangedBy: true,
        anchorName: true,
        guestName: true,
      },
    });

    if (!workshop) {
      return Response.json({ error: "Workshop not found." }, { status: 404 });
    }

    return Response.json(workshop, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Could not load public workshop details:", error);
    return Response.json({ error: "Could not load workshop." }, { status: 500 });
  }
}
