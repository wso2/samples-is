/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AxiosResponse } from "axios";
import { getBillingInstance, getSalesForceInstance } from "./instance";
import { AccountInfo, BillingInfo } from "../../types/billing";
import { BasicUserInfo } from "@asgardeo/auth-react";

function timeout(delay: number) {
  return new Promise(res => setTimeout(res, delay));
}

export async function getBilling(accessToken: string) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  await timeout(50);
  const response = await getBillingInstance().get("/billing", {
    headers: headers,
  });
  return response as AxiosResponse<BillingInfo>;
}

export async function postBilling(accessToken: string, payload?: BillingInfo) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await getBillingInstance().post("/billing", payload, {
    headers: headers,
  });
  return response;
}

export async function getUpgrade(accessToken: string) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  await timeout(50);
  const response = await getSalesForceInstance().get("/upgrade", {
    headers: headers,
  });
  return response as AxiosResponse<AccountInfo>;
}

export async function postUpgrade(accessToken: string, payload?: BasicUserInfo) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };
  const response = await getSalesForceInstance().post("/upgrade", payload, {
    headers: headers,
  });
  return response;
}
