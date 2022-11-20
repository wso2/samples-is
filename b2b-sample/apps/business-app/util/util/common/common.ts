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

import { infoTypeDialog } from "../../../components/common/dialog";

/**
 * 
 * @param str - string that need to be checked
 * 
 * @returns `true` if `str` is empty, else `false`
 */
function stringIsEmpty(str) : boolean{

    return str === "";
}

/**
 * 
 * @returns current date
 */
function getCurrentDate() : string {
    const today: Date = new Date();
    const dd : string = String(today.getDate()).padStart(2, "0");
    const mm : string  = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy : string  = today.getFullYear().toString();

    const todayString: string = mm + "/" + dd + "/" + yyyy;

    return todayString;
}

/**
 *  @returns true if JSON is empty else false
 */
function checkIfJSONisEmpty(obj) : boolean {
    if (!obj) {

        return true;
    }

    return sizeOfJson(obj) === 0;
}

/**
 *  @returns the size of JSON object
 */
function sizeOfJson(obj) : number {
    return Object.keys(obj).length;
}

/**
 * Copy the pased `text` to the clipboard and shows a notification
 * 
 * @param text - text that need to be copied to the clipboard
 * @param toaster - toaster object
 */
function copyTheTextToClipboard(text, toaster) : void {
    navigator.clipboard.writeText(text);
    infoTypeDialog(toaster, "Text copied to clipboard");
}

/**
 * 
 * @returns random generatored rgb colour
 */
function random_rgba() : string {
    const o = Math.round, r = Math.random, s = 255;

    return "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + "," + r().toFixed(1) + ")";
}

/**
 * operations that we can do on PATCH methods
 */
const PatchMethod = {
    ADD: "ADD",
    REMOVE: "REMOVE",
    REPLACE: "REPLACE"
};

const GOOGLE_ID : string = "google-idp";
const ENTERPRISE_ID : string = "enterprise-idp";
const BASIC_ID : string = "basic-idp";
const EMPTY_STRING : string = "";

const GOOGLE_AUTHENTICATOR_ID : string = "GoogleOIDCAuthenticator";
const ENTERPRISE_AUTHENTICATOR_ID : string = "OpenIDConnectAuthenticator";
const BASIC_AUTHENTICATOR_ID : string = "BasicAuthenticator";

export {
    stringIsEmpty, getCurrentDate, copyTheTextToClipboard, checkIfJSONisEmpty, sizeOfJson, random_rgba,
    PatchMethod, GOOGLE_ID, ENTERPRISE_ID, BASIC_ID, EMPTY_STRING, GOOGLE_AUTHENTICATOR_ID,
    ENTERPRISE_AUTHENTICATOR_ID, BASIC_AUTHENTICATOR_ID
};
