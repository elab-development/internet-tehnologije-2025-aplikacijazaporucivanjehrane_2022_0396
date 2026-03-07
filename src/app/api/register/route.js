import {User} from "@/models/User";
import bcrypt from "bcrypt";
import {jsonWithCors} from "@/libs/cors";
import {sanitizeString} from "@/libs/sanitize";
import {isValidEmail} from "@/libs/validation";
import mongoose from "mongoose";

export async function OPTIONS(req) {
  return jsonWithCors(req, null);
}

export async function POST(req) {
  const body = await req.json();
  mongoose.connect(process.env.MONGO_URL);
  const emailRaw = body?.email;
  const pass = body?.password;

  const email = typeof emailRaw === "string" ? emailRaw.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return jsonWithCors(req, {error: "Invalid email"}, {status: 400});
  }

  // Minimalna validacija lozinke (ne menjamo auth sistem, samo sprečavamo očigledno loše unose)
  if (typeof pass !== "string" || pass.length < 5) {
    return jsonWithCors(req, {error: "Password must be at least 5 characters"}, {status: 400});
  }

  const notHashedPassword = pass;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(notHashedPassword, salt);

  // XSS zaštita: iako email nije HTML, sanitizujemo kako bismo uklonili bilo kakve tagove
  const safeEmail = sanitizeString(email);

  const createdUser = await User.create({
    email: safeEmail,
    password: hashedPassword,
  });
  return jsonWithCors(req, createdUser);
}