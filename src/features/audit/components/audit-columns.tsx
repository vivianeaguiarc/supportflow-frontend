"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { DataTableColumnHeader } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";

import {
  type AuditLogEntry,
  getAuditActionLabel,
  getAuditEntityLabel,
} from "../types";

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(new Date(value));
}

function shortId(id: string): string {
  return id.length > 10 ? `${id.slice(0, 8)}…` : id;
}

/** Falhas/negações ganham destaque vermelho; o restante fica neutro. */
function actionVariant(action: string): "destructive" | "secondary" {
  return action.includes("failed") ||
    action.includes("denied") ||
    action.includes("locked")
    ? "destructive"
    : "secondary";
}

const Mono = ({ value }: { value: string }) => (
  <span className="font-mono text-xs text-muted-foreground" title={value}>
    {shortId(value)}
  </span>
);

const Empty = () => <span className="text-xs text-muted-foreground">—</span>;

export const auditColumns: ColumnDef<AuditLogEntry, any>[] = [
  {
    accessorKey: "createdAt",
    enableSorting: true,
    meta: { label: "Data/hora" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data/hora" />
    ),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-muted-foreground">
        {formatDateTime(row.original.createdAt)}
      </span>
    ),
  },
  {
    accessorKey: "action",
    enableSorting: true,
    meta: { label: "Ação" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ação" />
    ),
    cell: ({ row }) => (
      <Badge variant={actionVariant(row.original.action)}>
        {getAuditActionLabel(row.original.action)}
      </Badge>
    ),
  },
  {
    accessorKey: "entity",
    enableSorting: true,
    meta: { label: "Entidade" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Entidade" />
    ),
    cell: ({ row }) => (
      <span className="text-sm">
        {getAuditEntityLabel(row.original.entity)}
      </span>
    ),
  },
  {
    accessorKey: "entityId",
    enableSorting: false,
    meta: { label: "Recurso" },
    header: "Recurso",
    cell: ({ row }) => {
      const { entity, entityId } = row.original;
      if (!entityId) return <Empty />;
      // Quando o recurso é um chamado, oferecemos o atalho para a página dele.
      if (entity === "ticket") {
        return (
          <Link
            href={`/tickets/${entityId}`}
            onClick={(event) => event.stopPropagation()}
            className="font-mono text-xs text-primary hover:underline"
            title={entityId}
          >
            {shortId(entityId)}
          </Link>
        );
      }
      return <Mono value={entityId} />;
    },
  },
  {
    accessorKey: "userId",
    enableSorting: true,
    meta: { label: "Usuário" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Usuário" />
    ),
    cell: ({ row }) =>
      row.original.userId ? (
        <Mono value={row.original.userId} />
      ) : (
        <span className="text-xs text-muted-foreground italic">Sistema</span>
      ),
  },
  {
    accessorKey: "ip",
    enableSorting: false,
    meta: { label: "IP" },
    header: "IP",
    cell: ({ row }) =>
      row.original.ip ? (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.ip}
        </span>
      ) : (
        <Empty />
      ),
  },
  {
    accessorKey: "requestId",
    enableSorting: false,
    meta: { label: "Request ID" },
    header: "Request ID",
    cell: ({ row }) =>
      row.original.requestId ? (
        <Mono value={row.original.requestId} />
      ) : (
        <Empty />
      ),
  },
  {
    accessorKey: "organizationId",
    enableSorting: true,
    meta: { label: "Tenant" },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tenant" />
    ),
    cell: ({ row }) =>
      row.original.organizationId ? (
        <Mono value={row.original.organizationId} />
      ) : (
        <Empty />
      ),
  },
  {
    accessorKey: "sequence",
    enableSorting: true,
    meta: { label: "Sequência" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => (
      <span
        className="font-mono text-xs text-muted-foreground"
        title="Posição na cadeia imutável"
      >
        {row.original.sequence}
      </span>
    ),
  },
];
