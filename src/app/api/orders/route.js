import {authOptions} from "@/libs/authOptions";
import {isAdmin} from "@/libs/isAdmin";
import {jsonWithCors} from "@/libs/cors";
import {isValidObjectId} from "@/libs/validation";
import {Order} from "@/models/Order";
import mongoose from "mongoose";
import {getServerSession} from "next-auth";

export async function OPTIONS(req) {
  return jsonWithCors(req, null);
}

export async function GET(req) {
  mongoose.connect(process.env.MONGO_URL);

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  const admin = await isAdmin();

  const url = new URL(req.url);
  const _id = url.searchParams.get('_id');
  if (_id) {
    if (!isValidObjectId(_id)) {
      return jsonWithCors(req, {error: "Invalid order ID"}, {status: 400});
    }

    // IDOR zaštita:
    // - admin može da pristupi bilo kojoj porudžbini
    // - korisnik može samo svojim porudžbinama
    if (admin) {
      const order = await Order.findById(_id);
      return jsonWithCors(req, order || {}, {status: order ? 200 : 404});
    }

    if (!userEmail) {
      return jsonWithCors(req, {error: "Unauthorized"}, {status: 401});
    }

    const order = await Order.findOne({_id, userEmail});
    return jsonWithCors(req, order || {}, {status: order ? 200 : 404});
  }


  if (admin) {
    return jsonWithCors(req, await Order.find());
  }

  if (userEmail) {
    return jsonWithCors(req, await Order.find({userEmail}));
  }

  return jsonWithCors(req, {error: "Unauthorized"}, {status: 401});
}