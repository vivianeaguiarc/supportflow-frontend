import { NextResponse } from "next/server";

import type { BackendRefreshData } from "@/features/auth/types";
import {
  clearSessionCookies,
  getRefreshTokenCookie,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setUserCookie,
} from "@/lib/auth/cookies";
import { config } from "@/lib/config";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";

const REFRESH_ERROR: ApiErrorResponse = {
  success: false,
  error: {
    code: "REFRESH_FAILED",
    message: "Sessão expirada.",
    details: null,
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

  const payload = (await backendResponse.json().catch(() => null)) as
    | ApiSuccessResponse<BackendRefreshData>
    | ApiErrorResponse
    | null;

  if (!backendResponse.ok || !payload || payload.success !== true) {
    await clearSessionCookies();
    return NextResponse.json(REFRESH_ERROR, { status: 401 });
  }

  await setAccessTokenCookie(payload.data.accessToken);

  if (payload.data.refreshToken) {
    await setRefreshTokenCookie(payload.data.refreshToken);
  }

  if (payload.data.user) {
    await setUserCookie(payload.data.user);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
