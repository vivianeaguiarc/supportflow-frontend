import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { ApiError } from "@/types/api";

import { authService } from "../services";
import type { LoginRequest } from "../types";

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

  const mutation = useMutation({
    mutationFn: (payload: LoginRequest) => authService.login(payload),
    onSuccess: () => {
      router.push("/dashboard");
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
