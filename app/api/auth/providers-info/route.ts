import { NextResponse } from "next/server";

// Lightweight, public flag that tells the UI which buttons to render.
// Avoids importing server-only NextAuth internals into client code.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  });
}
