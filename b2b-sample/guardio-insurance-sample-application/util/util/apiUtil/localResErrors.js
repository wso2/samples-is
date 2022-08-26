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

function error404(res, msg) {
    return res.status(404).json(msg);
}

function notPostError(res) {
    return error404(res, 'Cannot request data directyly.');
}

function dataNotRecievedError(res) {
    return error404(res, 'Error occured when requesting data.');
}

module.exports = { notPostError, dataNotRecievedError }