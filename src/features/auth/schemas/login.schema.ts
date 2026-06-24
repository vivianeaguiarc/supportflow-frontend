import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido."),
  password: z
    .string()
    .min(1, "Informe sua senha.")
    .min(8, "A senha deve ter no mínimo 8 caracteres."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const LOGIN_FIELDS = {
  email: {
    name: "email" as const,
    label: "E-mail",
    placeholder: "agente@supportflow.com",
  },
  password: {
    name: "password" as const,
    label: "Senha",
    placeholder: "••••••••",
  },
} satisfies Record<
  keyof LoginFormValues,
  { name: keyof LoginFormValues; label: string; placeholder: string }
>;
