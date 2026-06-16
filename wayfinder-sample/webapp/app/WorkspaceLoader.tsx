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
