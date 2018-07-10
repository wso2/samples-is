package org.wso2.sample.consent.mgt;

import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;


public class ClientServlet extends HttpServlet {

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        HttpSession session = req.getSession();

        try {
            session.setAttribute("response", getConsentReceipt(getConsentReceiptId()));

        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

        resp.sendRedirect("view-consent.jsp");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        doGet(req, resp);
    }


    public ArrayList<String> getConsentReceiptId() throws IOException, URISyntaxException {

        JSONObject json;

        ArrayList<String> receiptIds = new ArrayList<String>();

        HttpUriRequest request = RequestBuilder
                .get()
                .setUri("https://localhost:9443/api/identity/consent-mgt/v1.0/consents")
                .addHeader("Accept","application/json")
                .addHeader("Authorization","Basic YWRtaW46YWRtaW4=")
                .addParameter("state","ACTIVE")
                .build();

        CloseableHttpClient httpclient = HttpClients.createDefault();

        CloseableHttpResponse closeablehttpresponse = httpclient.execute(request);
        String responseString = EntityUtils.toString(closeablehttpresponse.getEntity(), "UTF-8");

        JSONArray jsonArray = new JSONArray(responseString);
        for (int i = 0; i < jsonArray.length(); i++) {
            json = jsonArray.getJSONObject(i);
            if ((json.getString("spDisplayName")).equals("Resident IDP")) {
                receiptIds.add(json.getString("consentReceiptID"));
            }
        }

        return receiptIds;
    }

    public HashMap<String,String> getConsentReceipt(ArrayList<String> Ids) throws IOException {

        JSONObject json1 = null;
        JSONObject json2 = null;
        JSONObject json3 = null;

        String categories = null;
        String piiCategoryDisplayName = null;

        int mobCount = 0;

        JSONArray purposes = null;
        JSONArray piiCategory = null;

        HashMap<String,String> map = new HashMap<String,String>();

            int j = 0;
            for (String receiptID : Ids) {

                HttpUriRequest request = RequestBuilder
                        .get()
                        .setUri("https://localhost:9443/api/identity/consent-mgt/v1.0/consents/receipts/" + receiptID)
                        .addHeader("Accept", "application/json")
                        .addHeader("Authorization", "Basic YWRtaW46YWRtaW4=")
                        .build();

                CloseableHttpClient httpclient = HttpClients.createDefault();

                CloseableHttpResponse closeablehttpresponse = httpclient.execute(request);
                String receipt = EntityUtils.toString(closeablehttpresponse.getEntity(), "UTF-8");

                JSONObject json = new JSONObject(receipt);
                String user = json.getString("piiPrincipalId");
                map.put("user"+j, user);

                JSONArray jsonArray = json.getJSONArray("services");

                for (int i = 0; i < jsonArray.length(); i++) {
                    json1 = jsonArray.getJSONObject(i);
                    purposes = json1.getJSONArray("purposes");
                }

                for (int i = 0; i < purposes.length(); i++) {
                    json2 = purposes.getJSONObject(i);
                    piiCategory = json2.getJSONArray("piiCategory");
                }

                for (int i = 0; i < piiCategory.length(); i++) {
                    json3 = piiCategory.getJSONObject(i);
                    piiCategoryDisplayName = json3.getString("piiCategoryDisplayName");

                    if (piiCategoryDisplayName.equals("Mobile")) {
                        map.put("piiCatMobile" + j, "Mobile");

                    }else if (piiCategoryDisplayName.equals("Email")) {
                        map.put("piiCatEmail"+j, "Email");
                    }
                }

                j++;
            }

        return map;
    }
}
