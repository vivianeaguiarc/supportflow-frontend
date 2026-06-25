const numberFormatter = new Intl.NumberFormat("pt-BR");

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatPercent(value: number): string {
  return `${numberFormatter.format(Math.round(value * 10) / 10)}%`;
}

export function formatHours(value: number): string {
  return `${numberFormatter.format(Math.round(value * 10) / 10)}h`;
}

export function formatRating(value: number): string {
  return numberFormatter.format(Math.round(value * 10) / 10);
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat("pt-BR", {
  numeric: "auto",
});

/** Tempo relativo a partir de uma data ISO (ex.: "há 5 min"). */
export function formatRelativeTime(iso: string): string {
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return "";

  const diffSeconds = Math.round((target - Date.now()) / 1000);
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 60)
    return relativeTimeFormatter.format(diffSeconds, "second");

  const diffMinutes = Math.round(diffSeconds / 60);
  if (Math.abs(diffMinutes) < 60)
    return relativeTimeFormatter.format(diffMinutes, "minute");

  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24)
    return relativeTimeFormatter.format(diffHours, "hour");

  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 30)
    return relativeTimeFormatter.format(diffDays, "day");

  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12)
    return relativeTimeFormatter.format(diffMonths, "month");

  return relativeTimeFormatter.format(Math.round(diffMonths / 12), "year");
}

const periodLabelFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
});

/** Rótulo curto de período para eixos de gráfico (dd/MM quando for data). */
export function formatPeriodLabel(period: string): string {
  const parsed = new Date(period);
  if (Number.isNaN(parsed.getTime())) return period;
  return periodLabelFormatter.format(parsed);
}
