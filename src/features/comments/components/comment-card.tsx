import { Lock } from "lucide-react";

import { type Tone } from "@/components/ui/constants";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  CommentVisibility,
  TicketCommentWithAuthor,
} from "@/types/comment";

const VISIBILITY_META: Record<
  CommentVisibility,
  { label: string; tone: Tone }
> = {
  INTERNAL: { label: "Interno", tone: "warning" },
};

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function shortenId(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

interface CommentCardProps {
  comment: TicketCommentWithAuthor;
}

/** Cartão de um comentário: autor, data, tipo (visibilidade) e conteúdo. */
export function CommentCard({ comment }: CommentCardProps) {
  const authorName = comment.author?.name ?? shortenId(comment.authorId);
  const visibility = VISIBILITY_META[comment.visibility];

  return (
    <article className="rounded-lg border border-border bg-card p-3">
      <header className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground">
          {authorName}
        </span>
        {visibility ? (
          <StatusBadge tone={visibility.tone} label={visibility.label} />
        ) : null}
        <time
          className="ml-auto text-xs text-muted-foreground"
          dateTime={comment.createdAt}
        >
          {formatDateTime(comment.createdAt)}
        </time>
      </header>

      <p className="mt-2 text-sm leading-6 whitespace-pre-line text-foreground">
        {comment.content}
      </p>

      {comment.author?.email ? (
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Lock className="size-3" aria-hidden />
          {comment.author.email}
        </p>
      ) : null}
    </article>
  );
}
