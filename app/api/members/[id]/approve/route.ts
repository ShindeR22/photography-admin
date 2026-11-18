import { approveMember } from "@/backend/members";
import { requireAdminWrite } from "@/lib/current-admin";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const denied = await requireAdminWrite();
  if (denied) return denied;
  const { id } = await context.params;
  return approveMember(id);
}
