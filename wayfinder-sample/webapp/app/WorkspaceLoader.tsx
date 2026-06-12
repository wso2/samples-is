"use client";

export default function WorkspaceLoader() {
  return (
    <div className="ws-loader" role="status" aria-label="Loading">
      <div className="ws-loader-content">
        <svg className="ws-spinner" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="20" stroke="currentColor" strokeOpacity="0.15" strokeWidth="4" />
          <circle
            cx="25" cy="25" r="20"
            stroke="currentColor"
            strokeDasharray="80 46"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </svg>
        <span className="ws-loader-label">Loading…</span>
      </div>
    </div>
  );
}
