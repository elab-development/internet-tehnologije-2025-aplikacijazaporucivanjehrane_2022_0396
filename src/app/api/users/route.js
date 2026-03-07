import {isAdmin} from "@/libs/isAdmin";
import {jsonWithCors} from "@/libs/cors";
import {User} from "@/models/User";
import mongoose from "mongoose";

export async function OPTIONS(req) {
  return jsonWithCors(req, null);
}

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);
  if (await isAdmin()) {
    const users = await User.find();
    return jsonWithCors(req, users);
  } else {
    return jsonWithCors(req, [], {status: 403});
  }
}