import type { ReactNode } from "react";

import { EmptyState } from "@/components/ui/empty-state";

interface DataTableEmptyProps {
  /** Número de colunas para o `colSpan` da célula única. */
  columnCount: number;
  title?: string;
  description?: string;
  action?: ReactNode;
}

/** Estado vazio renderizado como uma única linha que ocupa toda a tabela. */
export function DataTableEmpty({
  columnCount,
  title = "Nenhum resultado encontrado",
  description,
  action,
}: DataTableEmptyProps) {
  return (
    <tbody>
      <tr>
        <td colSpan={columnCount} className="py-10">
          <EmptyState title={title} description={description} action={action} />
        </td>
      </tr>
    </tbody>
  );
}
