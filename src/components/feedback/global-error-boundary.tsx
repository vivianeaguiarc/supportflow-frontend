"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface GlobalErrorBoundaryProps {
  children: ReactNode;
  /** Fallback customizado; recebe um `reset` para tentar re-renderizar. */
  fallback?: (props: { error: Error; reset: () => void }) => ReactNode;
}

interface GlobalErrorBoundaryState {
  error: Error | null;
}

/**
 * Captura erros inesperados de renderização na árvore React, evitando a "tela
 * branca". Exibe um fallback do Design System com opção de recuperação.
 *
 * Erros assíncronos (fetch/mutations) NÃO passam por aqui — esses são tratados
 * pela camada de notificações (`notify`/React Query). Este boundary é a rede de
 * segurança para falhas de render/runtime do cliente.
 */
export class GlobalErrorBoundary extends Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  state: GlobalErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): GlobalErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (process.env.NODE_ENV !== "production") {
      console.error("[GlobalErrorBoundary]", error, info.componentStack);
    }
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (error) {
      if (fallback) return fallback({ error, reset: this.reset });

      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
          <EmptyState
            tone="destructive"
            title="Algo deu errado"
            description="Ocorreu um erro inesperado ao exibir esta página. Tente novamente."
            action={
              <Button size="sm" onClick={this.reset}>
                Tentar novamente
              </Button>
            }
          />
        </div>
      );
    }

    return children;
  }
}
