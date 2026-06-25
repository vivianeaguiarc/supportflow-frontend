"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
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

import { useCreateComment } from "../hooks";
import { type CreateCommentFormValues, createCommentSchema } from "../schemas";

interface CommentFormProps {
  ticketId: string;
}

/** Formulário de novo comentário interno (React Hook Form + Zod). */
export function CommentForm({ ticketId }: CommentFormProps) {
  const { user } = useAuth();
  const { mutate, isPending, isError, errorMessage } =
    useCreateComment(ticketId);

  const form = useForm<CreateCommentFormValues>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { content: "" },
  });

  function onSubmit(values: CreateCommentFormValues) {
    mutate(
      { content: values.content },
      { onSuccess: () => form.reset({ content: "" }) },
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
