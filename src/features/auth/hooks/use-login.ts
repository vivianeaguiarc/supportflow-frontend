import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { MESSAGES } from "@/lib/notifications";
import { ApiError } from "@/types/api";

import { authService } from "../services";
import type { LoginRequest } from "../types";
import { useAuth } from "./use-auth";

function getLoginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "E-mail ou senha inválidos.";
    }

    return error.message || "Não foi possível realizar o login.";
  }

  return "Não foi possível realizar o login. Tente novamente.";
}

export function useLogin() {
  const router = useRouter();
  const { refreshSession } = useAuth();

  const mutation = useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    // Sucesso → toast global; erro permanece inline no formulário.
    meta: {
      successMessage: MESSAGES.auth.loginSuccess,
      suppressErrorToast: true,
    },
    onSuccess: async () => {
      // Após o login, recupera o usuário autenticado via GET /auth/me.
      await refreshSession();
      router.replace("/dashboard");
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    errorMessage: mutation.error ? getLoginErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
