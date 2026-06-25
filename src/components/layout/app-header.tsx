"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAuth } from "@/features/auth/hooks";

interface AppHeaderProps {
  title?: string;
  description?: string;
}

export function AppHeader({ title, description }: AppHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-6">
      <div className="min-w-0">
        {title ? (
          <h1 className="truncate text-lg font-semibold text-foreground">
            {title}
          </h1>
        ) : null}
        {description ? (
          <p className="truncate text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        ) : null}
        <UserAvatar name={user?.name ?? "SupportFlow"} />
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="size-4" />
          Sair
        </Button>
      </div>
    </header>
  );
}
