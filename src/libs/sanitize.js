// src/libs/sanitize.js

export function sanitizeString(value) {
  if (typeof value !== "string") return "";
  // ukloni bilo kakve HTML tagove, vrati plain text
  return value.replace(/<[^>]*>/g, "").trim();
}

export function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") return sanitizeString(obj);
  if (Array.isArray(obj)) return obj.map((v) => sanitizeObject(v));
  if (typeof obj !== "object") return obj;

  const out = {};
  for (const [k, v] of Object.entries(obj)) out[k] = sanitizeObject(v);
  return out;
}

export function sanitizeHtmlStrict(dirtyHtml) {
  // ako ti ikad zatreba pravi HTML sanitizer, koristi biblioteku koja radi na Node-u bez jsdom
  return sanitizeString(dirtyHtml);
}