"use client";

import "@/styles/globals.css";

import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    // global-error substitui o root layout: precisa de <html>/<body> próprios.
    <html lang="pt-BR">
      <body className="min-h-screen">
        <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background p-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Erro inesperado
            </h1>
            <p className="max-w-sm text-sm text-muted-foreground">
              A aplicação encontrou um problema crítico. Tente recarregar a
              página.
            </p>
            {error.digest ? (
              <p className="pt-1 font-mono text-xs text-muted-foreground/70">
                Ref: {error.digest}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
        </main>
      </body>
    </html>
  );
}
