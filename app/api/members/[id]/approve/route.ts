import { approveMember } from "@/backend/members";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return approveMember(id);
}
