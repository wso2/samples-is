package proxyseverconnect;

import dao.DaoFactory;
import org.apache.tomcat.util.json.JSONParser;
import org.json.JSONException;
import org.json.JSONObject;
import parameters.DeviceFlowParameters;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.net.URLEncoder;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

public class TokenRequest {

    private static String accessToken;
//    private String Location;
//    private String Location2;
//    private String Location3;

    public TokenRequest(){

    }

    private DeviceFlowParameters deviceFlowParameters = new DeviceFlowParameters();
    private DaoFactory daoFactory = new DaoFactory();

    public void sendRequest(String code) throws MalformedURLException, ProtocolException, IOException,
            NoSuchAlgorithmException
            , KeyManagementException {

        TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
            public java.security.cert.X509Certificate[] getAcceptedIssuers() {

                return null;
            }

            public void checkClientTrusted(X509Certificate[] certs, String authType) {

            }

            public void checkServerTrusted(X509Certificate[] certs, String authType) {

            }
        }
        };

        // Install the all-trusting trust manager
        SSLContext sc = SSLContext.getInstance("SSL");
        sc.init(null, trustAllCerts, new java.security.SecureRandom());
        HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

        // Create all-trusting host name verifier
        HostnameVerifier allHostsValid = new HostnameVerifier() {
            public boolean verify(String hostname, SSLSession session) {

                return true;
            }
        };

//        String encodedCredentials =
//                Base64.getEncoder().encodeToString((deviceFlowParameters.getProxyId()+":"+deviceFlowParameters.getProxySecrete()).getBytes());

//        System.out.println(encodedCredentials);
        // Install the all-trusting host verifier
        HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
        URL url = new URL("https://localhost:9443/oauth2/token");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();

//        connection.setRequestProperty("Authorization","Basic "+encodedCredentials);
        connection.setRequestMethod("POST");
        Map<String, String> params = new HashMap<>();
        params.put("code", code);
        params.put("redirect_uri", "http://localhost:8080/Device-Flow-Proxy-Server");
        params.put("grant_type","authorization_code");
        params.put("client_id", "PdfQIjZEaS8unbadpqKplzx0fWEa");
        //params.put("client", "somescope_code");

        StringBuilder postData = new StringBuilder();
        for (Map.Entry<String, String> param : params.entrySet()) {
            if (postData.length() != 0) {
                postData.append('&');
            }
            postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
            postData.append('=');
            postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
        }

        //System.out.println(postData.toString());

        byte[] postDataBytes = postData.toString().getBytes("UTF-8");
        connection.setDoOutput(true);
        try (DataOutputStream writer = new DataOutputStream(connection.getOutputStream())) {
            writer.write(postDataBytes);
            writer.flush();
            writer.close();

            StringBuilder content;

//            connection.setInstanceFollowRedirects(false);
//
//            if (connection.getResponseCode() == 302) { //如果服务器返回403错误
//                System.out.println("302"); //返回403
//                //System.out.println(connection.getHeaderFields());
//                Location = connection.getHeaderFields().get("Location").toString();
//                Location2 = Location.replace("[","");
//                Location3 = Location2.replace("]","");
//                //System.out.println(connection.getHeaderFields().get("Location").toString());
//
//            }

            System.out.println(connection.getResponseMessage());

            try (BufferedReader in = new BufferedReader(
                    new InputStreamReader(connection.getInputStream()))) {
                String line;
                content = new StringBuilder();
                while ((line = in.readLine()) != null) {
                    content.append(line);
                    content.append(System.lineSeparator());
                }
            }
            System.out.println(content);
            JSONObject obj = new JSONObject(content.toString());
            accessToken = obj.getString("access_token");
            System.out.println(accessToken);
//            deviceFlowParameters.setACCESS_TOKEN();
            setACCESS_TOKEN();

        } catch (JSONException e) {
            e.printStackTrace();
        } finally {
            connection.disconnect();
        }
    }

    public String getAccessToken() {

        System.out.println(accessToken);
        return accessToken;
    }

    private void setACCESS_TOKEN(){
        daoFactory.getConnector("InMemoryCache").addTokenCache(deviceFlowParameters.getDeviceCode(),accessToken);
    }

}
