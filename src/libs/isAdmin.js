import {getServerSession} from "next-auth";
import {authOptions} from "@/libs/authOptions";
import {connectDB} from "@/libs/mongoose"; // ako ti je tu
import {UserInfo} from "@/models/UserInfo"; // prilagodi ako je druga putanja

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return false;

  await connectDB();

  const userInfo = await UserInfo.findOne({ email: session.user.email });
  return !!userInfo?.admin;
}