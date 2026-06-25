import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface UserAvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "default" | "lg";
  className?: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";

  const first = parts[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1] ?? "") : "";
  const initials = (first.charAt(0) + last.charAt(0)).trim();

  return (initials || first.slice(0, 2) || "?").toUpperCase();
}

/** Avatar de usuário com imagem opcional e fallback de iniciais. */
export function UserAvatar({
  name,
  src,
  size = "default",
  className,
}: UserAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
