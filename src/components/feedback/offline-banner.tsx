"use client";

import { WifiOff } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void): () => void {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot(): boolean {
  return navigator.onLine;
}

/** No servidor assumimos "online" para evitar flash de banner na hidratação. */
function getServerSnapshot(): boolean {
  return true;
}

/**
 * Banner global de conectividade. Detecta `navigator.onLine` via
 * `useSyncExternalStore` (seguro para SSR/hidratação) e avisa o usuário quando a
 * conexão cai — UX "offline first". Usa `aria-live=assertive` por ser um aviso
 * que impacta a capacidade de salvar dados.
 */
export function OfflineBanner() {
  const isOnline = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="assertive"
      className="fixed inset-x-0 top-0 z-[100] flex items-center justify-center gap-2 bg-destructive px-4 py-2 text-center text-sm font-medium text-white shadow-md"
    >
      <WifiOff className="size-4 shrink-0" />
      Você está sem conexão. Algumas ações podem não ser salvas.
    </div>
  );
}
