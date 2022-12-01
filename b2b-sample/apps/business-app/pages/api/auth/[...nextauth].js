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

import { getLoggedUserFromProfile } from "@b2bsample/shared/util/util-authorization-config-util";
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
const wso2ISProvider = (req, res) => NextAuth(req, res, {

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
        async session({ session, token }) {

            if (!session) {
                session.error = true;
            } else if (session.expiresIn <= 0) {
                session.expires = true;
            }
            else {
                session.error = false;
                session.expires = false;
                session.user = getLoggedUserFromProfile(token.user);
                session.orgId = token.user.user_organization;
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
                    scope: config.BusinessAppConfig.ApplicationConfig.APIScopes.join(" ")
                }
            },
            callbackUrl: "/o/moveOrg",
            checks: [ "state" ],
            clientId: config.BusinessAppConfig.AuthorizationConfig.ClientId,
            clientSecret: config.BusinessAppConfig.AuthorizationConfig.ClientSecret,
            httpOptions: {
                timeout: 1800000
            },
            id: "wso2is",
            name: "WSO2IS",
            profile(profile) {

                return {
                    id: profile.sub
                };
            },
            secret: process.env.SECRET,
            type: "oauth",
            userinfo: `${config.CommonConfig.AuthorizationConfig.BaseOrganizationUrl}/oauth2/userinfo`,
            // eslint-disable-next-line
            wellKnown: `${config.CommonConfig.AuthorizationConfig.BaseOrganizationUrl}/oauth2/token/.well-known/openid-configuration`
        }
    ],
    session: {
        jwt: true
    }
});

export default wso2ISProvider;
