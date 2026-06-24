import { NextResponse } from "next/server";

import type { BackendLoginData } from "@/features/auth/types";
import { setSessionCookies } from "@/lib/auth/cookies";
import { config } from "@/lib/config";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/api";

const GENERIC_ERROR: ApiErrorResponse = {
  success: false,
  error: {
    code: "LOGIN_FAILED",
    message: "Não foi possível realizar o login.",
    details: null,
  },
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;

  if (!body || typeof body !== "object") {
    return NextResponse.json(GENERIC_ERROR, { status: 400 });
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${config.apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json(GENERIC_ERROR, { status: 502 });
  }

  const payload = (await backendResponse.json().catch(() => null)) as
    | ApiSuccessResponse<BackendLoginData>
    | ApiErrorResponse
    | null;

  if (!backendResponse.ok || !payload || payload.success !== true) {
    return NextResponse.json(payload ?? GENERIC_ERROR, {
      status: backendResponse.status || 401,
    });
  }

  const { accessToken, refreshToken, user } = payload.data;
  await setSessionCookies({ accessToken, refreshToken, user });

  return NextResponse.json(
    { success: true, data: { user }, message: "Login realizado com sucesso." },
    { status: 200 },
  );
}
