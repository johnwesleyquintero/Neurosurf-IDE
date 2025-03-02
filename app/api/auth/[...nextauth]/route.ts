import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { getEnvVar } from "@/lib/env";
import GoogleProvider from "next-auth/providers/google";

const providers = [];

providers.push(GoogleProvider({
  clientId: getEnvVar("GOOGLE_CLIENT_ID"),
  clientSecret: getEnvVar("GOOGLE_CLIENT_SECRET"),
}));

const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
