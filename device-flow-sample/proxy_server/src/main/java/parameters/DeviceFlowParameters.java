package parameters;

import dao.DaoFactory;
import generator.CodeGenerator;
import generator.GenerateKeys;
import proxyseverconnect.TokenRequest;

import java.time.ZonedDateTime;

public class DeviceFlowParameters {

    private final String CLIENT_ID = "PdfQIjZEaS8unbadpqKplzx0fWEa";
    private String DEVICE_CODE;
    private String ACCESS_TOKEN;
    private String USER_CODE;
    private static final String VERIFICATION_URI = "https://localhost:9443/oauth2/device/";
    private static final String VERIFICATION_URI_COMPLETE = VERIFICATION_URI + "?" + "user_code=";
//    private static final String ACCESS_TOKEN = new TokenRequest().getAccessToken();
    private static final String TOKEN_TYPE = "Bearer";
    private static final Integer EXPIRES_IN_DEVICE = 100000 * 1000;
    private static final Integer EXPIRES_IN_TOKEN = 4000;
    private static final Integer Interval = 5 * 1000;
    private Long CURRENT_TIME = ZonedDateTime.now().toInstant().toEpochMilli();
    private DaoFactory daoFactory = new DaoFactory();
//    private TokenRequest tokenRequest = new TokenRequest();
    private static final String proxyId = "XvV18cWOAam8DpMrxu9HzIegdOga";
    private static final String proxySecrete = "fZPsipTCy4_ydjbBY1JQW3FsrfEa";

    public DeviceFlowParameters() {

    }

    public String getClientId() {

        return CLIENT_ID;
    }

    public String setDeviceCode(){
        DEVICE_CODE = new CodeGenerator().getAuthReqId();
        daoFactory.getConnector("InMemoryCache").addDeviceCodeCache(CLIENT_ID, DEVICE_CODE);
        return DEVICE_CODE;
    }

    public String getDeviceCode() {
//        System.out.println("ClientId");

        return daoFactory.getConnector("InMemoryCache").getDeviceCodeCache(CLIENT_ID);
    }

    public String setUserCode(String clientId){
        USER_CODE = new GenerateKeys().getKey(8);
        daoFactory.getConnector("InMemoryCache").addUserCodeCache(clientId,USER_CODE);
        return USER_CODE;
    }

    public String getUserCode(String clientId) {

        daoFactory.getConnector("InMemoryCache").getUserCodeCache(clientId);
        return USER_CODE;
    }

    public String getVerificationUri() {

        return VERIFICATION_URI;
    }

    public String getVerificationUriComplete() {

        return VERIFICATION_URI_COMPLETE;
    }

//    public String getAccessToken() {
//
//        daoFactory.getConnector("InMemoryCache").addTokenCache(CLIENT_ID, ACCESS_TOKEN);
//        return ACCESS_TOKEN;
//    }

    public Integer setExpiresInDevice() {

        daoFactory.getConnector("InMemoryCache").addExpiresInCache(CLIENT_ID, CURRENT_TIME);
        return EXPIRES_IN_DEVICE;
    }

    public Integer getExpiresInDevice() {

        return EXPIRES_IN_DEVICE;
    }

    public Integer getExpiresInToken() {

        return EXPIRES_IN_TOKEN;
    }

    public String getTokenType() {

        return TOKEN_TYPE;
    }

    public Integer getInterval() {

        return Interval;
    }

    public String getProxyId(){
        return proxyId;
    }

    public String getProxySecrete(){
        return proxySecrete;
    }
//
//    public void setACCESS_TOKEN(){
//        daoFactory.getConnector("InMemoryCache").addTokenCache(DEVICE_CODE,tokenRequest.getAccessToken());
//    }
//
    public String getACCESS_TOKEN(String deviceCode){
        return daoFactory.getConnector("Inmemorycache").getTokenCache(deviceCode);
    }

}
