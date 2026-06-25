/**
 * Design System do SupportFlow — ponto único de importação dos componentes
 * genéricos (sem domínio). Ex.: `import { PageHeader, CardStat } from "@/components/ui"`.
 *
 * Os primitivos (Button, Card, Input, etc.) continuam disponíveis em seus
 * arquivos próprios; aqui expomos a camada de composição do DS + tokens.
 */

export { CardStat } from "./card-stat";
export { Checkbox } from "./checkbox";
export * from "./constants";
export { DataField } from "./data-field";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
export { EmptyState } from "./empty-state";
export { ErrorState } from "./error-state";
export { FilterSelect, type FilterSelectOption } from "./filter-select";
export { LoadingState } from "./loading-state";
export { PageContainer } from "./page-container";
export { PageHeader } from "./page-header";
export { PageSection } from "./page-section";
export { PageTitle } from "./page-title";
export { Pagination } from "./pagination";
export { PriorityBadge } from "./priority-badge";
export { SearchInput } from "./search-input";
export { StatusBadge } from "./status-badge";
export { Textarea } from "./textarea";
export { Timeline, TimelineItem } from "./timeline";
export { UserAvatar } from "./user-avatar";
