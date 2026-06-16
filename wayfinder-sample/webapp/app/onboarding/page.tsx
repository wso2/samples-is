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
