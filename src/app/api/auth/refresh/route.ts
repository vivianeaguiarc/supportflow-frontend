import { NextResponse } from "next/server";

import {
  clearSessionCookies,
  getRefreshTokenCookie,
  setSessionCookies,
} from "@/lib/auth/cookies";
import { config } from "@/lib/config";
import type { TokenPairResponse } from "@/types/auth";

const REFRESH_ERROR = {
  success: false,
  error: {
    code: "REFRESH_FAILED",
    message: "Sessão expirada.",
    details: [],
  },
};

export async function POST() {
  const refreshToken = await getRefreshTokenCookie();

  if (!refreshToken) {
    await clearSessionCookies();
    return NextResponse.json(REFRESH_ERROR, { status: 401 });
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${config.apiUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
  } catch {
    await clearSessionCookies();
    return NextResponse.json(REFRESH_ERROR, { status: 502 });
  }

  // O backend envelopa via `sendSuccess`: corpo real é
  // `{ success, data: { accessToken, refreshToken }, message }`. Aceitamos
  // também o formato cru por robustez.
  const payload = (await backendResponse.json().catch(() => null)) as
    | ({ data?: Partial<TokenPairResponse> } & Partial<TokenPairResponse>)
    | null;

  const tokens = payload?.data ?? payload;

  if (!backendResponse.ok || !tokens?.accessToken || !tokens?.refreshToken) {
    await clearSessionCookies();
    return NextResponse.json(REFRESH_ERROR, { status: 401 });
  }

  await setSessionCookies({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
