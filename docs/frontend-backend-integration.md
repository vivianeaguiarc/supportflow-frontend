# Integração Frontend ↔ Backend — SupportFlow

> **Fonte da verdade:** OpenAPI/Swagger do `supportflow-backend`
> (`SupportFlow API v1.0`). Nenhum endpoint, DTO ou campo neste documento foi
> inventado: tudo deriva do schema publicado. Pontos incertos estão marcados
> como **PENDENTE DE CONFIRMAÇÃO**.

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

| Método | Path            | Body                  | Resposta (200/201)                          |
| ------ | --------------- | --------------------- | ------------------------------------------- |
| POST   | `/auth/login`   | `{ email, password }` | `TokenPairResponse` (**cru, sem envelope**) |
| POST   | `/auth/refresh` | `{ refreshToken }`    | `TokenPairResponse` (**cru, sem envelope**) |
| POST   | `/auth/logout`  | `{ refreshToken }`    | `{ message: string }`                       |

```ts
interface TokenPairResponse {
  accessToken: string; // JWT — usar em Authorization: Bearer
  refreshToken: string; // JWT — renovação de sessão
}
```

Status de erro de auth: `400` (payload inválido), `401` (credenciais/refresh
inválidos ou expirados).

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

⚠️ **Inconsistência relevante:** o backend **não padroniza o envelope**. De ~51
operações, ~26 usam envelope e ~25 retornam o recurso "cru". O frontend lida com
ambos via type guards e o helper `unwrap` (`src/lib/api-response.ts`).

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

### 3.4. Endpoints COM envelope vs. SEM envelope (principais)

| Com envelope                        | Sem envelope (cru)                       |
| ----------------------------------- | ---------------------------------------- |
| `GET /tickets` (paginado)           | `GET /tickets/{id}` → `Ticket`           |
| `GET /users` (paginado)             | `POST /tickets` → `Ticket`               |
| `GET /customers` (paginado)         | `GET /tickets/summary` → `TicketSummary` |
| `GET /analytics/overview`           | `POST /auth/login` → `TokenPairResponse` |
| `GET /tickets/sla`, `/sla/breached` | `GET /users/{id}`, `POST /users`         |

---

## 4. Endpoints de domínio

### 4.1. Tickets / Chamados

| Método | Path                   | Body / Params               | Resposta                       |
| ------ | ---------------------- | --------------------------- | ------------------------------ |
| GET    | `/tickets`             | query params (ver abaixo)   | `ApiPaginatedResponse<Ticket>` |
| POST   | `/tickets`             | `CreateTicketRequest`       | `Ticket` (cru)                 |
| GET    | `/tickets/{id}`        | —                           | `Ticket` (cru)                 |
| GET    | `/tickets/summary`     | —                           | `TicketSummary` (cru)          |
| GET    | `/tickets/metrics`     | —                           | `TicketMetrics` (cru)          |
| PATCH  | `/tickets/{id}/status` | `UpdateTicketStatusRequest` | `Ticket` (cru)                 |
| PATCH  | `/tickets/{id}/assign` | `AssignTicketRequest`       | `Ticket` (cru)                 |

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
```

### 4.2. Dashboard / Analytics

| Método | Path                  | Resposta                                |
| ------ | --------------------- | --------------------------------------- |
| GET    | `/analytics/overview` | `ApiSuccessResponse<AnalyticsOverview>` |

Já integrado via BFF `GET /api/dashboard/overview` →
`src/features/dashboard`. Existem ainda `/analytics/tickets-by-status`,
`/tickets-by-priority`, `/sla`, `/agents-performance`, `/csat` (não consumidos
ainda).

### 4.3. Usuários / Clientes / Empresas

| Método | Path          | Body / Params                                                    | Resposta                               |
| ------ | ------------- | ---------------------------------------------------------------- | -------------------------------------- |
| GET    | `/users`      | page, limit, sortBy, sortOrder, search, role, createdFrom/To     | `ApiPaginatedResponse<User>`           |
| POST   | `/users`      | `CreateUserRequest`                                              | `User` (cru, 201) — exige role ≥ ADMIN |
| GET    | `/users/{id}` | —                                                                | `User` (cru)                           |
| GET    | `/customers`  | page, limit, sortBy, sortOrder, search, isActive, createdFrom/To | `ApiPaginatedResponse<Customer>`       |

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

## 6. Como o client HTTP consome a API

`src/services/http-client.ts`:

- Usa `NEXT_PUBLIC_API_URL` (via `config.apiUrl`); opção `local: true` para
  chamar Route Handlers do BFF.
- Envia `credentials: "include"` (cookies HttpOnly). O **Bearer** é aplicado no
  servidor pelo BFF (`src/lib/api/backend.ts`), compatível com o backend.
- Trata erro de forma centralizada: converte `ApiErrorResponse` em `ApiError`
  (com `status`, `code`, `details`, `requestId`).
- `getErrorMessage()` normaliza a mensagem para a UI (mapa por `code`).
- Em desenvolvimento, loga erros de API (`console.error`) — não esconde falhas.
- Intercepta `401`, tenta refresh single-flight e refaz a request.

Por causa do envelope inconsistente (§3), serviços devem usar `unwrap()` ou os
type guards ao ler a resposta, em vez de assumir `data` sempre presente.

---

## 7. Lacunas encontradas no backend (e decisões)

| ID  | Lacuna                                                                                             | Impacto / Decisão no frontend                                                                                                                                                                                                                                                                |
| --- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G1  | `POST /auth/login` retorna **apenas tokens** (`TokenPairResponse`), **sem `user`**.                | Resolvido no frontend consumindo **`GET /auth/me`** (via BFF `/api/auth/me`) para hidratar o usuário. **PENDENTE DE CONFIRMAÇÃO:** `GET /auth/me` ainda **não consta no Swagger publicado** — a hidratação só funcionará após o backend expor o endpoint. Contrato assumido = schema `User`. |
| G2  | **Envelope de resposta inconsistente** (alguns endpoints com `ApiSuccessResponse`, outros crus).   | Frontend usa `unwrap()` + type guards. **Sugestão ao backend:** padronizar todos os endpoints com envelope.                                                                                                                                                                                  |
| G3  | `/auth/refresh` e `/auth/logout` exigem `refreshToken` **no body**, não em cookie.                 | O BFF lê o cookie HttpOnly e reenvia no body. OK no frontend.                                                                                                                                                                                                                                |
| G4  | Não há CRUD de **empresas/tenants**; multi-tenant só via `tenantId`.                               | Não modelar "empresas" no frontend até existir contrato.                                                                                                                                                                                                                                     |
| G5  | `AssignTicketRequest` tem `agentId` + alias legado `assignedToId` (deprecated).                    | Usar somente `agentId`.                                                                                                                                                                                                                                                                      |
| G6  | `GET /tickets` aceita `assignedTo` **e** `assignedToId`; `team` é enum (`AGENT/SUPERVISOR/ADMIN`). | `ListTicketsParams` expõe ambos; preferir `assignedToId`.                                                                                                                                                                                                                                    |

---

## 8. Próximos passos recomendados

1. **Resolver G1**: o backend precisa publicar/expor `GET /auth/me` no Swagger;
   o frontend já está integrado e passará a hidratar a sessão automaticamente.
2. Implementar a **camada de services de tickets** (`tickets-service`) sobre
   estes contratos, usando `unwrap()` para os endpoints crus.
3. Implementar a **tela real de tickets** (lista paginada + filtros) e o
   **dashboard real** consumindo os contratos já mapeados.
4. Introduzir **RBAC visual** usando `UserRole`.
5. Pedir ao backend a **padronização do envelope** (G2).
