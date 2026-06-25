import { Lock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TONE_BADGE_CLASSES } from "@/components/ui/constants";
import { cn } from "@/lib/utils";

import type { CommentVisibility } from "../types";
import { COMMENT_VISIBILITY_META } from "../types";

interface CommentVisibilityBadgeProps {
  visibility: CommentVisibility;
  className?: string;
}

/**
 * Badge de visibilidade de um comentário, dirigido por `COMMENT_VISIBILITY_META`
 * (espelho do enum real `CommentVisibility`). Hoje o backend só expõe `INTERNAL`,
 * representado com cadeado — mas o componente já cobre futuras visibilidades.
 */
export function CommentVisibilityBadge({
  visibility,
  className,
}: CommentVisibilityBadgeProps) {
  const meta = COMMENT_VISIBILITY_META[visibility];
  if (!meta) return null;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1", TONE_BADGE_CLASSES[meta.tone], className)}
    >
      {visibility === "INTERNAL" ? (
        <Lock className="size-3" aria-hidden />
      ) : null}
      {meta.label}
    </Badge>
  );
}
