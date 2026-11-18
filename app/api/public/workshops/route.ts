import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  try {
    const workshops = await prisma.workshop.findMany({
      where: {
        isActive: true,
        OR: [{ deletedAt: null }, { deletedAt: { isSet: false } }],
      },
      orderBy: { date: "asc" },
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
      },
    });

    return Response.json(workshops, {
      headers: { ...corsHeaders, "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Could not load public workshops:", error);
    return Response.json(
      { error: "Could not load workshops." },
      { status: 500, headers: corsHeaders },
    );
  }
}
