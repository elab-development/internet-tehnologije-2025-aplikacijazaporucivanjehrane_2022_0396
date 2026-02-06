import { UserInfo } from "@/models/UserInfo";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import NextAuth, { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/libs/mongoose";

export const authOptions = {
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const { email, password } = credentials;

          await connectDB(); // ✅ jedina konekcija

          const user = await User.findOne({ email });
          if (!user) {
            return null;
          }

          // Ako je korisnik registrovan preko Google-a
          if (!user.password) {
            return null;
          }

          const passwordOk = bcrypt.compareSync(password, user.password);
          if (!passwordOk) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null; // 🔥 KLJUČNO: nikad ne bacaj error
        }
      },
    }),
  ],
};

export async function isAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return false;

  await connectDB();

  const userInfo = await UserInfo.findOne({ email: session.user.email });
  return !!userInfo?.admin;
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };