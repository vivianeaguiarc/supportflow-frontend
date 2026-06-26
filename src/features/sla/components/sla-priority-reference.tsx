import { Info } from "lucide-react";

import type { PriorityLevel } from "@/components/ui/constants";
import { PriorityBadge } from "@/components/ui/priority-badge";

import { PRIORITY_SLA_REFERENCE } from "../types";

/** Converte horas em rótulo legível (ex.: `72h` → `72h (3d)`). */
function formatHours(hours: number): string {
  return hours % 24 === 0 ? `${hours}h (${hours / 24}d)` : `${hours}h`;
}

/**
 * Referência (somente leitura) do SLA por prioridade — espelha a constante
 * `PRIORITY_SLA_HOURS` do backend. Não há endpoint para configurar esses
 * valores; o bloco é puramente informativo/documental.
 */
export function SlaPriorityReference() {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          Estes prazos por prioridade são uma{" "}
          <strong>regra fixa do backend</strong> e não são configuráveis pela
          API. Exibidos aqui apenas para transparência.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PRIORITY_SLA_REFERENCE.map((rule) => (
          <div
            key={rule.priority}
            className="flex items-center justify-between rounded-lg border border-border p-3"
          >
            <PriorityBadge
              level={rule.priority.toLowerCase() as PriorityLevel}
            />
            <span className="font-mono text-sm font-medium text-foreground">
              {formatHours(rule.hours)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
