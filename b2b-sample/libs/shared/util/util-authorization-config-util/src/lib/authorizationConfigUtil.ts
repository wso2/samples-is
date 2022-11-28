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

import { User } from "@b2bsample/shared/data-access/data-access-common-models-util";
import { getManagementAPIServerBaseUrl, getTenantDomain } from "@b2bsample/shared/util/util-application-config-util";
import { checkIfJSONisEmpty } from "@b2bsample/shared/util/util-common";
import { JWT } from "next-auth/jwt";
import { signIn, signOut } from "next-auth/react";
import config from "../../../../../../config.json";

/**
* 
* @param path - path string that need to be redirected
* 
* @returns redirect locally to a path
*/
function redirect(path: string): object {
    return {
        redirect: {
            destination: path,
            permanent: false
        }
    };
}

/**
* 
* @param orgId - `orgId` - (directs to the organization login), `null` - (enter the organization to login)
*/
function orgSignin(adminApp: boolean, orgId?: string): void {

    if(adminApp) {
        if (orgId) {
            signIn("wso2isAdmin", { callbackUrl: "/o/moveOrg" }, { orgId: orgId });
        } else {
            signIn("wso2isAdmin", { callbackUrl: "/o/moveOrg" });
        }
    } else {
        if (orgId) {
            signIn("wso2is", { callbackUrl: "/o/moveOrg" }, { orgId: orgId });
        } else {
            signIn("wso2is", { callbackUrl: "/o/moveOrg" });
        }
    }
}

/**
* signout of the logged in organization
* 
* @param session - session object
*/
async function orgSignout(session: any, hostedUrl: string): Promise<void> {

    // todo: implementation should change after the backend changes are completed

    if (session) {
        signOut()
            .then(
                () => window.location.assign(
                    getManagementAPIServerBaseUrl() + "/t/" + getTenantDomain() +
                    "/oidc/logout?id_token_hint=" + session.orginalIdToken + "&post_logout_redirect_uri=" +
                    hostedUrl + "&state=sign_out_success"
                )
            );
    } else {
        await signOut({ callbackUrl: "/" });
    }
}

/**
* 
* @param token - token object returned from the login function
* 
* @returns - parse JWT token and return a JSON
*/
function parseJwt(token: JWT) {

    const buffestString: Buffer = Buffer.from(token.toString().split(".")[1], "base64");

    return JSON.parse(buffestString.toString());
}

/**
* 
* @param token - token object returned from the login function
* 
* @returns logged in user id.
*/
function getLoggedUserId(token: JWT): string {

    return parseJwt(token)["sub"];
}

/**
* 
* @param token - token object returned from the login function
* 
* @returns get organization id. If `org_id` is null in token check `config.json` for the org id
*/
function getOrgId(token: JWT): string {

    if (parseJwt(token)["org_id"]) {

        return parseJwt(token)["org_id"];
    }

    return config.CommonConfig.ApplicationConfig.SampleOrganization[0].id;
}

/**
* 
* @param token - token object returned from the login function
* 
* @returns get organization name. If `org_name` is null in token check `config.json` for the org name
*/
function getOrgName(token: JWT): string {

    if (parseJwt(token)["org_name"]) {

        return parseJwt(token)["org_name"];
    }

    return config.CommonConfig.ApplicationConfig.SampleOrganization[0].name;
}

/**
* 
* @param profile - profile
* 
* @returns `User` get logged user from profile
*/
function getLoggedUserFromProfile(profile: any): User | null {

    try {
        const user: User = {
            emails: [ profile.email ],
            id: profile.sub,
            name: {
                familyName: profile.family_name ? profile.family_name : "-",
                givenName: profile.given_name ? profile.given_name : "-"
            },
            userName: profile.username
        };

        if (checkIfJSONisEmpty(user.name) || !user.emails[0] || !user.userName) {

            return null;
        }

        return user;
    } catch (err) {

        return null;
    }
}

export {
    redirect, orgSignin, orgSignout, getLoggedUserId, getLoggedUserFromProfile, getOrgId, getOrgName
};
