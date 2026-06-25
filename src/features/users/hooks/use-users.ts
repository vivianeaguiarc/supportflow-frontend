import { useQuery } from "@tanstack/react-query";

import type { ListUsersParams } from "@/types/user";

import { usersService } from "../services/users-service";
import { usersKeys } from "./users-keys";

interface UseUsersOptions {
  /** Permite desativar a query quando o usuário não pode listar (`USERS_MANAGE`). */
  enabled?: boolean;
}

/** `GET /users` — listagem paginada de usuários (RBAC validado no backend). */
export function useUsers(
  params: ListUsersParams = {},
  options: UseUsersOptions = {},
) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersService.list(params),
    enabled: options.enabled ?? true,
    staleTime: 60_000,
  });
}
