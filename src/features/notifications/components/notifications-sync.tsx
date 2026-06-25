"use client";

import { useNotificationsSync } from "../hooks";

/**
 * Componente sem UI que ativa a sincronização de cache por polling de
 * notificações (`useNotificationsSync`). Deve ser montado uma única vez na área
 * autenticada (AppShell).
 */
export function NotificationsSync(): null {
  useNotificationsSync();
  return null;
}
