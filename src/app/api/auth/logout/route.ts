import { NextResponse } from "next/server";

import { clearSessionCookies } from "@/lib/auth/cookies";

export async function POST() {
  await clearSessionCookies();
  return new NextResponse(null, { status: 204 });
}
