/*
 * Copyright (c) 2022 WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *http://www.apache.org/licenses/LICENSE-2.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function stringIsEmpty(str) {

    return (str === "");
}

function getCurrentDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    return today;
}

/**
 *  @return true if JSON is empty else false
 */
function checkIfJSONisEmpty(obj) {
    if (!obj) {

        return true;
    }

    return sizeOfJson(obj) === 0;
}

/**
 *  @return the size of JSON object
 */
 function sizeOfJson(obj) {
    return Object.keys(obj).length;
}

function copyTheTextToClipboard(text) {
    navigator.clipboard.writeText(text);
}

const GOOGLE_ID = "google-idp";
const ENTERPRISE_ID = "enterprise-idp";
const EMPTY_STRING = "";

const GOOGLE_AUTHENTICATOR_ID = "GoogleOIDCAuthenticator";
const ENTERPRISE_AUTHENTICATOR_ID = "OpenIDConnectAuthenticator";

module.exports = {
    stringIsEmpty, getCurrentDate, copyTheTextToClipboard, checkIfJSONisEmpty, sizeOfJson, GOOGLE_ID,ENTERPRISE_ID, 
    EMPTY_STRING, GOOGLE_AUTHENTICATOR_ID, ENTERPRISE_AUTHENTICATOR_ID
};
