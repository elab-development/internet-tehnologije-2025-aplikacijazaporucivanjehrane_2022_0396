import mongoose from "mongoose";

export function isValidObjectId(id) {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isNonEmptyString(value, { max = 200 } = {}) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= max;
}

