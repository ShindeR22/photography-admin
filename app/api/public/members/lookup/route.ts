import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: Request) {
  const memberNumber = new URL(request.url).searchParams.get("memberNumber")?.trim();
  if (!memberNumber) {
    return Response.json({ error: "memberNumber is required." }, { status: 400, headers: corsHeaders });
  }

  try {
    const member = await prisma.member.findUnique({ where: { memberNumber } });
    const isActive = Boolean(member && member.status === "Active" && (!member.expiresAt || member.expiresAt > new Date()));
    if (!member || !isActive) {
      return Response.json({ error: "Active member not found." }, { status: 404, headers: corsHeaders });
    }

    return Response.json({
      memberNumber: member.memberNumber,
      name: member.name,
      phoneNumber: member.phone,
      studioName: member.studioName,
      address: member.address,
      profession: member.professions.filter(Boolean).join(", "),
    }, { headers: { ...corsHeaders, "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Could not look up public member:", error);
    return Response.json({ error: "Could not look up member." }, { status: 500, headers: corsHeaders });
  }
}
