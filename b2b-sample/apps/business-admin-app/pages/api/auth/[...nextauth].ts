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

import { controllerDecodeSwitchOrg } from "@b2bsample/business-admin-app/data-access/data-access-controller";
import { getLoggedUserFromProfile, getLoggedUserId, getOrgId, getOrgName } from
    "@b2bsample/shared/util/util-authorization-config-util";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import config from "../../../../../config.json";

/**
 * 
 * @param req - request body
 * @param res - response body
 * 
 * @returns IS provider that will handle the sign in process. Used in `orgSignin()`
 * [Use this method to signin]
 */
const wso2ISProvider = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, {

    callbacks: {

        async jwt({ token, account, profile }) {

            if (account) {
                token.accessToken = account.access_token;
                token.idToken = account.id_token;
                token.scope = account.scope;
                token.user = profile;
            }

            return token;
        },
        async redirect({ baseUrl }) {

            return `${baseUrl}/o/moveOrg`;
        },
        async session({ session, token }) {
            const orgSession = await controllerDecodeSwitchOrg(token);

            if (!orgSession) {
                session.error = true;
            } else if (orgSession.expires_in <= 0) {
                session.expires = true;
            }
            else {
                session.accessToken = orgSession.access_token;
                session.idToken = orgSession.id_token;
                session.scope = orgSession.scope;
                session.refreshToken = orgSession.refresh_token;
                session.expires = false;
                session.userId = getLoggedUserId(session.idToken);
                session.user = getLoggedUserFromProfile(token.user);
                session.orgId = getOrgId(session.idToken);
                session.orgName = getOrgName(session.idToken);
                session.orginalIdToken = token.idToken;
            }

            return session;
        }

    },
    debug: true,
    providers: [
        {
            authorization: {
                params: {
                    scope: config.BusinessAdminAppConfig.ApplicationConfig.APIScopes.join(" ")
                }
            },
            checks: "nonce",
            clientId: config.BusinessAdminAppConfig.AuthorizationConfig.ClientId,
            clientSecret: config.BusinessAdminAppConfig.AuthorizationConfig.ClientSecret,
            id: "wso2isAdmin",
            name: "WSO2ISAdmin",
            profile(profile) {

                return {
                    id: profile.sub
                };
            },
            type: "oauth",
            userinfo: `${config.CommonConfig.AuthorizationConfig.BaseOrganizationUrl}/oauth2/userinfo`,
            // eslint-disable-next-line
            wellKnown: `${config.CommonConfig.AuthorizationConfig.BaseOrganizationUrl}/oauth2/token/.well-known/openid-configuration`
        }
    ],
    secret: process.env.SECRET
});

export default wso2ISProvider;
