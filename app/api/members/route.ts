import { createMember, getMembers } from "@/backend/members";
import { requireAdminWrite } from "@/lib/current-admin";

function withCors(response: Response) {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function GET() {
  return withCors(await getMembers());
}

export async function POST(request: Request) {
  const denied = await requireAdminWrite();
  if (denied) return withCors(denied);
  return withCors(await createMember(request));
}

export async function OPTIONS() {
  return withCors(new Response(null, { status: 204 }));
}
