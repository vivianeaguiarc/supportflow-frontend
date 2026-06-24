import type { ReactNode } from "react";

import { AuthGuard } from "@/features/auth/components";

export default function DashboardGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
