/**
 * Reexporta tokens do Design System para compatibilidade com imports existentes
 * em `@/components/ui/*`. Fonte canônica: `@/lib/theme`.
 */
export {
  DESIGN_SYSTEM,
  PAGE_CONTAINER_SIZES,
  type PageContainerSize,
  PRIORITY_LABEL,
  PRIORITY_TONE,
  type PriorityLevel,
  SLA_CHIP_CLASSES,
  type SlaChipState,
  STAT_ACCENT_CLASSES,
  type StatAccent,
  TICKET_STATUS_CHART_BAR,
  type Tone,
  TONE_CLASSES,
} from "@/lib/theme";

/** @deprecated Use `TONE_CLASSES` — alias mantido para retrocompatibilidade. */
export { TONE_CLASSES as TONE_BADGE_CLASSES } from "@/lib/theme";
