import { updateRegistration } from "@/backend/registrations";
import { requireAdminWrite } from "@/lib/current-admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminWrite();
  if (denied) return denied;
  const { id } = await params;
  return updateRegistration(id, request);
}
