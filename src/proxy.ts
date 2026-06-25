import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_COOKIES } from "@/lib/auth/cookie-names";

/**
 * Proxy (antigo "middleware" — renomeado no Next 16) para proteção de rota no
 * edge. É uma checagem *otimista* baseada na presença do cookie de sessão; a
 * autorização real (RBAC, validade do token) continua no backend e no
 * `AuthGuard`/`AuthProvider` do cliente. Objetivo aqui: evitar que páginas
 * protegidas comecem a renderizar para quem nem sequer tem sessão, e mandar
 * quem já está logado para fora do `/login`.
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/tickets",
  "/customers",
  "/users",
  "/notifications",
  "/audit",
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // O refresh token (7 dias) é o sinal de sessão: o access token (15 min) pode
  // ter expirado e ser renovado no cliente via `/auth/me` + `/auth/refresh`.
  const hasSession = Boolean(
    request.cookies.get(AUTH_COOKIES.refreshToken)?.value,
  );

  if (isProtectedPath(pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tickets/:path*",
    "/customers/:path*",
    "/users/:path*",
    "/notifications/:path*",
    "/audit/:path*",
    "/login",
  ],
};
