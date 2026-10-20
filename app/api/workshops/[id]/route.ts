import { softDeleteWorkshop, updateWorkshop } from "@/backend/workshops";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return updateWorkshop(request, id);
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return softDeleteWorkshop(id);
}
