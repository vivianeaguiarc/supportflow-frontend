import type { Metadata } from "next";

import { AccessDenied, Can } from "@/components/auth";
import { SlaSettingsView } from "@/features/sla";

export const metadata: Metadata = {
  title: "Configuração de SLA",
};

export default function SlaSettingsPage() {
  return (
    <Can
      perform="settings:sla:view"
      fallback={
        <AccessDenied
          homeHref="/dashboard"
          homeLabel="Voltar para o dashboard"
          description="Você não tem permissão para visualizar a configuração de SLA."
        />
      }
    >
      <SlaSettingsView />
    </Can>
  );
}
