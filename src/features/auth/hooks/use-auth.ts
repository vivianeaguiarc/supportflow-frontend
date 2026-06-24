import type { User } from "../types";

export function useAuth() {
  return {
    isAuthenticated: false,
    user: null as User | null,
    isLoading: false,
  };
}
