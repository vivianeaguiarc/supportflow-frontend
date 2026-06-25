import { NextResponse } from "next/server";

import { setSessionCookies } from "@/lib/auth/cookies";
import { config } from "@/lib/config";
import type { TokenPairResponse } from "@/types/auth";

const GENERIC_ERROR = {
  success: false,
  error: {
    code: "LOGIN_FAILED",
    message: "Não foi possível realizar o login.",
    details: [],
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

  // O backend envelopa via `sendSuccess`: o corpo real é
  // `{ success, data: { accessToken, refreshToken }, message }`. Aceitamos
  // também o formato cru por robustez. O usuário vem depois via GET /auth/me.
  const payload = (await backendResponse.json().catch(() => null)) as
    | (Record<string, unknown> & {
        data?: Partial<TokenPairResponse>;
      } & Partial<TokenPairResponse>)
    | null;

  const tokens = payload?.data ?? payload;

  if (!backendResponse.ok || !tokens?.accessToken || !tokens?.refreshToken) {
    return NextResponse.json(payload ?? GENERIC_ERROR, {
      status: backendResponse.status || 401,
    });
  }

  await setSessionCookies({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });

  return NextResponse.json(
    { success: true, message: "Login realizado com sucesso." },
    { status: 200 },
  );
}
