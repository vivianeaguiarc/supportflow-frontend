import { cn } from "@/lib/utils";

interface DataTableLoadingProps {
  /** Número de colunas para alinhar o esqueleto à tabela. */
  columnCount: number;
  rowCount?: number;
  className?: string;
}

/** Esqueleto de carregamento de linhas, alinhado ao número de colunas. */
export function DataTableLoading({
  columnCount,
  rowCount = 5,
  className,
}: DataTableLoadingProps) {
  return (
    <tbody className={className} aria-busy="true">
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-border/70 last:border-0">
          {Array.from({ length: columnCount }).map((__, colIndex) => (
            <td key={colIndex} className="px-3 py-3">
              <div
                className={cn(
                  "h-4 animate-pulse rounded bg-muted",
                  colIndex === 0 ? "w-3/4" : "w-1/2",
                )}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
