import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

// Build providers conditionally so the app boots even when Google OAuth
// isn't configured yet on a given environment.
function buildProviders() {
  const list: any[] = [];
  if (googleConfigured) {
    list.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        // If a user previously signed up with the credentials provider using
        // the same email, link the Google account instead of erroring.
        allowDangerousEmailAccountLinking: true,
      }),
    );
  }
  list.push(
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
  );
  return list;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: buildProviders(),
  events: {
    // Ensure every brand-new user — including those signing in via Google
    // for the first time — has a Subscription row attached so quota lookups
    // work everywhere.
    async createUser({ user }) {
      try {
        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {},
          create: { userId: user.id, plan: "free", status: "active" },
        });
      } catch {
        // Best-effort — don't block sign-in if the row already exists.
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as { id?: string }).id;
      // For OAuth, `user.id` may be missing on subsequent JWT calls —
      // fall back to looking up by email so session.user.id is always set.
      if (!token.id && token.email) {
        const u = await prisma.user.findUnique({ where: { email: token.email as string } });
        if (u) token.id = u.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
