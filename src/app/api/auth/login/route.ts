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

  // O backend retorna TokenPairResponse "cru" ({ accessToken, refreshToken }),
  // sem envelope e sem usuário. O usuário é obtido depois via GET /auth/me.
  const payload = (await backendResponse.json().catch(() => null)) as
    | (Partial<TokenPairResponse> & Record<string, unknown>)
    | null;

  if (!backendResponse.ok || !payload?.accessToken || !payload?.refreshToken) {
    return NextResponse.json(payload ?? GENERIC_ERROR, {
      status: backendResponse.status || 401,
    });
  }

  await setSessionCookies({
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
  });

  return NextResponse.json(
    { success: true, message: "Login realizado com sucesso." },
    { status: 200 },
  );
}
