import {isAdmin} from "@/libs/isAdmin";
import {jsonWithCors} from "@/libs/cors";
import {sanitizeObject, sanitizeString} from "@/libs/sanitize";
import {isNonEmptyString, isValidObjectId} from "@/libs/validation";
import {MenuItem} from "@/models/MenuItem";
import mongoose from "mongoose";

export async function OPTIONS(req) {
  return jsonWithCors(req, null);
}

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);
  const data = await req.json();
  if (!(await isAdmin())) {
    return jsonWithCors(req, {error: "Unauthorized"}, {status: 403});
  }

  if (!isNonEmptyString(data?.name, {max: 200})) {
    return jsonWithCors(req, {error: "Invalid menu item name"}, {status: 400});
  }

  const safe = sanitizeObject(data);
  if (safe.category && !isValidObjectId(safe.category)) {
    return jsonWithCors(req, {error: "Invalid category ID"}, {status: 400});
  }

  // name/description eksplicitno sanitizujemo kao string (bez HTML tagova)
  safe.name = sanitizeString(data.name);
  if (typeof data.description === "string") safe.description = sanitizeString(data.description);

  const menuItemDoc = await MenuItem.create(safe);
  return jsonWithCors(req, menuItemDoc);
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  if (!(await isAdmin())) {
    return jsonWithCors(req, {error: "Unauthorized"}, {status: 403});
  }

  const {_id, ...data} = await req.json();
  if (!isValidObjectId(_id)) {
    return jsonWithCors(req, {error: "Invalid menu item ID"}, {status: 400});
  }

  const safe = sanitizeObject(data);
  if (safe.category && !isValidObjectId(safe.category)) {
    return jsonWithCors(req, {error: "Invalid category ID"}, {status: 400});
  }
  if (safe.name !== undefined && !isNonEmptyString(safe.name, {max: 200})) {
    return jsonWithCors(req, {error: "Invalid menu item name"}, {status: 400});
  }

  await MenuItem.findByIdAndUpdate(_id, safe);
  return jsonWithCors(req, true);
}

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);
  return jsonWithCors(req, await MenuItem.find());
}

export async function DELETE(req) {
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (!(await isAdmin())) {
    return jsonWithCors(req, {error: "Unauthorized"}, {status: 403});
  }

  if (!isValidObjectId(_id)) {
    return jsonWithCors(req, {error: "Invalid menu item ID"}, {status: 400});
  }

  await MenuItem.deleteOne({_id});
  return jsonWithCors(req, true);
}