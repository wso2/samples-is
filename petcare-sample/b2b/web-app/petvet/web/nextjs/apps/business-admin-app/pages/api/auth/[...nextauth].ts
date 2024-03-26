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
import { getConfig } from "@pet-management-webapp/business-admin-app/util/util-application-config-util";
import { getLoggedUserFromProfile, getLoggedUserId, getOrgId, getOrgName } from
    "@pet-management-webapp/shared/util/util-authorization-config-util";
import { jwtDecode } from "jwt-decode";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { Profile } from "next-auth";
import { JWT } from "next-auth/jwt";

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

            if (!session) {
                session.error = true;
            } else {
                session.accessToken = token.accessToken as string;
                // session.orginalIdToken = token.idToken;
                session.scope = token?.scope;
                const profile: Profile = jwtDecode(token.idToken);
                
                session.expires = false;
                session.userId = getLoggedUserId(token.idToken as unknown as JWT);
                session.user = getLoggedUserFromProfile(profile);
                session.orgId = getOrgId(token.idToken as unknown as JWT);
                session.orgName = getOrgName(token.idToken as unknown as JWT);
                
                let rolesList: string[]|string = token.user[ "roles" ];
                
                if (typeof rolesList === "string") {
                    rolesList = [ rolesList ];
                }
                if (rolesList == null || rolesList.length === 0) {
                    session.group = "petOwner";
                } else if (rolesList.some(x => x === "pet-care-doctor")) {
                    session.group = "doctor";
                } else if (rolesList.some(x => x === "pet-care-admin")) {
                    session.group = "admin";
                } else {
                    session.group = "petOwner";
                }
            }

            return session;
        }

    },
    debug: true,
    providers: [
        {
            authorization: {
                params: {
                    scope: getConfig().BusinessAdminAppConfig.ApplicationConfig.APIScopes.join(" ")
                }
            },
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            id: "wso2isAdmin",
            name: "WSO2ISAdmin",
            profile(profile) {

                return {
                    id: profile.sub
                };
            },
            type: "oauth",
            userinfo: `${getConfig().CommonConfig.AuthorizationConfig.BaseOrganizationUrl}/oauth2/userinfo`,
            // eslint-disable-next-line
            wellKnown: `${getConfig().CommonConfig.AuthorizationConfig.BaseOrganizationUrl}/oauth2/token/.well-known/openid-configuration`
        }
    ],
    secret: process.env.SECRET
});

export default wso2ISProvider;
