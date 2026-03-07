import {authOptions} from "@/libs/authOptions";
import {isAdmin} from "@/libs/isAdmin";
import {jsonWithCors} from "@/libs/cors";
import {sanitizeObject, sanitizeString} from "@/libs/sanitize";
import {isValidObjectId, isNonEmptyString} from "@/libs/validation";
import {User} from "@/models/User";
import {UserInfo} from "@/models/UserInfo";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";

export async function OPTIONS(req) {
  return jsonWithCors(req, null);
}

export async function PUT(req) {
  mongoose.connect(process.env.MONGO_URL);
  const data = await req.json();
  const {_id, name, image, ...otherUserInfo} = data;
  const admin = await isAdmin();

  let filter = {};
  if (_id) {
    // IDOR zaštita: _id query/body je dozvoljen samo adminu
    if (!admin) {
      return jsonWithCors(req, {error: "Forbidden"}, {status: 403});
    }
    if (!isValidObjectId(_id)) {
      return jsonWithCors(req, {error: "Invalid user ID"}, {status: 400});
    }
    filter = {_id};
  } else {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return jsonWithCors(req, {error: "Unauthorized"}, {status: 401});
    }
    filter = {email};
  }

  const user = await User.findOne(filter);
  if (!user) {
    return jsonWithCors(req, {error: "User not found"}, {status: 404});
  }

  // XSS zaštita: sanitizacija korisničkog unosa pre upisa u bazu
  const safeName = isNonEmptyString(name) ? sanitizeString(name) : user.name;
  const safeImage = typeof image === "string" ? sanitizeString(image) : user.image;
  const safeOtherInfo = sanitizeObject(otherUserInfo);

  await User.updateOne(filter, {name: safeName, image: safeImage});
  await UserInfo.findOneAndUpdate({email:user.email}, safeOtherInfo, {upsert:true});

  return jsonWithCors(req, true);
}

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);
  const admin = await isAdmin();

  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');

  let filterUser = {};
  if (_id) {
    // IDOR zaštita: _id parametar je dozvoljen samo adminu
    if (!admin) {
      return jsonWithCors(req, {error: "Forbidden"}, {status: 403});
    }
    if (!isValidObjectId(_id)) {
      return jsonWithCors(req, {error: "Invalid user ID"}, {status: 400});
    }
    filterUser = {_id};
  } else {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    if (!email) {
      return jsonWithCors(req, {}, {status: 401});
    }
    filterUser = {email};
  }

  const user = await User.findOne(filterUser).lean();
  if (!user) {
    return jsonWithCors(req, {}, {status: 404});
  }
  const userInfo = await UserInfo.findOne({email:user.email}).lean();

  return jsonWithCors(req, {...user, ...userInfo});

}