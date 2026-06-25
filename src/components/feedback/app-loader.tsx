import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

interface AppLoaderProps {
  label?: string;
  /** Ocupa a tela inteira (estados globais: sessão, rotas protegidas). */
  fullScreen?: boolean;
  className?: string;
}

/**
 * Representação padronizada de estados globais de carregamento.
 *
 * `fullScreen` cobre a viewport (ex.: hidratação da sessão); caso contrário
 * preenche o container pai. Acessível via `role=status` + `aria-live`.
 */
export function AppLoader({
  label = "Carregando...",
  fullScreen = false,
  className,
}: AppLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground",
        fullScreen ? "min-h-screen bg-background" : "w-full py-12",
        className,
      )}
    >
      <Loader2 className="size-6 animate-spin text-primary" />
      <span>{label}</span>
    </div>
  );
}
