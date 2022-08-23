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

import config from '../../../config.json';

function checkAdmin(scopes) {
    const adminScopes = ["email", "internal_login", "internal_user_mgt_create", "internal_user_mgt_delete",
        "internal_user_mgt_list", "internal_user_mgt_update", "internal_user_mgt_view", "openid", "profile"];

    for (let i = 0; i < adminScopes.length; i++) {
        if (!scopes.includes(adminScopes[i])) {
            return false;
        }
    }

    return true;
}

function getRouterQuery(orgid) {
    for (var i = 0; i < config.SAMPLE_ORGS.length; i++) {
        if (config.SAMPLE_ORGS[i].id == orgid) {
            return config.SAMPLE_ORGS[i].routerQuery;
        }
    }
}

function getOrg(orgId) {
    for (var i = 0; i < config.SAMPLE_ORGS.length; i++) {
        if (config.SAMPLE_ORGS[i].id == orgId) {
            return config.SAMPLE_ORGS[i];
        }
    }
    return undefined;
}

function getOrgIdfromRouterQuery(routerQuery) {
    for (var i = 0; i < config.SAMPLE_ORGS.length; i++) {
        if (config.SAMPLE_ORGS[i].routerQuery == routerQuery) {
            return config.SAMPLE_ORGS[i].id;
        }
    }
    return undefined;
}

module.exports = {
    checkAdmin, getRouterQuery, getOrg, getOrgIdfromRouterQuery
};
