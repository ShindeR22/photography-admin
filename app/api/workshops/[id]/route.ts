import { softDeleteWorkshop, updateWorkshop } from "@/backend/workshops";
import { requireAdminWrite } from "@/lib/current-admin";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminWrite();
  if (denied) return denied;
  const { id } = await context.params;
  return updateWorkshop(request, id);
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminWrite();
  if (denied) return denied;
  const { id } = await context.params;
  return softDeleteWorkshop(id);
}
