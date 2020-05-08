package org.wso2.photo.view.services;

import org.json.JSONArray;
import org.json.JSONObject;
import org.wso2.photo.view.CommonUtils;
import org.wso2.photo.view.SampleContextEventListener;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.logging.Logger;
import javax.net.ssl.HttpsURLConnection;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import static org.wso2.photo.view.CommonUtils.readFromError;
import static org.wso2.photo.view.CommonUtils.readFromResponse;

public class PhotoRetrieveService extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(PhotoRetrieveService.class.getName());

    @Override
    protected void doGet(final HttpServletRequest req, final HttpServletResponse resp)
            throws ServletException, IOException {

        String resourceURL = "http://localhost.com:8080/photo-edit/resource/09c4e7c6-04b7-11e9-8eb2-f2801f1b9fd1";

        HttpURLConnection urlConnection = (HttpURLConnection) new URL(resourceURL).openConnection();
        urlConnection.setRequestMethod("GET");

        int responseCode = urlConnection.getResponseCode();
        LOGGER.warning("Response code from resource server for the resource request: " + responseCode);
        System.out.println("Response code from resource server for the resource request: " + responseCode);

        if (responseCode == 401) {
            String res = CommonUtils.readFromError(urlConnection);
            String ticketParam = res.split("&")[1];
            String ticket = ticketParam.substring(ticketParam.indexOf("=") + 1);
            LOGGER.warning("Permission Ticket: " + ticket);
            System.out.println("Permission Ticket: " + ticket);
            String rpt = getRPT(req, ticket);
            LOGGER.warning("RPT: " + rpt);
            System.out.println("RPT: " + rpt);

            if (rpt != null) {
                urlConnection = (HttpURLConnection) new URL(resourceURL).openConnection();
                urlConnection.setRequestMethod("GET");
                urlConnection.setRequestProperty("Authorization", "Bearer " + rpt);

                responseCode = urlConnection.getResponseCode();
                LOGGER.warning("Resource request response code: " + responseCode);
                System.out.println("Resource request response code: " + responseCode);
                if (responseCode == 401) {
                    res = CommonUtils.readFromError(urlConnection);
                    LOGGER.warning("Resource request error response: " + res);
                    System.out.println("Resource request error response: " + res);
                    resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                } else if (responseCode == 200) {
                    String resp1 = readFromResponse(urlConnection);
                    resp.setStatus(HttpServletResponse.SC_OK);
                    JSONArray jsonArray = new JSONArray(resp1);
                    LOGGER.warning("Resource request success response: " + resp1);
                    System.out.println("Resource request success response: " + resp1);
                    final ServletOutputStream outputStream = resp.getOutputStream();
                    outputStream.print(jsonArray.toString());
                    outputStream.close();
                }
            } else {
                System.out.println("RPT is null");
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
        } else {
            System.out.println("Resource server resp code: " + responseCode);
        }
    }

    private String getRPT(HttpServletRequest req, String ticket) throws IOException {

        String tokenEp = SampleContextEventListener.getPropertyByKey("tokenEndpoint");
        String clientKey = SampleContextEventListener.getPropertyByKey("consumerKey");
        String clientSecret = SampleContextEventListener.getPropertyByKey("consumerSecret");

        HttpsURLConnection urlConnection1 = (HttpsURLConnection) new URL(tokenEp).openConnection();
        urlConnection1.setRequestMethod("POST");

        String encodedCredentials = new String(Base64.getEncoder().encode(String.join(":", clientKey, clientSecret)
                                                                                .getBytes()));

        urlConnection1.setRequestProperty("Authorization", "Basic " + encodedCredentials);
        urlConnection1.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

        urlConnection1.setDoOutput(true);
        DataOutputStream dataOutputStream = new DataOutputStream(urlConnection1.getOutputStream());

        HttpSession session = req.getSession(false);
        String idToken = (String) session.getAttribute("idToken");

        String payload = "grant_type=urn:ietf:params:oauth:grant-type:uma-ticket" +
                         "&ticket=" + ticket +
                         "&claim_token=" + idToken;
        dataOutputStream.writeBytes(payload);

        String jsonresp;
        if (urlConnection1.getResponseCode() >= 400) {
            jsonresp = readFromError(urlConnection1);
            LOGGER.warning("RPT request error response: " + jsonresp);
            System.out.println("RPT request error response: " + jsonresp);
            return null;
        } else {
            jsonresp = readFromResponse(urlConnection1);
            JSONObject json = new JSONObject(jsonresp);
            System.out.println(jsonresp);
            return json.getString("access_token");
        }
    }
}
