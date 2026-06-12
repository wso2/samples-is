import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { AuthProvider } from "./lib/auth/client";
import { BrandingProvider } from "./lib/branding/BrandingProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "Wayfinder",
  description: "Wayfinder helps agencies, finance teams, and client administrators manage corporate travel programs, policies, and spend across multiple workspaces.",
  icons: {
    icon: "/wayfinder-logo.png",
    apple: "/wayfinder-logo.png"
  }
};

export const viewport: Viewport = {
  themeColor: "#2563eb"
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const url = headersList.get("x-url") ?? "/";
  const urlParams = new URLSearchParams(url.split("?")[1] ?? "");
  const hasCode = urlParams.has("code");
  const hasOrgId = urlParams.has("orgId");
  const hasSubjectToken = urlParams.has("subject_token") && urlParams.get("state") === "impersonating";

  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider initialIsExchanging={hasCode || hasOrgId || hasSubjectToken}>
          <BrandingProvider>
            {children}
          </BrandingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
