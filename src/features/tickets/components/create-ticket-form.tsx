"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FilterSelect,
  type FilterSelectOption,
} from "@/components/ui/filter-select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/loading-state";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import type { CreateTicketRequest } from "@/types/ticket";

import {
  useCategoryOptions,
  useCreateTicket,
  useCustomerOptions,
} from "../hooks";
import {
  type CreateTicketFormValues,
  createTicketSchema,
  TICKET_PRIORITY_OPTIONS,
} from "../schemas";

export function CreateTicketForm() {
  const router = useRouter();
  const { user } = useAuth();
  const isCustomer = user?.role === "CUSTOMER";

  const { mutate, isPending, isError, errorMessage } = useCreateTicket();

  // Clientes só são listáveis por staff; o próprio CUSTOMER usa seu id.
  const customersQuery = useCustomerOptions(!isCustomer);
  const categoriesQuery = useCategoryOptions();

  const form = useForm<CreateTicketFormValues>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      title: "",
      description: "",
      customerId: isCustomer ? (user?.id ?? "") : "",
      priority: "MEDIUM",
      categoryId: "",
    },
  });

  if (isCustomer && !user?.id) {
    return <LoadingState label="Carregando sua sessão..." />;
  }

  const customerOptions: FilterSelectOption[] = (customersQuery.data ?? []).map(
    (customer) => ({
      value: customer.id,
      label: `${customer.name} (${customer.email})`,
    }),
  );

  const categoryOptions: FilterSelectOption[] = (
    categoriesQuery.data ?? []
  ).map((category) => ({ value: category.id, label: category.name }));

  function onSubmit(values: CreateTicketFormValues) {
    const payload: CreateTicketRequest = {
      title: values.title,
      description: values.description,
      customerId: values.customerId,
      priority: values.priority,
      categoryId: values.categoryId ? values.categoryId : undefined,
    };

    mutate(payload, {
      onSuccess: (ticket) => {
        // Toast de sucesso é disparado centralmente via `meta` da mutation.
        router.push(ticket?.id ? `/tickets/${ticket.id}` : "/tickets");
      },
    });
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Resumo objetivo do chamado"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="Detalhe o que está acontecendo, com o máximo de contexto."
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <FormControl>
                      <FilterSelect
                        options={TICKET_PRIORITY_OPTIONS}
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <FilterSelect
                        options={categoryOptions}
                        placeholder={
                          categoriesQuery.isLoading
                            ? "Carregando categorias..."
                            : "Sem categoria"
                        }
                        value={field.value ?? ""}
                        onValueChange={field.onChange}
                        disabled={isPending || categoriesQuery.isLoading}
                      />
                    </FormControl>
                    <FormDescription>Opcional.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isCustomer ? null : (
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <FilterSelect
                        options={customerOptions}
                        placeholder={
                          customersQuery.isLoading
                            ? "Carregando clientes..."
                            : "Selecione um cliente"
                        }
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={isPending || customersQuery.isLoading}
                      />
                    </FormControl>
                    {customersQuery.isError ? (
                      <FormDescription className="text-destructive">
                        Não foi possível carregar a lista de clientes.
                      </FormDescription>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isError && errorMessage ? (
              <p className="text-sm text-destructive" role="alert">
                {errorMessage}
              </p>
            ) : null}

            <div className="flex items-center justify-end gap-3">
              <Link
                href="/tickets"
                className={buttonVariants({ variant: "outline" })}
              >
                Cancelar
              </Link>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar chamado"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
