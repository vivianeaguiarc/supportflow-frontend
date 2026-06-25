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
