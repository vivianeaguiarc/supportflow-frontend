"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("[app/error]", error);
    }
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background p-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Algo deu errado
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Ocorreu um erro inesperado ao exibir esta página. Você pode tentar
          novamente.
        </p>
        {error.digest ? (
          <p className="pt-1 font-mono text-xs text-muted-foreground/70">
            Ref: {error.digest}
          </p>
        ) : null}
      </div>
      <Button size="sm" onClick={() => unstable_retry()}>
        Tentar novamente
      </Button>
    </main>
  );
}
