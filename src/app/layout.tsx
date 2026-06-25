import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist_Mono, Mulish } from "next/font/google";
import { Toaster } from "sonner";

import { AuthProvider } from "@/features/auth/contexts";
import { QueryProvider } from "@/providers/query-provider";

const mulish = Mulish({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SupportFlow",
    template: "%s | SupportFlow",
  },
  description: "Plataforma de atendimento ao cliente, SAC e ouvidoria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${mulish.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
