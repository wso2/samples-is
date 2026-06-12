"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import LoadingScreen from "../../LoadingScreen";
import { useAuth } from "../auth/client";

export interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  textPrimaryColor: string;
  fontFamily: string;
  fontImportUrl: string;
  logoUrl: string;
  faviconUrl: string;
  displayName: string;
  supportEmail: string;
}

interface BrandingState {
  branding: BrandingConfig | null;
  brandingResolved: boolean;
}

const BrandingContext = createContext<BrandingState>({ branding: null, brandingResolved: false });

function hexToRgb(hex: string): [number, number, number] {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}

function hexToSoft(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, 0.12)`;
}

function hexToDark(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const toHex = (n: number) => Math.round(n * 0.62).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToSidebar(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const toHex = (n: number) => Math.max(Math.round(n * 0.12), 0).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function BrandingProvider({ children }: { children: ReactNode }) {
  const { accessToken, isSignedIn } = useAuth();
  const pathname = usePathname();
  const [branding, setBranding] = useState<BrandingConfig | null>(null);
  const [brandingResolved, setBrandingResolved] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !accessToken) {
      setBrandingResolved(true);
      return;
    }

    setBrandingResolved(false);
    fetch("/api/organization/branding", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data: { branding?: BrandingConfig | null }) => {
        setBranding(data.branding ?? null);
      })
      .catch(() => {})
      .finally(() => {
        setBrandingResolved(true);
      });
  }, [isSignedIn, accessToken]);

  useEffect(() => {
    if (!branding) return;

    const root = document.documentElement;
    const [pr, pg, pb] = hexToRgb(branding.primaryColor);
    const [ar, ag, ab] = hexToRgb(branding.secondaryColor);

    // Global vars (used by public shell, loading screens, misc elements)
    root.style.setProperty("--primary-rgb", `${pr}, ${pg}, ${pb}`);
    root.style.setProperty("--primary", branding.primaryColor);
    root.style.setProperty("--primary-strong", hexToDark(branding.primaryColor));
    root.style.setProperty("--primary-ring", `rgba(${pr}, ${pg}, ${pb}, 0.14)`);
    root.style.setProperty("--panel-soft", `rgba(${pr}, ${pg}, ${pb}, 0.1)`);
    root.style.setProperty("--accent", branding.secondaryColor);
    root.style.setProperty("--accent-soft", `rgba(${ar}, ${ag}, ${ab}, 0.18)`);
    root.style.setProperty("--accent-shadow", `rgba(${ar}, ${ag}, ${ab}, 0.3)`);
    root.style.setProperty("--foreground", branding.textPrimaryColor);

    // App-shell vars (used by .app-shell / .member-shell — all authenticated UI)
    root.style.setProperty("--app-primary", branding.primaryColor);
    root.style.setProperty("--app-primary-soft", hexToSoft(branding.primaryColor));
    root.style.setProperty("--app-primary-soft-border", `rgba(${pr}, ${pg}, ${pb}, 0.3)`);
    root.style.setProperty("--app-sidebar", hexToSidebar(branding.primaryColor));
    root.style.setProperty("--navy", hexToSidebar(branding.primaryColor));

    if (branding.fontImportUrl) {
      const styleId = "branding-font-import";
      let el = document.getElementById(styleId) as HTMLStyleElement | null;
      if (!el) {
        el = document.createElement("style");
        el.id = styleId;
        document.head.appendChild(el);
      }
      el.textContent = `@import url('${branding.fontImportUrl}');`;
    }

    if (branding.fontFamily) {
      document.body.style.fontFamily = `${branding.fontFamily}, Inter, sans-serif`;
    }

    if (branding.faviconUrl) {
      const link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (link) link.href = branding.faviconUrl;
    }

    if (branding.displayName) {
      document.title = branding.displayName;
    }
  }, [branding, pathname]);

  return (
    <BrandingContext.Provider value={{ branding, brandingResolved }}>
      {brandingResolved ? children : <LoadingScreen steps={[]} title="Loading your workspace…" />}
    </BrandingContext.Provider>
  );
}

export function useBranding(): BrandingState {
  return useContext(BrandingContext);
}
