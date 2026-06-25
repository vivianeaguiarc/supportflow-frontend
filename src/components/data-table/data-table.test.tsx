import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import {
  DataTable,
  getSelectionColumn,
  useDataTable,
} from "@/components/data-table";
import { render, screen, userEvent } from "@/test/test-utils";

interface Row {
  id: string;
  name: string;
}

const DATA: Row[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
];

const columns: ColumnDef<Row, unknown>[] = [
  getSelectionColumn<Row>(),
  {
    accessorKey: "name",
    header: "Nome",
    cell: (ctx) => ctx.getValue<string>(),
  },
];

function TableHarness({
  data = DATA,
  onBulkDelete,
}: {
  data?: Row[];
  onBulkDelete?: (ids: string[]) => void;
}) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useDataTable<Row>({
    data,
    columns,
    pageCount: 1,
    pagination,
    onPaginationChange: setPagination,
    sorting,
    onSortingChange: setSorting,
    enableRowSelection: true,
    getRowId: (row) => row.id,
  });

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  return (
    <div>
      <button
        type="button"
        disabled={selectedIds.length === 0}
        onClick={() => onBulkDelete?.(selectedIds)}
      >
        Excluir selecionados
      </button>
      <DataTable table={table} emptyState={{ title: "Nenhum registro" }} />
    </div>
  );
}

describe("DataTable", () => {
  it("renderiza cabeçalhos e linhas", () => {
    render(<TableHarness />);

    expect(screen.getByText("Nome")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("exibe o empty state quando não há dados", () => {
    render(<TableHarness data={[]} />);

    expect(screen.getByText("Nenhum registro")).toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("permite selecionar uma linha", async () => {
    const user = userEvent.setup();
    render(<TableHarness />);

    const rowCheckboxes = screen.getAllByRole("checkbox", {
      name: "Selecionar linha",
    });
    expect(rowCheckboxes).toHaveLength(2);

    await user.click(rowCheckboxes[0]);

    expect(rowCheckboxes[0]).toBeChecked();
  });

  it("chama a ação em lote com os ids selecionados", async () => {
    const onBulkDelete = vi.fn();
    const user = userEvent.setup();
    render(<TableHarness onBulkDelete={onBulkDelete} />);

    const bulkButton = screen.getByRole("button", {
      name: "Excluir selecionados",
    });
    expect(bulkButton).toBeDisabled();

    await user.click(
      screen.getAllByRole("checkbox", { name: "Selecionar linha" })[0],
    );

    expect(bulkButton).toBeEnabled();

    await user.click(bulkButton);

    expect(onBulkDelete).toHaveBeenCalledWith(["1"]);
  });
});
