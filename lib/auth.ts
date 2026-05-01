import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

// NOTE: Credentials provider is used for the MVP so the app works without
// requiring an OAuth app. Swap or add Google/GitHub providers in production.
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        if (!email) return null;
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: credentials?.name || email.split("@")[0],
            subscription: { create: { plan: "free", status: "active" } },
          },
        });
        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as { id: string }).id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
};
