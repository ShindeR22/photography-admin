import { updateRegistration } from "@/backend/registrations";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return updateRegistration(id, request);
}
