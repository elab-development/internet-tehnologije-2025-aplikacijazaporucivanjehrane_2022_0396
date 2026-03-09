import {isAdmin} from "@/libs/isAdmin";
import {jsonWithCors} from "@/libs/cors";
import {sanitizeString} from "@/libs/sanitize";
import {isNonEmptyString, isValidObjectId} from "@/libs/validation";
import {Category} from "@/models/Category";
import mongoose from "mongoose";

export async function OPTIONS(req) {
  return jsonWithCors(req, null);
}

export async function POST(req) {
  mongoose.connect(process.env.MONGO_URL);
  const {name} = await req.json();
  if (!(await isAdmin())) {
    return jsonWithCors(req, {error: "Unauthorized"}, {status: 403});
  }

  if (!isNonEmptyString(name, {max: 100})) {
    return jsonWithCors(req, {error: "Invalid category name"}, {status: 400});
  }

  const safeName = sanitizeString(name);
  const categoryDoc = await Category.create({name: safeName});
  return jsonWithCors(req, categoryDoc);
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  const {_id, name} = await req.json();
  if (!(await isAdmin())) {
    return jsonWithCors(req, {error: "Unauthorized"}, {status: 403});
  }

  if (!isValidObjectId(_id)) {
    return jsonWithCors(req, {error: "Invalid category ID"}, {status: 400});
  }
  if (!isNonEmptyString(name, {max: 100})) {
    return jsonWithCors(req, {error: "Invalid category name"}, {status: 400});
  }

  await Category.updateOne({_id}, {name: sanitizeString(name)});
  return jsonWithCors(req, true);
}

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);
  return jsonWithCors(req, await Category.find());
}

export async function DELETE(req) {
  mongoose.connect(process.env.MONGO_URL);
  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (!(await isAdmin())) {
    return jsonWithCors(req, {error: "Unauthorized"}, {status: 403});
  }

  if (!isValidObjectId(_id)) {
    return jsonWithCors(req, {error: "Invalid category ID"}, {status: 400});
  }

  await Category.deleteOne({_id});
  return jsonWithCors(req, true);
}