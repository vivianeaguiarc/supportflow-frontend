"use client";

import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks";

interface AppHeaderProps {
  title: string;
  description?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "SF";

  const [first, last] = [parts[0], parts[parts.length - 1]];
  return `${first[0] ?? ""}${parts.length > 1 ? (last[0] ?? "") : ""}`.toUpperCase();
}

export function AppHeader({ title, description }: AppHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        ) : null}
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary/10 text-xs text-primary">
            {user ? getInitials(user.name) : "SF"}
          </AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut className="size-4" />
          Sair
        </Button>
      </div>
    </header>
  );
}
