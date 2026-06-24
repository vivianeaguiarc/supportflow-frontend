import { NextResponse } from "next/server";

import { getRefreshTokenCookie, getUserCookie } from "@/lib/auth/cookies";

export async function GET() {
  const [user, refreshToken] = await Promise.all([
    getUserCookie(),
    getRefreshTokenCookie(),
  ]);

  if (!user || !refreshToken) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  return NextResponse.json({ success: true, data: { user } }, { status: 200 });
}
