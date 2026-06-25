import "@tanstack/react-table";

import type { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // Metadados tipados por coluna, reutilizáveis por qualquer tabela.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Rótulo legível (usado no menu de visibilidade e em cabeçalhos). */
    label?: string;
    /** Classe aplicada às células do corpo. */
    cellClassName?: string;
    /** Classe aplicada à célula de cabeçalho. */
    headerClassName?: string;
  }
}
