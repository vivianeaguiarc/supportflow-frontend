import {
  getAccessToken,
  getStoredUser,
  removeAccessToken,
  removeStoredUser,
  setAccessToken,
  setStoredUser,
} from "../services";
import type { AuthUser } from "../types";

export interface AuthSnapshot {
  user: AuthUser | null;
  accessToken: string | null;
  isHydrated: boolean;
}

interface AuthSession {
  user: AuthUser;
  accessToken: string;
}

const SERVER_SNAPSHOT: AuthSnapshot = {
  user: null,
  accessToken: null,
  isHydrated: false,
};

let snapshot: AuthSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

function commit(next: AuthSnapshot): void {
  snapshot = next;
  emit();
}

export const authStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getSnapshot(): AuthSnapshot {
    return snapshot;
  },

  getServerSnapshot(): AuthSnapshot {
    return SERVER_SNAPSHOT;
  },

  hydrate(): void {
    const accessToken = getAccessToken();
    const user = getStoredUser();

    if (accessToken && user) {
      commit({ user, accessToken, isHydrated: true });
      return;
    }

    removeAccessToken();
    removeStoredUser();
    commit({ user: null, accessToken: null, isHydrated: true });
  },

  setSession(session: AuthSession): void {
    setAccessToken(session.accessToken);
    setStoredUser(session.user);
    commit({
      user: session.user,
      accessToken: session.accessToken,
      isHydrated: true,
    });
  },

  clear(): void {
    removeAccessToken();
    removeStoredUser();
    commit({ user: null, accessToken: null, isHydrated: true });
  },
};
