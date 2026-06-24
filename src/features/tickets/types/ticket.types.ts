export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_CUSTOMER"
  | "ESCALATED"
  | "RESOLVED"
  | "CLOSED";

export type TicketPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface Ticket {
  id: string;
  tenantId: string;
  protocol: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerId: string;
  categoryId: string | null;
  assignedToId: string | null;
  slaDueAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TicketSummary {
  total: number;
  open: number;
  inProgress: number;
  waitingCustomer: number;
  escalated: number;
  resolved: number;
  closed: number;
  overdue: number;
  unassigned: number;
  byStatus: Record<TicketStatus, number>;
  byPriority: Record<TicketPriority, number>;
}

export interface ListTicketsParams {
  page?: number;
  limit?: number;
  status?: TicketStatus;
  priority?: TicketPriority;
  search?: string;
  sortBy?: "createdAt" | "slaDueAt" | "priority";
  sortOrder?: "asc" | "desc";
}
