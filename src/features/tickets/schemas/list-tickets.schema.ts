import type { ListTicketsParams } from "../types";

export const DEFAULT_LIST_TICKETS_PARAMS: ListTicketsParams = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};
