import { openapi } from "@/libs/openapi";
import {jsonWithCors} from "@/libs/cors";

export function OPTIONS(req) {
  return jsonWithCors(req, null);
}

export function GET(req) {
  return jsonWithCors(req, openapi);
}