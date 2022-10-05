/*
 * Copyright (c) 2022 WSO2 LLC. (https://www.wso2.com).
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

import NextAuth from "next-auth";
import config from '../../../config.json';
import decodeSwitchOrg from "../../../util/apiDecode/settings/decodeSwitchOrg";
import { getLoggedUserFromProfile, getLoggedUserId } from '../../../util/util/routerUtil/routerUtil';

const wso2ISProvider = (req, res) => NextAuth(req, res, {

  providers: [
    {
      id: "wso2is",
      name: "WSO2IS",
      clientId: config.WSO2IS_CLIENT_ID,
      clientSecret: config.WSO2IS_CLIENT_SECRET,
      type: "oauth",
      secret: process.env.SECRET,
      wellKnown: config.WSO2IS_HOST + "/t/" + config.WSO2IS_TENANT_NAME
        + "/oauth2/token/.well-known/openid-configuration",
      userinfo: config.WSO2IS_HOST + "/t/" + config.WSO2IS_TENANT_NAME + "/oauth2/userinfo",
      authorization: {
        params: {
          scope: config.WSO2IS_SCOPES.join(" "),
        }
      },
      profile(profile) {

        return {
          id: profile.sub
        }
      },
    },
  ],
  secret: process.env.SECRET,
  callbacks: {

    async jwt({ token, user, account, profile, isNewUser }) {
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
        token.scope = account.scope
        token.user = profile
      }
      
      return token
    },
    async session({ session, token, user }) {
      const orgSession = await decodeSwitchOrg(req, token);
      if (!orgSession) {
        session.error = true;
      } else if (orgSession.expiresIn <= 0) {
        session.expires = true
      }
      else {
        session.accessToken = orgSession.access_token
        session.idToken = orgSession.id_token
        session.scope = orgSession.scope
        session.refreshToken = orgSession.refresh_token
        session.expires = false
        session.userId = getLoggedUserId(session.idToken)
        session.user = getLoggedUserFromProfile(token.user)
      }

      return session
    }
  },
  debug: true,
})

export default wso2ISProvider;
