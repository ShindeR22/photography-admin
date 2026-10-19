import { createMember, getMembers } from "@/backend/members";

export async function GET() {
  return getMembers();
}

export async function POST(request: Request) {
  return createMember(request);
}
