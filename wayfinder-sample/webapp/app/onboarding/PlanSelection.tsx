"use client";

import { useState } from "react";

export type Plan = "free" | "basic" | "advanced";

interface PlanSelectionProps {
  onSelect: () => void;
  onBack: () => void;
}

const PLANS = [
  {
    id: "free" as Plan,
    name: "Starter",
    tier: "FREE",
    price: "Free",
    priceNote: "forever",
    description: "For small teams taking their first steps in managed travel.",
    featured: false,
    features: [
      "Up to 5 travelers",
      "Basic trip requests",
      "1 travel policy",
      "Standard expense reports",
      "Email support",
    ],
  },
  {
    id: "basic" as Plan,
    name: "Business",
    tier: "BASIC",
    price: "$29",
    priceNote: "per seat / month",
    description: "For growing teams that need smart workflows and visibility.",
    featured: true,
    features: [
      "Up to 50 travelers",
      "Smart trip recommendations",
      "Unlimited travel policies",
      "Approval workflows",
      "Analytics dashboard",
      "Priority support",
    ],
  },
  {
    id: "advanced" as Plan,
    name: "Enterprise",
    tier: "ADVANCED",
    price: "$99",
    priceNote: "per seat / month",
    description: "For large organizations with complex travel programs.",
    featured: false,
    features: [
      "Unlimited travelers",
      "Custom integrations & API",
      "SSO & advanced security",
      "Dedicated account manager",
      "24/7 phone & chat support",
      "Custom reporting & exports",
    ],
  },
];

function CheckIcon() {
  return (
    <svg fill="none" height="15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="15">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function PlanSelection({ onSelect, onBack }: PlanSelectionProps) {
  const [selected, setSelected] = useState<Plan>("basic");

  return (
    <div className="plan-overlay">
      <div className="plan-page">
        <div className="plan-header">
          <p className="eyebrow">Step 2 of 2</p>
          <h2>Choose your plan.</h2>
          <p className="plan-subtitle">
            Pick the workspace plan that fits your team. You can upgrade at any time from your settings.
          </p>
        </div>

        <div className="plan-cards">
          {PLANS.map((plan) => (
            <button
              className={`plan-card${plan.featured ? " plan-card--featured" : ""}${selected === plan.id ? " plan-card--selected" : ""}`}
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              type="button"
            >
              {plan.featured && <span className="plan-badge">Most popular</span>}
              <div className="plan-card-header">
                <span className="plan-tier">{plan.tier}</span>
                <span className="plan-name">{plan.name}</span>
              </div>
              <div className="plan-pricing">
                <span className="plan-price">{plan.price}</span>
                <span className="plan-price-note">{plan.priceNote}</span>
              </div>
              <p className="plan-desc">{plan.description}</p>
              <ul className="plan-features">
                {plan.features.map((feat) => (
                  <li className="plan-feature" key={feat}>
                    <span className="plan-feature-icon"><CheckIcon /></span>
                    {feat}
                  </li>
                ))}
              </ul>
              <span className={`plan-select-indicator${selected === plan.id ? " plan-select-indicator--on" : ""}`}>
                {selected === plan.id ? "Selected" : "Select plan"}
              </span>
            </button>
          ))}
        </div>

        <div className="plan-actions">
          <button className="button button-secondary" onClick={onBack} type="button">
            Back
          </button>
          <button className="button button-primary" onClick={onSelect} type="button">
            Continue with {PLANS.find((p) => p.id === selected)?.name}
          </button>
        </div>
      </div>
    </div>
  );
}
