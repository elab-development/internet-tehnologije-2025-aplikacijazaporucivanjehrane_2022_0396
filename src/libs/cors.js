const DEFAULT_ALLOWED_ORIGINS = ["http://localhost:3000"];

function getAllowedOrigins() {
  const env = process.env.ALLOWED_ORIGINS;
  const list = env
    ? env
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : DEFAULT_ALLOWED_ORIGINS;

  // NEXTAUTH_URL je u praksi isti origin kao i app (npr. http://localhost:3000)
  if (process.env.NEXTAUTH_URL && !list.includes(process.env.NEXTAUTH_URL)) {
    list.push(process.env.NEXTAUTH_URL);
  }
  return list;
}

function buildCorsHeaders(origin) {
  const headers = new Headers();
  if (!origin) return headers; // server-to-server ili same-origin bez Origin headera

  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Vary", "Origin");
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return headers;
}

/**
 * CORS guard:
 * - Ako origin nije dozvoljen → 403.
 * - Ako je OPTIONS (preflight) → vraća 204 sa CORS headerima.
 * - U suprotnom vraća { headers } koje treba dodati na Response.
 */
export function corsGuard(req) {
  const origin = req.headers.get("origin");
  const allowed = getAllowedOrigins();

  if (origin && !allowed.includes(origin)) {
    return {
      blocked: true,
      response: Response.json(
        { error: "CORS policy: origin not allowed" },
        { status: 403 }
      ),
    };
  }

  const headers = buildCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return {
      preflight: true,
      response: new Response(null, { status: 204, headers }),
    };
  }

  return { headers };
}

export function jsonWithCors(req, body, init = {}) {
  const guard = corsGuard(req);
  if (guard.blocked || guard.preflight) return guard.response;

  const mergedHeaders = new Headers(init.headers || {});
  for (const [k, v] of guard.headers.entries()) mergedHeaders.set(k, v);

  return Response.json(body, { ...init, headers: mergedHeaders });
}

