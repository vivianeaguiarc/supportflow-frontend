export const AUTH_COOKIES = {
  accessToken: "sf_access_token",
  refreshToken: "sf_refresh_token",
  user: "sf_user",
} as const;

export const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutos
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias
