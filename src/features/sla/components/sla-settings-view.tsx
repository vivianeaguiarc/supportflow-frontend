"use client";

import { TriangleAlert } from "lucide-react";

import { PageSection } from "@/components/ui/page-section";

import { SlaPoliciesTable } from "./sla-policies-table";
import { SlaPriorityReference } from "./sla-priority-reference";
import { SlaSummaryCards } from "./sla-summary-cards";

/**
 * Tela de Configuração de SLA (somente leitura). Compõe os recursos reais
 * disponíveis no backend:
 * - indicadores operacionais (`GET /tickets/sla`);
 * - políticas por categoria (`GET /ticket-categories`);
 * - referência fixa de SLA por prioridade (constante de domínio).
 */
export function SlaSettingsView() {
  return (
    <div className="space-y-8">
      <PageSection
        title="Indicadores de SLA"
        description="Situação atual dos chamados ativos do tenant em relação ao SLA."
      >
        <SlaSummaryCards />
      </PageSection>

      <PageSection
        title="Políticas de SLA por categoria"
        description="Cada categoria define o tempo-alvo de resolução (slaHours). Use a busca, o filtro de situação e a ordenação para navegar."
      >
        <SlaPoliciesTable />
      </PageSection>

      <PageSection
        title="SLA por prioridade"
        description="Prazos aplicados conforme a prioridade do chamado."
      >
        <SlaPriorityReference />
      </PageSection>

      <PageSection title="Limitações do backend">
        <div className="callout-warning">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" />
          <div className="space-y-1">
            <p className="font-medium">
              Esta tela é somente leitura — o backend não expõe gerenciamento de
              SLA.
            </p>
            <ul className="list-inside list-disc space-y-0.5">
              <li>
                Não há endpoints de escrita (criar/editar/excluir) para
                políticas de SLA ou categorias; por isso não há formulário de
                edição.
              </li>
              <li>
                O modelo não possui campo de <strong>tempo de resposta</strong>{" "}
                dedicado (apenas o tempo de resolução via <code>slaHours</code>
                ).
              </li>
              <li>
                Não há conceito de <strong>canais atendidos</strong> associado
                às políticas de SLA.
              </li>
              <li>
                A organização é exposta apenas como <code>tenantId</code> (sem
                nome) e a visão é limitada ao tenant da sessão.
              </li>
            </ul>
          </div>
        </div>
      </PageSection>
    </div>
  );
}
