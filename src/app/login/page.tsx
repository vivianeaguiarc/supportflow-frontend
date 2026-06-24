import type { Metadata } from "next";

import { GuestGuard, LoginForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <GuestGuard>
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <LoginForm />
      </div>
    </GuestGuard>
  );
}
