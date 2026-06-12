"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import LoadingScreen from "../../LoadingScreen";
import { buildUserFromTokens, type AppUser } from "./utils";

interface SignInOptions {
  fidp?: string;
  org?: string;
  orgId?: string;
}

const enhancedOrgAuthEnabled =
  (process.env.NEXT_PUBLIC_ENHANCED_ORGANIZATION_AUTHENTICATION ?? "").toLowerCase() === "true";

interface AuthState {
  isLoading: boolean;
  isSignedIn: boolean;
  accessToken: string | null;
  idToken: string | null;
  user: AppUser | null;
  isImpersonating: boolean;
  impersonatedUserName: string | null;
  signIn: (options?: SignInOptions) => void;
  signOut: () => void;
  switchOrganization: (org: { name?: string; orgId?: string }) => void;
  startImpersonation: (userId: string, userName: string) => void;
  stopImpersonation: () => void;
}

const AuthContext = createContext<AuthState>({
  isLoading: true,
  isSignedIn: false,
  accessToken: null,
  idToken: null,
  user: null,
  isImpersonating: false,
  impersonatedUserName: null,
  signIn: () => {},
  signOut: () => {},
  switchOrganization: () => {},
  startImpersonation: () => {},
  stopImpersonation: () => {},
});

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getTokenExpiryMs(token: string): number | null {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return null;
  return payload.exp * 1000 - Date.now();
}

function isTokenExpired(token: string): boolean {
  const ttl = getTokenExpiryMs(token);
  return ttl === null || ttl <= 0;
}

function buildAuthorizeUrl(options?: SignInOptions): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID ?? "";
  const scopes = process.env.NEXT_PUBLIC_SCOPES ?? "openid";
  const redirectUri = process.env.NEXT_PUBLIC_AFTER_SIGN_IN_URL ?? window.location.origin;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes
  });

  if (options?.fidp && !enhancedOrgAuthEnabled) {
    params.set("fidp", options.fidp);
  }

  if (options?.org) {
    params.set("org", options.org);
  }

  if (options?.orgId) {
    params.set("orgId", options.orgId);
  }

  return `${baseUrl}/oauth2/authorize?${params.toString()}`;
}

function buildImpersonateAuthorizeUrl(userId: string, orgId?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID ?? "";
  const redirectUri = process.env.NEXT_PUBLIC_AFTER_SIGN_IN_URL ?? window.location.origin;
  const configuredScopes = process.env.NEXT_PUBLIC_SCOPES ?? "openid";
  const nonce = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

  const scopeSet = new Set(["internal_org_user_impersonate", ...configuredScopes.split(" ").filter(Boolean)]);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "id_token subject_token",
    scope: [...scopeSet].join(" "),
    requested_subject: userId,
    state: "impersonating",
    nonce,
    orgId: orgId ?? "",
  });

  if (!enhancedOrgAuthEnabled) {
    params.set("fidp", "OrganizationSSO");
  }

  return `${baseUrl}/oauth2/authorize?${params.toString()}`;
}

export function AuthProvider({ children, initialIsExchanging = false }: { children: ReactNode; initialIsExchanging?: boolean }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [impersonationToken, setImpersonationToken] = useState<string | null>(null);
  const [impersonatedUserName, setImpersonatedUserName] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [isExchanging, setIsExchanging] = useState(initialIsExchanging);
  const [exchangeError, setExchangeError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isOrgRedirecting, setIsOrgRedirecting] = useState(false);
  const [isStartingImpersonation, setIsStartingImpersonation] = useState(false);
  const [impersonationError, setImpersonationError] = useState<string | null>(null);
  const exchangingRef = useRef(false);
  const expiryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearExpiredSession = useCallback(() => {
    const storedIdToken = localStorage.getItem("id_token");
    const storedAccessToken = localStorage.getItem("access_token");
    const payload = decodeJwtPayload(storedIdToken ?? storedAccessToken ?? "");
    const orgId = typeof payload?.org_id === "string" ? payload.org_id : null;

    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("impersonation_token");
    localStorage.removeItem("wayfinder.impersonating_name");
    setAccessToken(null);
    setIdToken(null);
    setImpersonationToken(null);
    setImpersonatedUserName(null);

    if (orgId) {
      const afterSignInUrl = process.env.NEXT_PUBLIC_AFTER_SIGN_IN_URL ?? window.location.origin;
      const redirectUrl = new URL(afterSignInUrl);
      redirectUrl.searchParams.set("orgId", orgId);
      window.location.replace(redirectUrl.toString());
    }
  }, []);

  const scheduleExpiryCheck = useCallback((token: string) => {
    if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
    const ttl = getTokenExpiryMs(token);
    if (ttl !== null && ttl > 0) {
      expiryTimerRef.current = setTimeout(clearExpiredSession, ttl);
    }
  }, [clearExpiredSession]);

  useEffect(() => {
    return () => {
      if (expiryTimerRef.current) clearTimeout(expiryTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const storedAccess = localStorage.getItem("access_token");
    const storedId = localStorage.getItem("id_token");
    const storedImpersonation = localStorage.getItem("impersonation_token");
    const storedImpersonatedName = localStorage.getItem("wayfinder.impersonating_name");

    if (storedAccess && !isTokenExpired(storedAccess)) {
      setAccessToken(storedAccess);
      if (storedId) setIdToken(storedId);
      scheduleExpiryCheck(storedAccess);

      if (storedImpersonation && !isTokenExpired(storedImpersonation)) {
        setImpersonationToken(storedImpersonation);
        setImpersonatedUserName(storedImpersonatedName);
      } else if (storedImpersonation) {
        localStorage.removeItem("impersonation_token");
        localStorage.removeItem("wayfinder.impersonating_name");
      }
    } else if (storedAccess) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("id_token");
      localStorage.removeItem("impersonation_token");
      localStorage.removeItem("wayfinder.impersonating_name");
    }
    setInitialized(true);
  }, [scheduleExpiryCheck]);

  const storeToken = useCallback((access: string, id?: string) => {
    localStorage.setItem("access_token", access);
    setAccessToken(access);
    scheduleExpiryCheck(access);

    if (id) {
      localStorage.setItem("id_token", id);
      setIdToken(id);
    }
  }, [scheduleExpiryCheck]);

  // Handle authorization code callback (regular sign-in)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code || exchangingRef.current) {
      return;
    }

    setIsExchanging(true);
    exchangingRef.current = true;

    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    url.searchParams.delete("session_state");
    window.history.replaceState({}, "", url.toString());

    fetch("/api/auth/token", {
      body: JSON.stringify({ code }),
      headers: { "Content-Type": "application/json" },
      method: "POST"
    })
      .then((res) => res.json())
      .then((data: { access_token?: string; id_token?: string; error?: string }) => {
        if (data.access_token) {
          storeToken(data.access_token, data.id_token);
          setIsExchanging(false);
        } else {
          setExchangeError(data.error ?? "Authentication failed. Please try again.");
        }
      })
      .catch(() => {
        setExchangeError("Authentication failed. Please try again.");
      })
      .finally(() => {
        exchangingRef.current = false;
      });
  }, [storeToken]);

  // Handle impersonation subject_token callback
  useEffect(() => {
    const fragmentParams = new URLSearchParams(window.location.hash.slice(1));

    const subjectToken = fragmentParams.get("subject_token");
    const state = fragmentParams.get("state");

    if (!subjectToken || state !== "impersonating" || exchangingRef.current) {
      return;
    }

    setIsExchanging(true);
    exchangingRef.current = true;

    const callbackIdToken = fragmentParams.get("id_token");

    fragmentParams.delete("subject_token");
    fragmentParams.delete("id_token");
    fragmentParams.delete("session_state");
    fragmentParams.delete("state");
    fragmentParams.delete("nonce");
    const url = new URL(window.location.href);
    const remaining = fragmentParams.toString();
    url.hash = remaining ? `#${remaining}` : "";
    window.history.replaceState({}, "", url.toString());

    const actorToken = callbackIdToken ?? localStorage.getItem("id_token");
    const pendingName = localStorage.getItem("wayfinder.impersonate_pending_name");

    fetch("/api/auth/impersonate", {
      body: JSON.stringify({ subject_token: subjectToken, actor_token: actorToken }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
      .then((res) => res.json())
      .then((data: { access_token?: string; error?: string }) => {
        if (data.access_token) {
          const name = pendingName ?? "Unknown user";
          localStorage.setItem("impersonation_token", data.access_token);
          localStorage.setItem("wayfinder.impersonating_name", name);
          localStorage.removeItem("wayfinder.impersonate_pending_id");
          localStorage.removeItem("wayfinder.impersonate_pending_name");
          setImpersonationToken(data.access_token);
          setImpersonatedUserName(name);
          setIsExchanging(false);
        } else {
          localStorage.removeItem("wayfinder.impersonate_pending_id");
          localStorage.removeItem("wayfinder.impersonate_pending_name");
          setIsExchanging(false);
          setImpersonationError(data.error ?? "Impersonation failed. Please try again.");
        }
      })
      .catch(() => {
        localStorage.removeItem("wayfinder.impersonate_pending_id");
        localStorage.removeItem("wayfinder.impersonate_pending_name");
        setIsExchanging(false);
        setImpersonationError("Impersonation failed. Please try again.");
      })
      .finally(() => {
        exchangingRef.current = false;
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orgId = params.get("orgId");

    if (!orgId) {
      return;
    }

    const storedToken = localStorage.getItem("access_token");
    if (storedToken && !isTokenExpired(storedToken)) {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("orgId");
    window.history.replaceState({}, "", url.toString());

    setIsOrgRedirecting(true);
    window.location.href = buildAuthorizeUrl({ fidp: "OrganizationSSO", orgId });
  }, []);

  const signIn = useCallback((options?: SignInOptions) => {
    setIsSigningIn(true);
    window.location.href = buildAuthorizeUrl(options);
  }, []);

  const signOut = useCallback(() => {
    setIsSigningOut(true);
    const currentIdToken = idToken;
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("impersonation_token");
    localStorage.removeItem("wayfinder.impersonating_name");
    localStorage.removeItem("wayfinder.impersonate_pending_id");
    localStorage.removeItem("wayfinder.impersonate_pending_name");
    setAccessToken(null);
    setIdToken(null);
    setImpersonationToken(null);
    setImpersonatedUserName(null);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID ?? "";
    const redirectUri = process.env.NEXT_PUBLIC_AFTER_SIGN_OUT_URL ?? window.location.origin;

    if (currentIdToken && baseUrl && clientId) {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `${baseUrl}/oidc/logout`;

      const addField = (name: string, value: string) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      addField("client_id", clientId);
      addField("post_logout_redirect_uri", redirectUri);
      addField("id_token_hint", currentIdToken);

      document.body.appendChild(form);
      form.submit();
    } else {
      window.location.assign("/");
    }
  }, [idToken]);

  const switchOrganization = useCallback((org: { name?: string; orgId?: string }) => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("impersonation_token");
    localStorage.removeItem("wayfinder.impersonating_name");
    setAccessToken(null);
    setIdToken(null);
    setImpersonationToken(null);
    setImpersonatedUserName(null);
    window.location.href = buildAuthorizeUrl({ fidp: "OrganizationSSO", org: org.name, orgId: org.orgId });
  }, []);

  const startImpersonation = useCallback((userId: string, userName: string) => {
    const storedIdToken = localStorage.getItem("id_token");
    if (!storedIdToken) {
      console.error("[impersonation] No id_token available to use as actor_token.");
      return;
    }
    const storedAccessToken = localStorage.getItem("access_token");
    const orgId = storedAccessToken
      ? (decodeJwtPayload(storedAccessToken)?.org_id as string | undefined)
      : undefined;
    localStorage.setItem("wayfinder.impersonate_pending_id", userId);
    localStorage.setItem("wayfinder.impersonate_pending_name", userName);
    setIsStartingImpersonation(true);
    window.location.href = buildImpersonateAuthorizeUrl(userId, orgId);
  }, []);

  const stopImpersonation = useCallback(() => {
    localStorage.removeItem("impersonation_token");
    localStorage.removeItem("wayfinder.impersonating_name");
    setImpersonationToken(null);
    setImpersonatedUserName(null);
  }, []);

  // user is always derived from the admin's own tokens, not the impersonation token
  const user = (() => {
    if (!accessToken) return null;
    const accessPayload = decodeJwtPayload(accessToken);
    if (!accessPayload) return null;
    const idPayload = idToken ? (decodeJwtPayload(idToken) ?? {}) : {};
    return buildUserFromTokens(accessPayload, idPayload);
  })();

  return (
    <AuthContext.Provider
      value={{
        // When impersonating, expose impersonation token as accessToken so all API calls use it
        accessToken: impersonationToken ?? accessToken,
        idToken,
        isLoading: !initialized || isExchanging,
        isSignedIn: !!accessToken,
        isImpersonating: !!impersonationToken,
        impersonatedUserName,
        signIn,
        signOut,
        switchOrganization,
        startImpersonation,
        stopImpersonation,
        user
      }}
    >
      {children}
      {(isSigningIn || isOrgRedirecting) && (
        <LoadingScreen
          description="You will be redirected to the identity provider shortly."
          steps={[]}
          title="Redirecting…"
        />
      )}
      {isStartingImpersonation && (
        <LoadingScreen
          description="Please wait while we set up the impersonation session."
          steps={[]}
          title="Starting impersonation…"
        />
      )}
      {impersonationError && (
        <LoadingScreen
          action={{
            label: "Back to users",
            onClick: () => {
              setImpersonationError(null);
              window.location.href = "/organization";
            },
          }}
          error={impersonationError}
          steps={[]}
          title="Impersonation failed"
        />
      )}
      {isSigningOut && (
        <LoadingScreen
          description="Clearing your session with the identity provider."
          steps={[]}
          title="Signing you out…"
        />
      )}
      {(isExchanging || exchangeError) && (
        <LoadingScreen
          description="Please wait while we complete your sign-in."
          error={exchangeError ?? undefined}
          steps={[]}
          title="Signing you in…"
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
