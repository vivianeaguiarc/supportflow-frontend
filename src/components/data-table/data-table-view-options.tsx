"use client";

import { Menu } from "@base-ui/react/menu";
import type { Table } from "@tanstack/react-table";
import { Check, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

/** Menu para alternar a visibilidade das colunas (colunas com `enableHiding`). */
export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const hideableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide());

  if (hideableColumns.length === 0) {
    return null;
  }

  return (
    <Menu.Root>
      <Menu.Trigger
        render={
          <Button variant="outline" size="sm">
            <SlidersHorizontal />
            Colunas
          </Button>
        }
      />
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="end" className="z-50">
          <Menu.Popup className="min-w-44 origin-[var(--transform-origin)] rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md outline-none">
            <Menu.GroupLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Exibir colunas
            </Menu.GroupLabel>
            {hideableColumns.map((column) => {
              const label = column.columnDef.meta?.label ?? column.id;
              return (
                <Menu.CheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(checked) =>
                    column.toggleVisibility(checked)
                  }
                  closeOnClick={false}
                  className="flex cursor-default items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm capitalize outline-none select-none data-[highlighted]:bg-muted"
                >
                  {label}
                  <Menu.CheckboxItemIndicator>
                    <Check className="size-4" />
                  </Menu.CheckboxItemIndicator>
                </Menu.CheckboxItem>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
