/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
