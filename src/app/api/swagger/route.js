import { openapi } from "@/libs/openapi";
import { jsonWithCors } from "@/libs/cors";

export function OPTIONS(req) {
  return jsonWithCors(req, null);
}

export function GET(req) {
  const origin = new URL(req.url).origin;

  const spec = {
    ...openapi,
    servers: [
      {
        url: origin,
        description: "Current server",
      },
    ],
  };

  return jsonWithCors(req, spec);
}