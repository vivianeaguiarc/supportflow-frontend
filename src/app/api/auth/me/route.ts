import { NextResponse } from "next/server";

import type { AuthUser } from "@/features/auth/types";
import { backendFetch } from "@/lib/api/backend";
import { unwrap } from "@/types/api";

const UNAUTHORIZED = {
  success: false,
  error: {
    code: "UNAUTHORIZED",
    message: "Sessão inválida ou expirada.",
    details: [],
  },
};

/**
 * BFF para `GET /auth/me`. Usa o access token (cookie HttpOnly) para consultar
 * o backend e devolve o usuário autenticado normalizado em `ApiSuccessResponse`.
 *
 * O status 401 é preservado para que o http-client do cliente acione o fluxo de
 * refresh single-flight e, em caso de falha, encerre a sessão.
 */
export async function GET() {
  const response = await backendFetch("/auth/me");

  if (!response.ok) {
    return NextResponse.json(UNAUTHORIZED, {
      status: response.status === 401 ? 401 : response.status,
    });
  }

  const raw = (await response.json().catch(() => null)) as unknown;
  const user = raw
    ? unwrap<AuthUser>(
        raw as AuthUser | { success: true; data: AuthUser; message: string },
      )
    : null;

  if (!user) {
    return NextResponse.json(UNAUTHORIZED, { status: 401 });
  }

  return NextResponse.json(
    { success: true, data: user, message: "Usuário autenticado." },
    { status: 200 },
  );
}
