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

import NextAuth from "next-auth";
import config from "../../../config.json";
import decodeSwitchOrg from "../../../util/apiDecode/settings/decodeSwitchOrg";
import { getLoggedUserFromProfile, getLoggedUserId, getOrgId, getOrgName }
    from "../../../util/util/routerUtil/routerUtil";

/**
 * 
 * @param req - request body
 * @param res - response body
 * 
 * @returns IS provider that will handle the sign in process. Used in `routerUtil` `orgSignin()`
 * [Use this method to signin]
 */
const wso2ISProvider = (req, res) => NextAuth(req, res, {

    callbacks: {

        async jwt({ token, account, profile }) {

            if (account) {
                token.accessToken = account.access_token;
                token.idToken = account.id_token;
                token.scope = account.scope;
                token.user = profile;
            }
            console.log(token);
            return token;
        },
        async session({ session, token }) {
            const orgSession = await decodeSwitchOrg(token);
            console.log("///");
            console.log(orgSession);
            if (!orgSession) {
                session.error = true;
            } else if (orgSession.expiresIn <= 0) {
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
                    scope: config.ApplicationConfig.APIScopes.join(" ")
                }
            },
            clientId: config.AuthorizationConfig.ClientId,
            clientSecret: config.AuthorizationConfig.ClientSecret,
            id: "wso2is",
            name: "WSO2IS",
            profile(profile) {

                return {
                    id: profile.sub
                };
            },
            secret: process.env.SECRET,
            type: "oauth",
            userinfo: `${config.AuthorizationConfig.BaseOrganizationUrl}/oauth2/userinfo`,
            wellKnown: `${config.AuthorizationConfig.BaseOrganizationUrl}/oauth2/token/.well-known/openid-configuration`
        }
    ],
    secret: process.env.SECRET
});

export default wso2ISProvider;
