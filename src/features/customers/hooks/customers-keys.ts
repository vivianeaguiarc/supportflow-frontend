import type { ListCustomersParams } from "../types";

/** Query keys centralizadas da feature de clientes. */
export const customersKeys = {
  all: ["customers"] as const,
  lists: () => [...customersKeys.all, "list"] as const,
  list: (filters: ListCustomersParams) =>
    [...customersKeys.all, "list", filters] as const,
};
