import Link from "next/link";
import OnboardingForm from "./OnboardingForm";

export default function OnboardingPage() {
  return (
    <main className="onboarding-page">
      <nav className="detail-nav">
        <Link className="brand" href="/">
          <img src="/wayfinder-logo.png" className="brand-logo" alt="Wayfinder" />
          Wayfinder
        </Link>
        <Link className="button button-secondary" href="/">
          Back home
        </Link>
      </nav>

      <section className="onboarding-layout">
        <div className="onboarding-copy">
          <p className="eyebrow">Self-service setup</p>
          <h1>Create your travel workspace.</h1>
          <p>
            Add your profile and company details. Wayfinder will prepare your workspace,
            create your user account, and move you into the new environment.
          </p>
          <div className="onboarding-steps" aria-label="Onboarding steps">
            <span>Profile details</span>
            <span>Company workspace</span>
            <span>User account</span>
            <span>Workspace switch</span>
          </div>
        </div>

        <section className="onboarding-panel" aria-label="Create organization form">
          <div>
            <p className="eyebrow">Get started</p>
            <h2>Tell us where to set things up.</h2>
          </div>
          <OnboardingForm />
        </section>
      </section>
    </main>
  );
}
