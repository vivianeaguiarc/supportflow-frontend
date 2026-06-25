# Integração Frontend ↔ Backend — SupportFlow

> **Fonte da verdade:** código do `supportflow-backend` (controllers, rotas e
> mappers do módulo `auth`/`tickets`/`analytics`) + OpenAPI/Swagger
> (`https://support-flow-uath.onrender.com/api/docs`). Nenhum endpoint, DTO ou
> campo neste documento foi inventado.
>
> ⚠️ Onde o Swagger e o código divergem, **o código vence**. Em especial: o
> backend **envelopa todas as respostas** via `sendSuccess`/`sendPaginatedSuccess`
> (`{ success, data, message }`), mesmo quando o schema do Swagger documenta
> apenas o conteúdo de `data` (ex.: `TokenPairResponse`, `Ticket`).

Este documento é **contract-first**: descreve os contratos reais do backend e
como o frontend (Next.js App Router) deve consumi-los. As definições TypeScript
correspondentes vivem em `src/types/*` e `src/lib/api-*.ts`.

---

## 1. URL base e variáveis de ambiente

| Ambiente            | Base URL                                        |
| ------------------- | ----------------------------------------------- |
| Local (dev)         | `http://localhost:3000/api/v1`                  |
| Produção (Swagger)  | `https://api.supportflow.com/api/v1`            |
| Deploy atual em uso | `https://support-flow-uath.onrender.com/api/v1` |

> **Atenção:** o prefixo de versão **`/api/v1` faz parte da base** e já está
> incluído em `NEXT_PUBLIC_API_URL`. Os paths neste doc são relativos a essa
> base (ex.: `/auth/login` → `.../api/v1/auth/login`).

Variável de ambiente (frontend):

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://support-flow-uath.onrender.com/api/v1
```

Lida em `src/lib/config.ts` e usada pelo client HTTP (`config.apiUrl`).

---

## 2. Autenticação e segurança

### 2.1. Esquemas de segurança do backend

| Esquema      | Tipo              | Header                  | Uso                                         |
| ------------ | ----------------- | ----------------------- | ------------------------------------------- |
| `BearerAuth` | HTTP bearer (JWT) | `Authorization: Bearer` | Autenticação de usuários                    |
| `ApiKeyAuth` | API key           | `x-api-key`             | Integrações externas (`supportflow_sk_...`) |

**O backend usa JWT via header `Authorization: Bearer`** — ele **não** usa
cookies. Não há `security` global: cada rota declara o esquema (a maioria exige
`BearerAuth`; `/auth/*` e `/health/*` são públicas).

### 2.2. Endpoints de autenticação

Todos envelopados em `ApiSuccessResponse<...>` (`{ success, data, message }`):

| Método | Path            | Auth   | Body                  | `data` da resposta (200/201) |
| ------ | --------------- | ------ | --------------------- | ---------------------------- |
| GET    | `/auth/me`      | Bearer | —                     | `AuthUser`                   |
| POST   | `/auth/login`   | —      | `{ email, password }` | `TokenPairResponse`          |
| POST   | `/auth/refresh` | —      | `{ refreshToken }`    | `TokenPairResponse`          |
| POST   | `/auth/logout`  | —      | `{ refreshToken }`    | `{ message: string }`        |

```ts
interface TokenPairResponse {
  accessToken: string; // JWT — usar em Authorization: Bearer
  refreshToken: string; // JWT — renovação de sessão
}

// GET /auth/me → ApiSuccessResponse<AuthUser> (mapper toAuthUser do backend)
interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}
```

`GET /auth/me` exige `Authorization: Bearer` e é a fonte da identidade do
usuário (o login **não** retorna `user`). Status de erro de auth: `400` (payload
inválido), `401` (credenciais/refresh inválidos ou expirados/ausência de token).

### 2.3. Arquitetura de sessão adotada no frontend (BFF)

O backend entrega tokens no corpo da resposta. Para **não expor JWT ao
JavaScript do navegador** (proteção contra XSS), o frontend usa um padrão
**Backend-for-Frontend (BFF)** com Route Handlers do Next.js:

```
Browser ──cookie HttpOnly──▶ Next.js Route Handler (/api/auth/*) ──Bearer──▶ Backend
```

- O navegador chama rotas locais `/api/auth/*` com `credentials: "include"`.
- O Route Handler guarda `accessToken`/`refreshToken` em **cookies HttpOnly** e
  injeta `Authorization: Bearer` ao falar com o backend (`src/lib/api/backend.ts`).
- Renovação automática: em `401`, o client tenta `/api/auth/refresh` uma única
  vez (single-flight) e refaz a request original; se falhar, faz logout seguro.
- Proteção de rotas no servidor: `src/proxy.ts` (middleware do Next.js 16).

> Por isso o **client HTTP do navegador usa `credentials: "include"`** (cookie),
> enquanto o **Bearer é aplicado apenas no servidor** (BFF). Ambos os mundos são
> compatíveis com o backend, que continua recebendo `Authorization: Bearer`.

### 2.4. Autorização / RBAC

Roles do backend (`UserRole`): `ADMIN`, `SUPERVISOR`, `AGENT`, `CUSTOMER`,
`OMBUDSMAN`. Endpoints administrativos respondem `403 FORBIDDEN` quando a role
não é suficiente (ex.: `POST /users`, `/admin/*`). O RBAC visual no frontend
**ainda não foi implementado** (fora do escopo atual) — a role deve ser usada
futuramente para esconder/desabilitar ações.

---

## 3. Padrões de resposta

✅ **Envelope universal:** no código, **todos** os endpoints respondem via
`sendSuccess` (`ApiSuccessResponse<T>`) ou `sendPaginatedSuccess`
(`ApiPaginatedSuccessResponse<T>`). O Swagger às vezes documenta só o conteúdo de
`data` (parecendo "cru"), mas o corpo HTTP real é sempre envelopado. Mesmo assim,
o frontend usa o helper `unwrap` (`src/lib/api-response.ts`), que aceita tanto a
resposta envelopada quanto a crua — garantindo robustez se algum endpoint mudar.

### 3.1. `ApiResponse` (envelope de sucesso)

```ts
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}
```

### 3.2. `PaginatedResponse` (lista paginada)

```ts
interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
  message: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

### 3.3. Padrão de erro da API

```ts
interface ApiErrorResponse {
  success: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details: unknown[];
  };
  requestId?: string; // correlação com logs do backend
}

type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "RESOURCE_NOT_FOUND"
  | "UNIQUE_CONSTRAINT_VIOLATION"
  | "INTERNAL_SERVER_ERROR";
```

> O schema `Error` no Swagger é apenas um **alias legado** de `ApiErrorResponse`.

### 3.4. Leitura segura da resposta

Como o corpo é sempre envelopado, os services chamam `unwrap()` para extrair o
recurso de `data` (em listas paginadas, leem `data` + `meta`). `unwrap()` também
funciona caso a resposta venha crua, então a camada de service não precisa
adivinhar o formato.

---

## 4. Endpoints de domínio

### 4.1. Tickets / Chamados

Todos exigem `Authorization: Bearer`. Respostas envelopadas (`data` indicado):

| Método | Path                        | Body / Params               | `data` da resposta             |
| ------ | --------------------------- | --------------------------- | ------------------------------ |
| GET    | `/tickets`                  | query params (ver abaixo)   | `Ticket[]` + `meta` (paginado) |
| POST   | `/tickets`                  | `CreateTicketRequest`       | `Ticket` (201)                 |
| GET    | `/tickets/{id}`             | —                           | `Ticket`                       |
| GET    | `/tickets/{id}/history`     | —                           | `TicketHistory`                |
| GET    | `/tickets/{id}/transitions` | —                           | `TicketStatusTransitions`      |
| GET    | `/tickets/summary`          | —                           | `TicketSummary`                |
| GET    | `/tickets/metrics`          | —                           | `TicketMetrics`                |
| PATCH  | `/tickets/{id}/status`      | `UpdateTicketStatusRequest` | `Ticket`                       |
| PATCH  | `/tickets/{id}/assign`      | `AssignTicketRequest`       | `Ticket`                       |

**Query params de `GET /tickets`:** `status`, `priority`, `categoryId`,
`customerId`, `assignedTo`, `assignedToId`, `unassigned`, `team`, `overdue`,
`search`, `createdFrom`, `createdTo`, `page` (≥1, default 1), `limit` (1–100,
default 10), `sortBy` (`createdAt|slaDueAt|priority`), `sortOrder` (`asc|desc`).

```ts
interface Ticket {
  id: string;
  tenantId: string;
  protocol: string; // ex.: "TK-2024-001234"
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerId: string;
  categoryId: string | null;
  assignedToId: string | null;
  slaDueAt: string; // ISO date-time
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_CUSTOMER"
  | "ESCALATED"
  | "RESOLVED"
  | "CLOSED";

type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface CreateTicketRequest {
  title: string; // min 3
  description: string; // min 10
  customerId: string;
  priority?: TicketPriority;
  categoryId?: string;
  assignedToId?: string;
}

interface UpdateTicketStatusRequest {
  status: TicketStatus;
}
interface AssignTicketRequest {
  agentId: string;
} // `assignedToId` é alias legado/deprecated

// GET /tickets/{id}/history → ApiSuccessResponse<TicketHistory>
type TicketHistoryEvent =
  | "CREATED"
  | "ASSIGNED"
  | "REASSIGNED"
  | "STATUS_CHANGED"
  | "PRIORITY_CHANGED"
  | "CATEGORY_CHANGED"
  | "COMMENT_ADDED"
  | "ATTACHMENT_ADDED"
  | "ATTACHMENT_REMOVED"
  | "TICKET_ESCALATED"
  | "SLA_BREACHED";

interface TicketHistoryEntry {
  id: string;
  ticketId: string;
  actorId: string | null; // só o ID (backend não expõe nome aqui)
  action: TicketHistoryEvent;
  oldValue: string | null;
  newValue: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string; // ISO; backend ordena por createdAt asc
}
interface TicketHistory {
  ticketId: string;
  history: TicketHistoryEntry[];
}

// GET /tickets/{id}/transitions → ApiSuccessResponse<TicketStatusTransitions>
interface TicketStatusTransitions {
  currentStatus: TicketStatus;
  allowedTransitions: TicketStatus[]; // state machine do backend
}
```

> **State machine (backend):** `OPEN → IN_PROGRESS|ESCALATED`;
> `IN_PROGRESS → WAITING_CUSTOMER|ESCALATED|RESOLVED`;
> `WAITING_CUSTOMER → IN_PROGRESS|ESCALATED`;
> `ESCALATED → IN_PROGRESS|RESOLVED`; `RESOLVED → CLOSED`; `CLOSED → ∅`.
> O frontend não replica essa tabela: consome `GET /tickets/{id}/transitions`
> para exibir apenas transições válidas.

### 4.2. Dashboard / Analytics

| Método | Path                  | Resposta                                |
| ------ | --------------------- | --------------------------------------- |
| GET    | `/analytics/overview` | `ApiSuccessResponse<AnalyticsOverview>` |

Já integrado via BFF `GET /api/dashboard/overview` →
`src/features/dashboard`. Existem ainda `/analytics/tickets-by-status`,
`/tickets-by-priority`, `/sla`, `/agents-performance`, `/csat` (não consumidos
ainda).

### 4.3. Usuários / Clientes / Empresas

| Método | Path          | Body / Params                                                    | Resposta                          |
| ------ | ------------- | ---------------------------------------------------------------- | --------------------------------- |
| GET    | `/users`      | page, limit, sortBy, sortOrder, search, role, createdFrom/To     | `ApiPaginatedResponse<User>`      |
| POST   | `/users`      | `CreateUserRequest`                                              | `User` (201) — exige role ≥ ADMIN |
| GET    | `/users/{id}` | —                                                                | `User`                            |
| GET    | `/customers`  | page, limit, sortBy, sortOrder, search, isActive, createdFrom/To | `ApiPaginatedResponse<Customer>`  |

```ts
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  createdAt: string;
}

interface Customer {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string | null;
  document: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

> Não existe schema/endpoint de **empresas** separado de "tenant". O isolamento
> multi-tenant aparece como `tenantId` nas entidades. Não há CRUD de tenants
> exposto no OpenAPI.

---

## 5. Contratos TypeScript no frontend

| Arquivo                   | Responsabilidade                                                                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/api-error.ts`    | `ApiError` (classe), `ApiErrorCode`, `getErrorMessage()`                                                                                                    |
| `src/lib/api-response.ts` | `ApiSuccessResponse`, `ApiPaginatedResponse`, `PaginationMeta`, `ApiErrorResponse`, type guards, `unwrap()`                                                 |
| `src/types/api.ts`        | Barrel estável re-exportando a infraestrutura acima                                                                                                         |
| `src/types/auth.ts`       | `LoginRequest`, `TokenPairResponse`/`AuthTokens`, `RefreshRequest`, `LogoutRequest/Response`, `AuthUser`, `UserRole`                                        |
| `src/types/user.ts`       | `User`, `UserRole`, `UserSummary`, `Customer`, `CreateUserRequest`, `ListUsersParams`                                                                       |
| `src/types/ticket.ts`     | `Ticket`, `TicketStatus`, `TicketPriority`, `TicketSummary`, `CreateTicketRequest`, `UpdateTicketStatusRequest`, `AssignTicketRequest`, `ListTicketsParams` |

As features reexportam desses contratos canônicos (`src/features/*/types`),
mantendo uma **única fonte da verdade** alinhada ao backend.

---

## 6. Camada de integração (client, services, hooks, provider)

### 6.1. Client HTTP — `src/services/http/api-client.ts`

Client centralizado (reexportado também em `src/services/http-client.ts` por
compatibilidade). Exporta `httpClient<T>(path, options)` e o açúcar `apiClient`
(`get`/`post`/`put`/`patch`/`delete`). Comportamento (camada de interceptors):

- Usa `NEXT_PUBLIC_API_URL` (via `config.apiUrl`); opção `local: true` para
  chamar Route Handlers do BFF (`/api/...`).
- Envia `credentials: "include"` (cookies HttpOnly). O **Bearer** é aplicado no
  servidor pelo BFF (`src/lib/api/backend.ts`), mantendo o JWT fora do JS do
  cliente (proteção XSS) — o backend continua recebendo `Authorization: Bearer`.
- **401:** intercepta, tenta `refreshAccessToken()` (single-flight) uma vez e
  refaz a request; se falhar, faz logout seguro.
- **Erros:** converte `ApiErrorResponse` em `ApiError` (`status`, `code`,
  `details`, `requestId`). `getErrorMessage()` normaliza a mensagem para a UI.
- Em desenvolvimento, loga erros de API (`console.error`).

### 6.2. Services — `src/services/*.service.ts`

Pontos de entrada estáveis que delegam às implementações por feature:

| Service público                                          | Implementação canônica            | Métodos                                                                           |
| -------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------- |
| `src/services/auth.service.ts`                           | `src/features/auth/services`      | `login`, `getMe`, `logout`                                                        |
| `src/services/tickets.service.ts`                        | `src/features/tickets/services`   | `list`, `getById`, `create`, `updateStatus`, `assign`, `getSummary`, `getMetrics` |
| `src/services/analytics.service.ts` (`analyticsService`) | `src/features/dashboard/services` | `getOverview`                                                                     |

Os services leem a resposta com `unwrap()` (envelope universal — §3).

### 6.3. Hooks (React Query) — `src/hooks/*`

| Hook público                                | Alias / origem                       | Uso                           |
| ------------------------------------------- | ------------------------------------ | ----------------------------- |
| `useAuth`, `useLogin`, `useMe`              | `src/features/auth/hooks`            | sessão, login, `GET /auth/me` |
| `useTickets`, `ticketsKeys`                 | `src/features/tickets/hooks`         | lista paginada de tickets     |
| `useTicketDetails` (`useTicket`)            | `src/hooks/use-ticket-details.ts`    | detalhe de um ticket          |
| `useDashboardSummary` (`useDashboardStats`) | `src/hooks/use-dashboard-summary.ts` | resumo do dashboard           |

### 6.4. Provider — `src/providers/query-provider.tsx`

`QueryProvider` instancia um único `QueryClient` por sessão de cliente e está
conectado em `src/app/layout.tsx`, envolvendo o `AuthProvider`.

### 6.5. Como testar a integração inicial

1. Configure o `.env.local` (§1) com `NEXT_PUBLIC_API_URL`.
2. Suba o app: `pnpm dev` e acesse `http://localhost:3000`.
3. **Login:** use as credenciais do seed do backend (tenant `demo`):

   | Papel | E-mail                       | Senha             |
   | ----- | ---------------------------- | ----------------- |
   | Admin | `admin.demo@supportflow.com` | `DemoSupport123!` |
   | Agent | `agent.demo@supportflow.com` | `DemoSupport123!` |

   > Senha padrão do seed (`DEFAULT_DEMO_PASSWORD`); pode variar se o backend
   > definir `SEED_DEMO_PASSWORD`/`SEED_DEMO_ADMIN_PASSWORD`.

4. Após o login, o `AuthProvider` chama `GET /auth/me` e hidrata a sessão.
5. **Listagem de tickets:** acesse `/tickets`. O seed cria 6 chamados de exemplo
   (protocolos `DEMO-SF-*`) em vários status/prioridades.
6. Para depurar contratos: o `api-client` loga erros no console em dev e
   `ApiError` expõe `status`/`code`/`requestId` para correlação com o backend.

### 6.6. Rotas que dependem de autenticação

- **Públicas:** `/auth/login`, `/auth/refresh`, `/auth/logout`, `/health/*`.
- **Exigem `Bearer`:** todo o restante — `GET /auth/me`, `/tickets*`,
  `/analytics/*`, `/users*`, `/customers*` etc. No frontend, o BFF injeta o
  Bearer a partir do cookie HttpOnly; rotas de página são protegidas no servidor
  por `src/proxy.ts`.

---

## 7. Lacunas encontradas no backend (e decisões)

| ID  | Lacuna                                                                                             | Impacto / Decisão no frontend                                                                                                                                                                                                                  |
| --- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | `POST /auth/login` retorna **apenas tokens** (`TokenPairResponse`), **sem `user`**.                | ✅ Resolvido: o backend expõe **`GET /auth/me`** (confirmado no código: `auth.routes.ts` + mapper `toAuthUser`). O frontend hidrata a sessão via BFF `/api/auth/me`. Contrato: `AuthUser` (`id,name,email,role,tenantId,createdAt,updatedAt`). |
| G2  | Swagger sugere endpoints "crus" (sem envelope) para alguns recursos.                               | ✅ Não procede no código: o backend **sempre** envelopa via `sendSuccess`/`sendPaginatedSuccess`. O Swagger apenas documenta o `data`. Frontend usa `unwrap()` (tolerante a ambos os formatos).                                                |
| G3  | `/auth/refresh` e `/auth/logout` exigem `refreshToken` **no body**, não em cookie.                 | O BFF lê o cookie HttpOnly e reenvia no body. OK no frontend.                                                                                                                                                                                  |
| G4  | Não há CRUD de **empresas/tenants**; multi-tenant só via `tenantId`.                               | Não modelar "empresas" no frontend até existir contrato.                                                                                                                                                                                       |
| G5  | `AssignTicketRequest` tem `agentId` + alias legado `assignedToId` (deprecated).                    | Usar somente `agentId`.                                                                                                                                                                                                                        |
| G6  | `GET /tickets` aceita `assignedTo` **e** `assignedToId`; `team` é enum (`AGENT/SUPERVISOR/ADMIN`). | `ListTicketsParams` expõe ambos; preferir `assignedToId`.                                                                                                                                                                                      |

---

## 8. Próximos passos recomendados

1. Implementar a **tela de detalhe do ticket** (`/tickets/{id}`) consumindo
   `useTicketDetails` + mutations (`useUpdateTicketStatus`, `useAssignTicket`).
2. Enriquecer o **dashboard** com os demais endpoints de analytics
   (`/analytics/tickets-by-status`, `/tickets-by-priority`, `/sla`,
   `/agents-performance`, `/csat`).
3. Introduzir **RBAC visual** usando `UserRole` (esconder/desabilitar ações).
4. Resolver nomes legíveis para `customerId`/`assignedToId` (consumir
   `/customers` e `/users` para exibir nomes em vez de UUIDs).
5. Adicionar **testes** dos services/hooks contra os contratos do backend.
