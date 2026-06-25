import { FileQuestion } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background p-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <FileQuestion className="size-6" />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-muted-foreground">Erro 404</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Página não encontrada
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          A página que você procura não existe, foi movida ou o endereço está
          incorreto.
        </p>
      </div>
      <Link
        href="/dashboard"
        className={buttonVariants({ variant: "default", size: "sm" })}
      >
        Voltar para o início
      </Link>
    </main>
  );
}
