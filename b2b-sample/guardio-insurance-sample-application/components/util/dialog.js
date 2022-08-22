/*
 * Copyright (c) 2022 WSO2 LLC. (http://www.wso2.com).
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
import React from 'react';
import { Notification } from 'rsuite';

function Dialog(props) {
    return (
        <Notification type={props.type} header={props.header} closable>
            {props.body}
        </Notification>
    )
}

function showDialog(toaster,type,header,body) {
    toaster.push(<Dialog type={type} header={header} body={body} />, {
        placement: 'bottomStart'
    });

    setTimeout(() => toaster.remove(),2500);
}

function successTypeDialog(toaster, header, body) {
    showDialog(toaster,'success',header,body);
}

function errorTypeDialog(toaster, header, body) {
    showDialog(toaster,'error',header,body);
}

function infoTypeDialog(toaster, header, body) {
    showDialog(toaster,'info',header,body);
}

module.exports = { successTypeDialog, errorTypeDialog, infoTypeDialog }