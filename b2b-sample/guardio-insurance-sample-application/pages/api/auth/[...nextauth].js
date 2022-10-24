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
import decodeSignOutCall from "../../../util/apiDecode/dashboard/decodeSignOutCall";
import decodeSwitchOrg from "../../../util/apiDecode/settings/decodeSwitchOrg";
import { getLoggedUserFromProfile, getLoggedUserId, getOrgId, getOrgName }
    from "../../../util/util/routerUtil/routerUtil";

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
            const orgSession = await decodeSwitchOrg(token);

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
            }

            return session;
        }
    },
    debug: true,
    events : {
        signOut : async ({session, token}) => {
            console.log('aaa');
            console.log(session);
            console.log('bbb');
            console.log(token);
            console.log('ccc');

            await decodeSignOutCall(token.user.org_name, token.idToken);

        }
    },
    providers: [
        {   
            authorization: {
                params: {
                    scope: config.WSO2IS_SCOPES.join(" ")
                }
            },
            clientId: config.WSO2IS_CLIENT_ID,
            clientSecret: config.WSO2IS_CLIENT_SECRET,
            id: "wso2is",
            name: "WSO2IS",
            profile(profile) {

                return {
                    id: profile.sub
                };
            },
            secret: process.env.SECRET,
            type: "oauth",
            userinfo: config.WSO2IS_HOST + "/t/" + config.WSO2IS_TENANT_NAME + "/oauth2/userinfo",
            wellKnown: config.WSO2IS_HOST + "/t/" + config.WSO2IS_TENANT_NAME
                       + "/oauth2/token/.well-known/openid-configuration"
        }
    ],
    secret: process.env.SECRET
});

export default wso2ISProvider;
