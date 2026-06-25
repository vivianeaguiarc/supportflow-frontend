"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAuth } from "@/hooks/use-auth";

import { useCreateTicketComment } from "../hooks";
import { type CreateCommentFormValues, createCommentSchema } from "../schemas";
import { COMMENT_VISIBILITY_META, COMMENT_VISIBILITY_VALUES } from "../types";

// O seletor de visibilidade só faz sentido quando há mais de uma opção. Hoje o
// backend só aceita `INTERNAL`, então este bloco fica oculto — mas o formulário
// já está pronto para visibilidades públicas sem refatoração.
const CAN_CHOOSE_VISIBILITY = COMMENT_VISIBILITY_VALUES.length > 1;

const VISIBILITY_OPTIONS: FilterSelectOption[] = COMMENT_VISIBILITY_VALUES.map(
  (value) => ({ value, label: COMMENT_VISIBILITY_META[value].label }),
);

interface CreateCommentFormProps {
  ticketId: string;
}

/** Formulário de novo comentário interno (React Hook Form + Zod). */
export function CreateCommentForm({ ticketId }: CreateCommentFormProps) {
  const { user } = useAuth();
  const { mutate, isPending, isError, errorMessage } =
    useCreateTicketComment(ticketId);

  const form = useForm<CreateCommentFormValues>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { content: "", visibility: "INTERNAL" },
  });

  function onSubmit(values: CreateCommentFormValues) {
    // O DTO real (`CreateCommentRequest`) só possui `content`; visibility fica
    // reservado para evolução futura e não é enviado enquanto for sempre INTERNAL.
    mutate(
      { content: values.content },
      {
        onSuccess: () =>
          form.reset({ content: "", visibility: values.visibility }),
      },
    );
  }

  return (
    <Form {...form}>
      <form
        className="flex gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <UserAvatar name={user?.name ?? "Você"} size="sm" className="mt-1" />

        <div className="flex-1 space-y-3">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Novo comentário</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder="Escreva um comentário interno (visível apenas para a equipe)..."
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Comentários são internos — o cliente não tem acesso.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {CAN_CHOOSE_VISIBILITY ? (
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem className="w-48">
                  <FormLabel>Visibilidade</FormLabel>
                  <FormControl>
                    <FilterSelect
                      options={VISIBILITY_OPTIONS}
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          {isError && errorMessage ? (
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Comentar
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
