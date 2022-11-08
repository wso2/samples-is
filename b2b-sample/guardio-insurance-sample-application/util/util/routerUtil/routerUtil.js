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

import cookie from "cookie";
import { signIn, signOut } from "next-auth/react";
import config from "../../../config.json";
import { getManagementAPIServerBaseUrl, getTenantDomain, getHostedUrl } from "../../util/apiUtil/getUrls";

/**
 * 
 * @param path
 * 
 * @returns redirect locally to a path
 */
function redirect(path) {

    return {
        redirect: {
            destination: path,
            permanent: false,
        },
    }
}

/**
 * 
 * @param req - request containing the cookie
 * 
 * @returns parse cookie
 */
function parseCookies(req) {

    return cookie.parse(req ? req.headers.cookie || "" : document.cookie);
}

/**
 * 
 * @param orgId `orgId` - (directs to the organization login), `null` - (enter the organization to login)
 */
function orgSignin(orgId) {
    if (orgId) {
        signIn("wso2is", { callbackUrl: `/o/moveOrg` }, { orgId: orgId });
    } else {
        signIn("wso2is", { callbackUrl: `/o/moveOrg` });
    }
}

/**
 * signout of the logged in organization
 * 
 * @param session 
 */
async function orgSignout(session) {
    
    // todo: implementation should change after the backend changes are completed

    if (session) {
        signOut()
            .then(
                () => window.location.assign(
                    getManagementAPIServerBaseUrl() + "/t/" + getTenantDomain() +
                    "/oidc/logout?id_token_hint=" + session.orginalIdToken + "&post_logout_redirect_uri=" +
                    getHostedUrl() + "&state=sign_out_success"
                )
            );
    } else {
        await signOut({ callbackUrl: "/" });
    }
}

/**
 * 
 * @param session
 * 
 * @returns when session is `null` redirect  to /signin
 */
function emptySession(session) {
    if (session === null || session === undefined) {

        return redirect("/signin");
    }
}

/**
 * 
 * @param token
 * 
 * @returns - parse JWT token and return a JSON
 */
function parseJwt(token) {

    return JSON.parse(Buffer.from(token.split(".")[1], "base64"));
}

/**
 * 
 * @param token
 * 
 * @returns logged in user id.
 */
function getLoggedUserId(token) {

    return parseJwt(token).sub;
}

/**
 * 
 * @param token
 * 
 * @returns get organization id. If `org_id` is null in token check `config.json` for the org id
 */
function getOrgId(token) {
    
    if (parseJwt(token).org_id) {

        return parseJwt(token).org_id
    } 

    return config.ApplicationConfig.SampleOrganization[0].id;
}

/**
 * 
 * @param token
 * 
 * @returns get organization name. If `org_name` is null in token check `config.json` for the org name
 */
function getOrgName(token) {

    if (parseJwt(token).org_name) {

        return parseJwt(token).org_name
    } 

    return config.ApplicationConfig.SampleOrganization[0].name;
}

/**
 * 
 * @param profile
 * 
 * @returns get logged user from profile
 */
function getLoggedUserFromProfile(profile) {
    const user = {};
    try {
        user.id = profile.sub;
        user.name = {
            "givenName": profile.given_name ? profile.given_name : "-"
            , "familyName": profile.family_name ? profile.family_name : "-"
        };
        user.emails = [profile.email];
        user.userName = profile.username;

        if (user.name === {} || !user.emails[0] || !user.userName) {

            return null
        }

        return user;
    } catch (err) {

        return null
    }
}

module.exports = {
    redirect, parseCookies, orgSignin, orgSignout, emptySession, getLoggedUserId, getLoggedUserFromProfile, getOrgId,
    getOrgName
};
