import "@/styles/globals.css";

import type { Metadata } from "next";
import { Geist_Mono, Mulish } from "next/font/google";

import { GlobalErrorBoundary, OfflineBanner } from "@/components/feedback";
import { AuthProvider } from "@/features/auth/contexts";
import { NotificationProvider } from "@/lib/notifications";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";

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
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationProvider>
            <QueryProvider>
              <AuthProvider>
                <GlobalErrorBoundary>
                  <OfflineBanner />
                  {children}
                </GlobalErrorBoundary>
              </AuthProvider>
            </QueryProvider>
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
