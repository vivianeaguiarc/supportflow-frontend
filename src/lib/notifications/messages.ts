/**
 * Mensagens de feedback padronizadas (pt-BR).
 *
 * Centralizar os textos evita divergência de tom entre telas e facilita revisão
 * de copy/i18n futuro. Use sempre estas constantes em vez de strings soltas.
 */

function pluralizeTickets(count: number): string {
  return count === 1
    ? `${count} chamado atualizado.`
    : `${count} chamados atualizados.`;
}

export const MESSAGES = {
  auth: {
    loginSuccess: "Login realizado com sucesso.",
    logoutSuccess: "Sessão encerrada.",
    sessionExpired: "Sua sessão expirou. Faça login novamente.",
  },
  ticket: {
    created: "Chamado criado com sucesso.",
    statusUpdated: "Status atualizado.",
    assigned: "Responsável alterado.",
    bulkUpdated: pluralizeTickets,
  },
  dashboard: {
    refreshed: "Dados atualizados.",
  },
  error: {
    generic: "Algo deu errado. Tente novamente.",
    network: "Erro de comunicação com o servidor.",
    forbidden: "Permissão insuficiente.",
    ticketUpdate: "Erro ao atualizar chamado.",
  },
} as const;
