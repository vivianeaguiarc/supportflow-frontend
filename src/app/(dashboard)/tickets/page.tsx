import type { Metadata } from "next";
import { Suspense } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { TicketsView } from "@/features/tickets/components";

export const metadata: Metadata = {
  title: "Chamados",
};

function TicketsViewFallback() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  );
}

export default function TicketsPage() {
  return (
    <AppShell
      title="Chamados"
      description="Lista de chamados do tenant com filtros, ordenação e paginação."
    >
      <Suspense fallback={<TicketsViewFallback />}>
        <TicketsView />
      </Suspense>
    </AppShell>
  );
}
