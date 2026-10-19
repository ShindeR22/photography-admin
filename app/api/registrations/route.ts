import { createRegistration, getRegistrations } from "@/backend/registrations";

export async function GET() {
  return getRegistrations();
}

export async function POST(request: Request) {
  return createRegistration(request);
}
