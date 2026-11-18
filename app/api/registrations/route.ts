import { createRegistration, getRegistrations } from "@/backend/registrations";
import { requireAdminWrite } from "@/lib/current-admin";

export async function GET() {
  return getRegistrations();
}

export async function POST(request: Request) {
  const denied = await requireAdminWrite();
  if (denied) return denied;
  return createRegistration(request);
}
