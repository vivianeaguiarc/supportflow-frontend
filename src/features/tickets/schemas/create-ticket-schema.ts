import { z } from "zod";

/**
 * Schema de criação de chamado — espelho 1:1 do DTO real do backend
 * (`createTicketSchema`, `.strict()`):
 * title 3–200, description 10–10.000, customerId (UUID, obrigatório),
 * priority? (enum), categoryId? (UUID), assignedToId? (UUID).
 *
 * Aqui mantemos apenas os campos expostos no formulário. `assignedToId` não é
 * coletado nesta tela (atribuição é feita pela ação dedicada no detalhe).
 */
export const TICKET_PRIORITY_VALUES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] as const;

export const createTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Informe um título com ao menos 3 caracteres.")
    .max(200, "O título deve ter no máximo 200 caracteres."),
  description: z
    .string()
    .trim()
    .min(10, "Descreva o chamado com ao menos 10 caracteres.")
    .max(10000, "A descrição deve ter no máximo 10.000 caracteres."),
  customerId: z.string().uuid("Selecione um cliente válido."),
  priority: z.enum(TICKET_PRIORITY_VALUES),
  // Select nativo emite "" quando nenhuma categoria é escolhida (opcional).
  categoryId: z.string().optional(),
});

export type CreateTicketFormValues = z.infer<typeof createTicketSchema>;

export const TICKET_PRIORITY_OPTIONS: { value: string; label: string }[] = [
  { value: "LOW", label: "Baixa" },
  { value: "MEDIUM", label: "Média" },
  { value: "HIGH", label: "Alta" },
  { value: "URGENT", label: "Urgente" },
];
