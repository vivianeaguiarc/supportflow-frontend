import { ShieldOff } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface AccessDeniedProps {
  title?: string;
  description?: string;
  homeHref?: string;
  homeLabel?: string;
}

/** Estado de "acesso negado" para páginas/áreas não permitidas à role atual. */
export function AccessDenied({
  title = "Acesso negado",
  description = "Você não tem permissão para acessar este conteúdo.",
  homeHref = "/tickets",
  homeLabel = "Voltar para os chamados",
}: AccessDeniedProps) {
  return (
    <div className="py-8">
      <EmptyState
        icon={ShieldOff}
        tone="destructive"
        title={title}
        description={description}
        action={
          <Link
            href={homeHref}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            {homeLabel}
          </Link>
        }
      />
    </div>
  );
}
