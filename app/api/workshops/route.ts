import { createWorkshop, getWorkshops } from "@/backend/workshops";
import { requireAdminWrite } from "@/lib/current-admin";

export async function GET() {
  return getWorkshops();
}

export async function POST(request: Request) {
  const denied = await requireAdminWrite();
  if (denied) return denied;
  return createWorkshop(request);
}
