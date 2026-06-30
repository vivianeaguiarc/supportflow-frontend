# SupportFlow Design System

Codinome: **Clarity & Care** — identidade visual para plataforma de atendimento B2B, distinta de sistemas financeiros/ERP.

## Filosofia visual

- **Clareza operacional**: hierarquia legível, densidade moderada, foco em filas e ações.
- **Confiança acolhedora**: teal como cor de ação (comunicação, suporte), não o azul corporativo genérico.
- **Colaboração**: accent periwinkle para seleções e destaques secundários.
- **Semântica consistente**: success, warning, error e info sempre derivados de tokens — nunca cores soltas no código.

## Tipografia

| Papel          | Fonte                                        |
| -------------- | -------------------------------------------- |
| Sans / Heading | **Mulish** (`--font-sans`, `--font-heading`) |
| Mono           | Geist Mono (`--font-geist-mono`)             |

Pesos: 400 (corpo), 500 (médio), 600 (títulos). Títulos usam `tracking-tight` (-0.02em).

## Paleta de cores

| Token                  | Papel                         | Light (referência)              |
| ---------------------- | ----------------------------- | ------------------------------- |
| `--primary`            | Ação principal, links, botões | Teal ~ `#0D9488`                |
| `--primary-hover`      | Hover de ação                 | Teal escuro                     |
| `--secondary`          | Superfícies secundárias       | Cinza-teal suave                |
| `--accent`             | Colaboração / seleção         | Periwinkle suave                |
| `--success`            | Resolvido, no prazo           | Verde-teal                      |
| `--warning`            | Alerta, aguardando            | Âmbar                           |
| `--destructive`        | Erro, SLA violado             | Coral (não vermelho financeiro) |
| `--info`               | Informativo, aberto           | Ciano-sky                       |
| `--background`         | Fundo da página               | Branco com matiz teal           |
| `--surface` / `--card` | Cards e painéis               | Branco puro                     |
| `--border`             | Divisores                     | Cinza-teal claro                |
| `--sidebar`            | Navegação lateral             | Branco levemente distinto       |
| `--sidebar-accent`     | Item ativo / hover            | Teal muito claro                |
| `--ring`               | Focus ring                    | Primary                         |
| `--hover`              | Superfície de hover genérica  | Cinza-teal                      |

Modo escuro: mesmos papéis com luminosidade ajustada (teal mais claro como primary).

## Espaçamento

Escala base Tailwind (4px). Tokens semânticos em `spacing.css`:

- `--space-page-x/y`: padding de página (1.5rem)
- `--space-section`: gap entre seções (1.5rem)
- `--space-stack-*` / `--space-inline-*`: stacks e inline recorrentes

## Border radius

- Base: `--radius: 0.625rem` (10px)
- Derivados: `sm`, `md`, `lg`, `xl` via `@theme inline`

## Elevações

| Token                                 | Uso                    |
| ------------------------------------- | ---------------------- |
| `--shadow-xs`                         | Micro-elevação         |
| `--shadow-sm` / `--shadow-card`       | Cards em repouso       |
| `--shadow-md` / `--shadow-card-hover` | Cards em hover         |
| `--shadow-lg`                         | Modais, popovers       |
| `--shadow-focus`                      | Anel de foco acessível |

## Estados (utilitários)

Definidos em `src/styles/tokens/semantic.css`:

- **Tons**: `.tone-info`, `.tone-success`, `.tone-warning`, `.tone-danger`, `.tone-primary`, `.tone-accent`, `.tone-muted`, `.tone-neutral`
- **Indicadores**: `.stat-chip-*` (CardStat)
- **SLA**: `.sla-chip-breached`, `.sla-chip-warning`, `.sla-chip-ok`, `.sla-chip-none`
- **Callouts**: `.callout-warning`

## Organização dos arquivos

```
src/styles/tokens/
  colors.css      — variáveis de cor (:root + .dark)
  typography.css  — pesos, tracking, escala
  spacing.css     — espaçamentos semânticos
  shadows.css     — elevações
  radii.css       — border radius
  layout.css      — shell, sidebar, topbar, densidade
  semantic.css    — classes utilitárias
  index.css       — barrel CSS

src/lib/theme/
  tokens.ts       — espelho TypeScript + mapeamentos
  layout.ts       — navegação agrupada, variantes de layout
  index.ts        — export público

src/styles/globals.css — importa tokens + @theme Tailwind
```

## Uso em componentes

```tsx
import { STAT_ACCENT_CLASSES, TONE_CLASSES } from "@/lib/theme";

// Badge semântico
<span className={TONE_CLASSES.success}>No prazo</span>

// CardStat
<CardStat accent="primary" ... />
```

Evite classes Tailwind de cor literal (`bg-blue-500`, `text-red-700`). Prefira tokens (`bg-primary`, `text-warning`) ou utilitários semânticos (`.tone-*`).

## Layout & navegação

### Variantes de shell (`AppShell`)

| Variante      | Uso                          | Densidade                      |
| ------------- | ---------------------------- | ------------------------------ |
| `standard`    | Dashboard, tickets, clientes | confortável (`p-6`)            |
| `operational` | Mesa de Atendimento          | compacta (`p-4`) + topbar teal |
| `admin`       | Configurações, auditoria     | espaçosa (`p-6 md:p-8`)        |

### Sidebar

Navegação agrupada em **Operação** e **Administração** (`NAV_GROUPS` em `layout.ts`). Itens filtrados por RBAC; grupos vazios são ocultados.

### Topbar

Exibe área + rótulo da rota atual (`resolveRouteContext`) e centraliza notificações.

### Densidade de página

- `PageContainer` → prop `density`: `compact` | `comfortable` | `spacious`
- `PageHeader` → prop `variant`: `operational` (barra teal) | `admin` (borda inferior)
- `PageSection` → prop `density`: `compact` | `comfortable`

### Empty states

`EmptyState` com ícone em círculo tokenizado, moldura tracejada (`framed`) e tons `muted` | `primary` | `destructive`.

## Compatibilidade

- **Tailwind CSS v4**: tokens expostos via `@theme inline` em `globals.css`
- **shadcn/ui**: variáveis `--primary`, `--destructive`, `--sidebar-*` mapeadas ao contrato shadcn
- **next-themes**: `:root` + `.dark` para light/dark
