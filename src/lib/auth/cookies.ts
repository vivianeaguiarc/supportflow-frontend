import { cookies } from "next/headers";

import {
  ACCESS_TOKEN_MAX_AGE,
  AUTH_COOKIES,
  REFRESH_TOKEN_MAX_AGE,
} from "./cookie-names";

interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
}

export async function setAccessTokenCookie(accessToken: string): Promise<void> {
  const store = await cookies();
  store.set(AUTH_COOKIES.accessToken, accessToken, {
    ...baseCookieOptions(),
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
}

export async function setRefreshTokenCookie(
  refreshToken: string,
): Promise<void> {
  const store = await cookies();
  store.set(AUTH_COOKIES.refreshToken, refreshToken, {
    ...baseCookieOptions(),
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export async function setSessionCookies({
  accessToken,
  refreshToken,
}: SessionTokens): Promise<void> {
  await Promise.all([
    setAccessTokenCookie(accessToken),
    setRefreshTokenCookie(refreshToken),
  ]);
}

export async function clearSessionCookies(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIES.accessToken);
  store.delete(AUTH_COOKIES.refreshToken);
}

export async function getAccessTokenCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(AUTH_COOKIES.accessToken)?.value ?? null;
}

export async function getRefreshTokenCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(AUTH_COOKIES.refreshToken)?.value ?? null;
}
