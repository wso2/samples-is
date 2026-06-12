"use client";

import Link from "next/link";
import { useAuth } from "./lib/auth/client";

export default function HeroCtaSection() {
  const { isSignedIn, signIn } = useAuth();

  return (
    <div className="hero-actions">
      {isSignedIn ? (
        <Link className="button button-primary" href="/dashboard">
          Go to dashboard
        </Link>
      ) : (
        <>
          <Link className="button button-primary" href="/onboarding">
            Create workspace
          </Link>
          <button className="button button-secondary" onClick={() => signIn()} type="button">
            Sign in
          </button>
        </>
      )}
    </div>
  );
}
