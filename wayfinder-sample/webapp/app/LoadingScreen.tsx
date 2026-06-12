"use client";

export type StepStatus = "pending" | "active" | "done" | "error";

export type LoadingStep = {
  label: string;
  status: StepStatus;
};

interface LoadingScreenProps {
  steps: LoadingStep[];
  title?: string;
  description?: string;
  error?: string;
  action?: { label: string; onClick: () => void };
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="16">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (status === "error") {
    return (
      <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="16">
        <line x1="18" x2="6" y1="6" y2="18" />
        <line x1="6" x2="18" y1="6" y2="18" />
      </svg>
    );
  }
  if (status === "active") {
    return (
      <svg className="step-spinner" fill="none" height="16" viewBox="0 0 24 24" width="16">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
      </svg>
    );
  }
  return (
    <svg fill="none" height="16" viewBox="0 0 24 24" width="16">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
    </svg>
  );
}

export default function LoadingScreen({ steps, title = "Setting things up…", description, error, action }: LoadingScreenProps) {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-card">
        {!error && (
          <div className="loading-spinner-wrap" aria-hidden="true">
            <svg className="loading-ring" fill="none" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
              <circle cx="28" cy="28" r="24" stroke="currentColor" strokeOpacity="0.1" strokeWidth="4" />
              <circle
                className="loading-ring-arc"
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeDasharray="80 72"
                strokeDashoffset="0"
                strokeLinecap="round"
                strokeWidth="4"
              />
            </svg>
          </div>
        )}

        <h2 className="loading-title">{title}</h2>
        {description && <p className="loading-description">{description}</p>}

        {steps.length > 0 && (
          <ol className="loading-steps">
            {steps.map((step, i) => (
              <li className={`loading-step loading-step--${step.status}`} key={i}>
                <span className="loading-step-icon">
                  <StepIcon status={step.status} />
                </span>
                <span className="loading-step-label">{step.label}</span>
              </li>
            ))}
          </ol>
        )}
        {error && (
          <div className="loading-error" role="alert">
            <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            {error}
          </div>
        )}
        {action && (
          <button className="button button-secondary" type="button" style={{ marginTop: "16px" }} onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
