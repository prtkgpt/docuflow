import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { sendEmail, magicLinkHtml, welcomeHtml } from "@/lib/email";

const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const magicLinkConfigured = !!process.env.RESEND_API_KEY;
// Allow the legacy passwordless credentials provider only when explicitly
// enabled — by default we go magic-link-first so anyone can't sign in
// just by typing someone else's email.
const allowPasswordless = process.env.ALLOW_PASSWORDLESS_SIGNIN === "true";

function buildProviders() {
  const list: any[] = [];

  if (googleConfigured) {
    list.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        allowDangerousEmailAccountLinking: true,
      }),
    );
  }

  if (magicLinkConfigured) {
    list.push(
      EmailProvider({
        // The `from` is read by NextAuth even though we override the actual
        // send function — keeping it set silences a console warning.
        from: process.env.EMAIL_FROM || "MyPDFKitty <onboarding@resend.dev>",
        maxAge: 24 * 60 * 60, // 24h link lifetime
        async sendVerificationRequest({ identifier, url }) {
          console.log("[auth] sendVerificationRequest", { to: identifier, urlHost: new URL(url).host });
          const result = await sendEmail({
            to: identifier,
            subject: `Sign in to MyPDFKitty`,
            html: magicLinkHtml(url),
            text: `Sign in to MyPDFKitty: ${url}`,
          });
          if (!result) {
            // Surfacing this as a thrown error makes NextAuth return an
            // EmailSignin error to the client so the UI can react.
            throw new Error("Failed to send sign-in email — see Vercel logs");
          }
        },
      }),
    );
  }

  if (allowPasswordless || !magicLinkConfigured) {
    // Fallback for environments without Resend (preview deploys / local
    // development). Creates the user on first sign-in like before.
    list.push(
      CredentialsProvider({
        name: "Email (no password)",
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
  }

  return list;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  // Magic-link / Email provider needs database sessions for the verification
  // token table. We keep JWT for the actual user session so middleware can
  // read it without a DB hit on every request.
  session: { strategy: "jwt" },
  pages: { signIn: "/login", verifyRequest: "/login?check=email" },
  providers: buildProviders(),
  events: {
    async createUser({ user }) {
      // Ensure every new user has a Subscription row + send welcome email.
      try {
        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {},
          create: { userId: user.id, plan: "free", status: "active" },
        });
      } catch { /* row already exists */ }
      if (user.email) {
        sendEmail({
          to: user.email,
          subject: "Welcome to MyPDFKitty",
          html: welcomeHtml(user.name),
        }).catch(() => null);
      }
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as { id?: string }).id;
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
