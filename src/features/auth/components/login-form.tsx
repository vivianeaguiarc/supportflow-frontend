"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LifeBuoy, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useLogin } from "../hooks";
import { LOGIN_FIELDS, type LoginFormValues, loginSchema } from "../schemas";

export function LoginForm() {
  const { login, isLoading, errorMessage, reset } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    reset();
    login(values);
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
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name={LOGIN_FIELDS.email.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{LOGIN_FIELDS.email.label}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder={LOGIN_FIELDS.email.placeholder}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={LOGIN_FIELDS.password.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{LOGIN_FIELDS.password.label}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      placeholder={LOGIN_FIELDS.password.placeholder}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMessage ? (
              <p className="text-sm text-destructive" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
