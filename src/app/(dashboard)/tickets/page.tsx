import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { TicketsTable } from "@/features/tickets/components";

export const metadata: Metadata = {
  title: "Chamados",
};

export default function TicketsPage() {
  return (
    <AppShell
      title="Chamados"
      description="Lista de chamados do tenant com status, prioridade e protocolo."
    >
      <TicketsTable />
    </AppShell>
  );
}
