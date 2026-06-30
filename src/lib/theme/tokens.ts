/**
 * SupportFlow — Design Tokens (TypeScript)
 *
 * Espelho programático dos tokens CSS em `src/styles/tokens/`.
 * Use classes utilitárias ou variáveis CSS sempre que possível; este módulo
 * serve para documentação, testes e mapeamentos em componentes React.
 */

/** Tons semânticos genéricos (independentes de domínio). */
export type Tone =
  | "neutral"
  | "muted"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "primary"
  | "accent";

/** Classes de badge/chip por tom — definidas em `tokens/semantic.css`. */
export const TONE_CLASSES: Record<Tone, string> = {
  neutral: "tone-neutral",
  muted: "tone-muted",
  info: "tone-info",
  success: "tone-success",
  warning: "tone-warning",
  danger: "tone-danger",
  primary: "tone-primary",
  accent: "tone-accent",
};

/** Acentos de indicadores (CardStat, métricas). */
export type StatAccent =
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

export const STAT_ACCENT_CLASSES: Record<StatAccent, string> = {
  primary: "stat-chip-primary",
  accent: "stat-chip-accent",
  success: "stat-chip-success",
  warning: "stat-chip-warning",
  danger: "stat-chip-danger",
  info: "stat-chip-info",
  neutral: "stat-chip-neutral",
};

/** Estados de SLA (mesa de atendimento). */
export type SlaChipState = "breached" | "warning" | "ok" | "none";

export const SLA_CHIP_CLASSES: Record<SlaChipState, string> = {
  breached: "sla-chip-breached",
  warning: "sla-chip-warning",
  ok: "sla-chip-ok",
  none: "sla-chip-none",
};

/** Níveis de prioridade genéricos. */
export type PriorityLevel = "low" | "medium" | "high" | "urgent";

export const PRIORITY_TONE: Record<PriorityLevel, Tone> = {
  low: "muted",
  medium: "info",
  high: "warning",
  urgent: "danger",
};

export const PRIORITY_LABEL: Record<PriorityLevel, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  urgent: "Urgente",
};

/** Barras de gráfico por status de ticket (usa tokens chart-*). */
export const TICKET_STATUS_CHART_BAR: Record<string, string> = {
  OPEN: "bg-chart-4",
  IN_PROGRESS: "bg-chart-1",
  WAITING_CUSTOMER: "bg-chart-3",
  ESCALATED: "bg-chart-5",
  RESOLVED: "bg-chart-2",
  CLOSED: "bg-muted-foreground/50",
};

/** Larguras máximas de conteúdo padronizadas para páginas. */
export const PAGE_CONTAINER_SIZES = {
  narrow: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-screen-2xl",
  full: "max-w-none",
} as const;

export type PageContainerSize = keyof typeof PAGE_CONTAINER_SIZES;

/** Metadados da identidade visual (documentação programática). */
export const DESIGN_SYSTEM = {
  name: "SupportFlow Design System",
  codename: "Clarity & Care",
  fontSans: "Mulish",
  fontMono: "Geist Mono",
  fontHeading: "Mulish",
  radiusBase: "0.625rem",
} as const;
