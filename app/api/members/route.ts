import { createMember, getMembers } from "@/backend/members";

function allowedOrigin(origin: string | null) {
  if (!origin) return null;

  const configuredOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (configuredOrigins.includes(origin)) return origin;

  // In local development, allow other localhost ports (for example Vite on :5173).
  if (process.env.NODE_ENV !== "production") {
    try {
      const url = new URL(origin);
      if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return origin;
    } catch {
      return null;
    }
  }

  return null;
}

function withCors(request: Request, response: Response) {
  const origin = allowedOrigin(request.headers.get("origin"));
  const headers = new Headers(response.headers);
  headers.set("Vary", "Origin");
  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function GET(request: Request) {
  return withCors(request, await getMembers());
}

export async function POST(request: Request) {
  return withCors(request, await createMember(request));
}

export async function OPTIONS(request: Request) {
  return withCors(request, new Response(null, { status: 204 }));
}
