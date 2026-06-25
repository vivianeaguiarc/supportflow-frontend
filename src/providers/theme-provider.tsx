"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Provider de tema (claro/escuro) baseado em `next-themes`. Aplica a classe
 * `.dark` no `<html>` (sincronizando com os tokens do Design System) e persiste
 * a preferência do usuário, com opção de seguir o sistema.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
