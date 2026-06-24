"use client";

import { LifeBuoy } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { LOGIN_FIELDS } from "../schemas";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <Card className="w-full max-w-md border-border/80 shadow-sm">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <LifeBuoy className="size-6" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl">SupportFlow</CardTitle>
          <CardDescription>
            Acesse sua conta para gerenciar chamados e atendimentos.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor={LOGIN_FIELDS.email.name}>
              {LOGIN_FIELDS.email.label}
            </Label>
            <Input
              id={LOGIN_FIELDS.email.name}
              name={LOGIN_FIELDS.email.name}
              type="email"
              autoComplete="email"
              placeholder="agente@supportflow.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={LOGIN_FIELDS.password.name}>
              {LOGIN_FIELDS.password.label}
            </Label>
            <Input
              id={LOGIN_FIELDS.password.name}
              name={LOGIN_FIELDS.password.name}
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <Button className="w-full" type="submit" disabled>
            Entrar
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Autenticação será habilitada na próxima etapa.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
