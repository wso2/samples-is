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
import { Notification, Toaster } from "rsuite";
import { DialogComponentProps } from "../../models/dialogComponent/dialogComponent";

/**
 * 
 * @param prop - type (error, info, success ), header - title text, body - body text
 *
 * @returns A side dialog to show notifications
 */
function DialogComponent(prop: DialogComponentProps) {

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
async function showDialog(toaster: Toaster,
    type: "error" | "info" | "success" | "warning",
    header: string,
    body?: string) {
    const toasteKey = toaster.push(<DialogComponent type={ type } header={ header } body={ body } />, {
        placement: "bottomStart"
    });

    if (toasteKey) {
        const key: string = toasteKey.toString();

        setTimeout(() => toaster.remove(key), 2500);
    }
}

/**
 * 
 * @param toaster - `useToaster()` get the toaster
 * @param header - header text
 * @param body - body text
 * 
 * @returns - A error type notification dialog
 */
export function errorTypeDialog(toaster: Toaster, header: string, body?: string) {
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
export function infoTypeDialog(toaster: Toaster, header: string, body?: string) {
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
export function successTypeDialog(toaster: Toaster, header: string, body?: string) {
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
export function warningTypeDialog(toaster: Toaster, header: string, body?: string) {
    showDialog(toaster, "warning", header, body);
}

export default { errorTypeDialog, infoTypeDialog, successTypeDialog, warningTypeDialog };
