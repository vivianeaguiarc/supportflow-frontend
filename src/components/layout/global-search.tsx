"use client";

import { Search } from "lucide-react";

/** Campo de busca global — placeholder visual (sem integração funcional). */
export function GlobalSearch() {
  return (
    <div className="relative hidden min-w-0 flex-1 md:flex md:max-w-sm lg:max-w-md">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        type="search"
        disabled
        readOnly
        placeholder="Buscar chamados, clientes…"
        aria-label="Busca global (em breve)"
        aria-disabled="true"
        className="global-search-input"
      />
    </div>
  );
}
