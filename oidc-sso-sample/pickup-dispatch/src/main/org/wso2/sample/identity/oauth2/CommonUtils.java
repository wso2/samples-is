package org.wso2.sample.identity.oauth2;

import org.apache.oltu.oauth2.client.OAuthClient;
import org.apache.oltu.oauth2.client.URLConnectionClient;
import org.apache.oltu.oauth2.client.request.OAuthClientRequest;
import org.apache.oltu.oauth2.client.response.OAuthClientResponse;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.types.GrantType;
import org.json.JSONObject;

import javax.net.ssl.HttpsURLConnection;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.UUID;
import java.util.logging.Logger;

public  class CommonUtils {
    private static Logger LOGGER = Logger.getLogger("org.wso2.sample.identity.oauth2.CommonUtils");
    private static Map<String, TokenData> tokenStore = new HashMap<>();


    public static JSONObject requestToJson(OAuthClientRequest accessRequest) {

        JSONObject obj = new JSONObject();
        obj.append("tokenEndPoint", accessRequest.getLocationUri());
        obj.append("request body", accessRequest.getBody());

        return obj;
    }

    public static JSONObject responseToJson(OAuthClientResponse oAuthResponse) {

        JSONObject obj = new JSONObject();
        obj.append("status-code", "200");
        obj.append("id_token", oAuthResponse.getParam("id_token"));
        obj.append("access_token", oAuthResponse.getParam("access_token"));
        return obj;

    }

    public static boolean logout(HttpServletRequest request, HttpServletResponse response) {

        Cookie appIdCookie = getAppIdCookie(request);

        if (appIdCookie != null) {
            tokenStore.remove(appIdCookie.getValue());
            appIdCookie.setMaxAge(0);
            response.addCookie(appIdCookie);
            return true;
        }
        return false;
    }

    public static void getToken(HttpServletRequest request, HttpServletResponse response) throws ClientAppException,
            OAuthProblemException, OAuthSystemException {

        Cookie appIdCookie = getAppIdCookie(request);
        HttpSession session = request.getSession(false);
        TokenData storedTokenData;;
        String accessToken;
        Properties properties = SampleContextEventListener.getProperties();
        if (appIdCookie != null) {
            storedTokenData = tokenStore.get(appIdCookie.getValue());
            if (storedTokenData != null) {
                setTokenDataToSession(session, storedTokenData);
                return;
            }
        }

        String authzCode = request.getParameter("code");
        if (authzCode == null) {
            return;
        }
        OAuthClientRequest.TokenRequestBuilder oAuthTokenRequestBuilder =
                new OAuthClientRequest.TokenRequestBuilder(properties.getProperty("tokenEndpoint"));


        OAuthClientRequest accessRequest = oAuthTokenRequestBuilder.setGrantType(GrantType.AUTHORIZATION_CODE)
                    .setClientId(properties.getProperty("consumerKey"))
                    .setClientSecret(properties.getProperty("consumerSecret"))
                    .setRedirectURI(properties.getProperty("callBackUrl"))
                    .setCode(authzCode)
                    .buildBodyMessage();

        //create OAuth client that uses custom http client under the hood
        OAuthClient oAuthClient = new OAuthClient(new URLConnectionClient());
        JSONObject requestObject = requestToJson(accessRequest);
        OAuthClientResponse oAuthResponse = oAuthClient.accessToken(accessRequest);
        JSONObject responseObject = responseToJson(oAuthResponse);
        accessToken = oAuthResponse.getParam("access_token");
        session.setAttribute("requestObject", requestObject);
        session.setAttribute("responseObject", responseObject);
        if (accessToken != null) {
            session.setAttribute("accessToken", accessToken);
            String idToken = oAuthResponse.getParam("id_token");
            if (idToken != null) {
                session.setAttribute("idToken", idToken);
            }
            session.setAttribute("authenticated", true);
            TokenData tokenData = new TokenData();
            tokenData.setAccessToken(accessToken);
            tokenData.setIdToken(idToken);

            String sessionId = UUID.randomUUID().toString();
            tokenStore.put(sessionId, tokenData);
            Cookie cookie = new Cookie("AppID", sessionId);
            cookie.setMaxAge(-1);
            cookie.setPath("/");
            response.addCookie(cookie);
        } else {
            session.invalidate();
        }
    }

    private static Cookie getAppIdCookie(HttpServletRequest request) {

        Cookie[] cookies = request.getCookies();
        Cookie appIdCookie = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("AppID".equals(cookie.getName())) {
                    appIdCookie = cookie;
                    break;
                }
            }
        }
        return appIdCookie;
    }
    private static void setTokenDataToSession(HttpSession session, TokenData storedTokenData) {

        session.setAttribute("authenticated", true);
        session.setAttribute("accessToken", storedTokenData.getAccessToken());
        session.setAttribute("idToken", storedTokenData.getIdToken());
        return;
    }

    private static HttpsURLConnection getHttpsURLConnection(String url) throws ClientAppException {

        try {
            URL requestUrl = new URL(url);
            return (HttpsURLConnection) requestUrl.openConnection();
        } catch (IOException e) {
            throw new ClientAppException("Error while creating connection to: " + url, e);
        }
    }

}
