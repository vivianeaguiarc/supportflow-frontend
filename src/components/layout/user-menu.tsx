"use client";

import { Popover } from "@base-ui/react/popover";
import { LogOut } from "lucide-react";
import { useState } from "react";

import { ConfirmActionDialog } from "@/components/feedback";
import { Button, buttonVariants } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAuth } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./theme-toggle";

/** Menu do usuário: perfil, tema e logout. */
export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={`Menu do usuário: ${user.name}`}
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "rounded-full",
        )}
      >
        <UserAvatar name={user.name} size="sm" />
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="end" className="z-50">
          <Popover.Popup className="w-72 max-w-[calc(100vw-2rem)] origin-[var(--transform-origin)] rounded-xl bg-card text-card-foreground shadow-lg ring-1 ring-foreground/10 transition-[transform,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <UserAvatar name={user.name} />
              <div className="min-w-0 flex-1">
                <Popover.Title className="truncate font-heading text-sm font-semibold">
                  {user.name}
                </Popover.Title>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Aparência
              </p>
              <ThemeToggle className="w-full border-border bg-muted/30" />
            </div>

            <div className="border-t border-border p-2">
              <ConfirmActionDialog
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-destructive hover:text-destructive"
                  >
                    <LogOut className="size-4" aria-hidden />
                    Sair
                  </Button>
                }
                title="Encerrar sessão"
                description="Você precisará fazer login novamente para acessar o painel."
                confirmLabel="Sair"
                tone="destructive"
                onConfirm={async () => {
                  await logout();
                  setOpen(false);
                }}
              />
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
