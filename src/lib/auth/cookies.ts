import { cookies } from "next/headers";

import type { AuthUser } from "@/features/auth/types";

import {
  ACCESS_TOKEN_MAX_AGE,
  AUTH_COOKIES,
  REFRESH_TOKEN_MAX_AGE,
} from "./cookie-names";

interface SessionCookiesInput {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
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

export async function setUserCookie(user: AuthUser): Promise<void> {
  const store = await cookies();
  store.set(AUTH_COOKIES.user, JSON.stringify(user), {
    ...baseCookieOptions(),
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export async function setSessionCookies({
  accessToken,
  refreshToken,
  user,
}: SessionCookiesInput): Promise<void> {
  await Promise.all([
    setAccessTokenCookie(accessToken),
    setRefreshTokenCookie(refreshToken),
    setUserCookie(user),
  ]);
}

export async function clearSessionCookies(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIES.accessToken);
  store.delete(AUTH_COOKIES.refreshToken);
  store.delete(AUTH_COOKIES.user);
}

export async function getAccessTokenCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(AUTH_COOKIES.accessToken)?.value ?? null;
}

export async function getRefreshTokenCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(AUTH_COOKIES.refreshToken)?.value ?? null;
}

export async function getUserCookie(): Promise<AuthUser | null> {
  const store = await cookies();
  const raw = store.get(AUTH_COOKIES.user)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}
