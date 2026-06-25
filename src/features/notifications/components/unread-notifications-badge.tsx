import { cn } from "@/lib/utils";

interface UnreadNotificationsBadgeProps {
  count: number;
  className?: string;
}

/**
 * Badge numérico de notificações não lidas. Não renderiza nada quando `count`
 * é 0 e satura em "9+" para manter o tamanho estável no sino do header.
 */
export function UnreadNotificationsBadge({
  count,
  className,
}: UnreadNotificationsBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      aria-hidden
      className={cn(
        "flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold leading-4 text-primary-foreground",
        className,
      )}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}
