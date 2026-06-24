import type { LoginRequest } from "../types";

export const LOGIN_FIELDS = {
  email: {
    name: "email" as const,
    label: "E-mail",
  },
  password: {
    name: "password" as const,
    label: "Senha",
  },
} satisfies Record<
  keyof LoginRequest,
  { name: keyof LoginRequest; label: string }
>;

export type LoginSchema = LoginRequest;
