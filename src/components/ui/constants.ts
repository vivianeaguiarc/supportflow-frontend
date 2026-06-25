/**
 * Tokens reutilizáveis do Design System do SupportFlow.
 *
 * Mantém em um só lugar as decisões visuais que se repetem entre componentes:
 * tons semânticos (cores de status), mapeamento de prioridade e larguras de
 * página. Espaçamentos, raios e sombras seguem a escala padrão do Tailwind +
 * tokens do tema (`--radius`, `ring-foreground/10`), evitando valores soltos.
 */

/** Tons semânticos genéricos (independentes de domínio). */
export type Tone =
  | "neutral"
  | "muted"
  | "info"
  | "success"
  | "warning"
  | "danger";

/** Classes de badge por tom (claro + escuro). */
export const TONE_BADGE_CLASSES: Record<Tone, string> = {
  neutral: "border-border bg-transparent text-foreground",
  muted: "border-transparent bg-muted text-muted-foreground",
  info: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  warning:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  danger:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
};

/** Níveis de prioridade genéricos (comuns a sistemas de atendimento). */
export type PriorityLevel = "low" | "medium" | "high" | "urgent";

/** Mapeia cada prioridade para um tom semântico. */
export const PRIORITY_TONE: Record<PriorityLevel, Tone> = {
  low: "muted",
  medium: "info",
  high: "warning",
  urgent: "danger",
};

/** Rótulos padrão (pt-BR) de prioridade — sobreponíveis via prop. */
export const PRIORITY_LABEL: Record<PriorityLevel, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

/** Larguras máximas de conteúdo padronizadas para páginas. */
export const PAGE_CONTAINER_SIZES = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-screen-2xl",
  full: "max-w-none",
} as const;

export type PageContainerSize = keyof typeof PAGE_CONTAINER_SIZES;
