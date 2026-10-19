import { createWorkshop, getWorkshops } from "@/backend/workshops";

export async function GET() {
  return getWorkshops();
}

export async function POST(request: Request) {
  return createWorkshop(request);
}
