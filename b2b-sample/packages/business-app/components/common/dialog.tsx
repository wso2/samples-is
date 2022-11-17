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

import React from "react";
import { Notification } from "rsuite";

/**
 * 
 * @param prop - type (error, info, success ), header - title text, body - body text
 *
 * @returns A side dialog to show notifications
 */
function Dialog(prop) {

    const { type, header, body } = prop;

    return (
        <Notification type={ type } header={ header } closable>
            { body }
        </Notification>
    );
}

/**
 * 
 * @param toaster - `useToaster()` get the toaster
 * @param type - `error`, `info`, `success` or `warning`
 * @param header - header text
 * @param body - body text
 * 
 * @returns - A notification dialog baed on the `type`
 */
function showDialog(toaster, type, header, body) {
    toaster.push(<Dialog type={ type } header={ header } body={ body } />, {
        placement: "bottomStart"
    });

    setTimeout(() => toaster.remove(), 2500);
}

/**
 * 
 * @param toaster - `useToaster()` get the toaster
 * @param header - header text
 * @param body - body text
 * 
 * @returns - A error type notification dialog
 */
function errorTypeDialog(toaster, header, body) {
    showDialog(toaster, "error", header, body);
}

/**
 * 
 * @param toaster - `useToaster()` get the toaster 
 * @param header - header text
 * @param body - body text
 * 
 * @returns - A information type notification dialog
 */
function infoTypeDialog(toaster, header, body) {
    showDialog(toaster, "info", header, body);
}

/**
 * 
 * @param toaster - `useToaster()` get the toaster 
 * @param header - header text
 * @param body - body text
 * 
 * @returns - A success type notification dialog
 */
function successTypeDialog(toaster, header, body) {
    showDialog(toaster, "success", header, body);
}

/**
 * 
 * @param toaster - `useToaster()` get the toaster 
 * @param header - header text
 * @param body - body text
 * 
 * @returns - A warning type notification dialog
 */
function warningTypeDialog(toaster, header, body) {
    showDialog(toaster, "warning", header, body);
}

export { errorTypeDialog, infoTypeDialog, successTypeDialog, warningTypeDialog };
