import type { AuthUser } from "../types";

export function useAuth() {
  return {
    isAuthenticated: false,
    user: null as AuthUser | null,
    isLoading: false,
  };
}
