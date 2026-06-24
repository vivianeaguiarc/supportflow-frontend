# SupportFlow Frontend

Interface web do **SupportFlow** — plataforma SaaS B2B de atendimento ao cliente, SAC e ouvidoria.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+

## Configuração

1. Instale as dependências:

```bash
pnpm install
```

2. Copie o arquivo de ambiente e configure a URL da API:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://support-flow-uath.onrender.com
```

Para desenvolvimento local com o backend rodando na máquina:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Scripts

| Comando          | Descrição                       |
| ---------------- | ------------------------------- |
| `pnpm dev`       | Servidor de desenvolvimento     |
| `pnpm build`     | Build de produção               |
| `pnpm start`     | Servidor de produção            |
| `pnpm lint`      | ESLint                          |
| `pnpm format`    | Prettier (formata arquivos)     |
| `pnpm typecheck` | Verificação de tipos TypeScript |

## Como rodar

```bash
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Rotas iniciais:

- `/login` — autenticação
- `/dashboard` — visão geral
- `/tickets` — listagem de chamados
- `/tickets/[id]` — detalhe do chamado

## API

O frontend consome a API REST documentada em:

- **Swagger:** https://support-flow-uath.onrender.com/api/docs/
- **OpenAPI JSON:** https://support-flow-uath.onrender.com/api/docs.json

O client HTTP centralizado está em `src/services/http-client.ts` e injeta automaticamente o header `Authorization: Bearer` quando há tokens JWT no `localStorage`.

## Estrutura de pastas

```
src/
├── app/                 # App Router (rotas e layouts)
├── components/          # Componentes reutilizáveis (UI, layout)
├── features/            # Módulos por domínio (ex.: auth)
├── hooks/               # React hooks (React Query)
├── lib/                 # Utilitários, config e auth storage
├── services/            # Client HTTP e serviços de API
├── styles/              # Estilos globais e tema
└── types/               # Tipos TypeScript compartilhados
```

## Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **TanStack Query** (React Query)
- **ESLint** + **Prettier**

## Autenticação (preparação)

A estrutura já prepara autenticação JWT:

- `src/lib/auth/token-storage.ts` — persistência de tokens
- `src/services/auth.service.ts` — login, refresh e logout
- Tokens armazenados em `localStorage` (próximo passo: guards de rota e refresh automático)

## Próximos passos sugeridos

1. Implementar proteção de rotas (middleware ou layout guard)
2. Refresh automático de token no `http-client`
3. Fluxo completo de login com redirecionamento por role
4. Filtros e paginação na listagem de chamados
