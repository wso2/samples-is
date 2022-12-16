/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { CopyTextToClipboardCallback } from "../model/copyTextToClipboardCallback";

/**
 * 
 * @param str - string that need to be checked
 * 
 * @returns `true` if `str` is empty, else `false`
 */
export function stringIsEmpty(str: string): boolean {

    return str === "";
}

/**
 * 
 * @returns current date
 */
export function getCurrentDate(): string {
    const today: Date = new Date();
    const dd: string = String(today.getDate()).padStart(2, "0");
    const mm: string = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy: string = today.getFullYear().toString();

    const todayString: string = mm + "/" + dd + "/" + yyyy;

    return todayString;
}

/**
 *  @returns true if JSON is empty else false
 */
export function checkIfJSONisEmpty(obj: Record<string, unknown>): boolean {
    if (!obj) {

        return true;
    }

    return sizeOfJson(obj) === 0;
}

/**
 *  @returns the size of JSON object
 */
export function sizeOfJson(obj: Record<string, unknown>): number {
    return Object.keys(obj).length;
}

/**
 * Copy the pased `text` to the clipboard and shows a notification
 * 
 * @param text - text that need to be copied to the clipboard
 * @param toaster - toaster object
 */
export function copyTheTextToClipboard(text: string, callback: CopyTextToClipboardCallback): void {
    navigator.clipboard.writeText(text);
    callback();
}

/**
 * 
 * @returns random generatored rgb colour
 */
export function random_rgba(): string {
    const o = Math.round, r = Math.random, s = 255;

    return "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + "," + r().toFixed(1) + ")";
}

/**
 * operations that we can do on PATCH methods
 */
export enum PatchMethod {
    ADD = "ADD",
    REMOVE = "REMOVE",
    REPLACE = "REPLACE"
}

export const GOOGLE_ID = "google-idp";
export const ENTERPRISE_ID = "enterprise-idp";
export const BASIC_ID = "basic-idp";
export const EMPTY_STRING = "";

export const GOOGLE_AUTHENTICATOR_ID = "GoogleOIDCAuthenticator";
export const ENTERPRISE_AUTHENTICATOR_ID = "OpenIDConnectAuthenticator";
export const BASIC_AUTHENTICATOR_ID = "BasicAuthenticator";

export default {
    BASIC_AUTHENTICATOR_ID, BASIC_ID, EMPTY_STRING, ENTERPRISE_AUTHENTICATOR_ID, ENTERPRISE_ID,
    GOOGLE_AUTHENTICATOR_ID, GOOGLE_ID, PatchMethod, checkIfJSONisEmpty, copyTheTextToClipboard, getCurrentDate,
    random_rgba, sizeOfJson, stringIsEmpty
};
