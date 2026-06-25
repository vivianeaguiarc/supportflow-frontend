import { useQuery } from "@tanstack/react-query";

import { usersService } from "../services/users-service";
import { usersKeys } from "./users-keys";

/** `GET /users/{id}` — detalhe de um usuário (RBAC validado no backend). */
export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersService.getById(id),
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}
