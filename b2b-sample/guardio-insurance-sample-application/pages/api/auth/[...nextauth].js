import NextAuth from "next-auth"
import { consoleLogDebug, getLoggedUserId, getLoginOrgId,getLoggedUser,getLoggedUserFromProfile } from "../../../util/util";
import config from '../../../config.json';
import { switchOrg } from '../../../util/apiCall/switchApiCall';

const wso2ISProvider = (req, res) => NextAuth(req, res, {

  providers: [
    {
      id: "wso2is",
      name: "WSO2IS",
      clientId: config.WSO2IS_CLIENT_ID,
      clientSecret: config.WSO2IS_CLIENT_SECRET,
      type: "oauth",
      secret: process.env.SECRET,
      wellKnown: config.WSO2IS_HOST + "/t/" + config.WSO2IS_TENANT_NAME + "/oauth2/token/.well-known/openid-configuration",
      userinfo: config.WSO2IS_HOST+"/t/"+config.WSO2IS_TENANT_NAME+"/oauth2/userinfo",
      authorization: {
        params: {
          scope: config.WSO2IS_SCOPES.join(" "),
        }
      },
      profile(profile) {
        consoleLogDebug('profile2',profile);
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
      const orgSession = await switchOrg(req, token.accessToken); 
      if(!orgSession){
        session.error = true;
      } else if(orgSession.expiresIn<=0){
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
