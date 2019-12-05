package proxyserver;

import dao.DaoFactory;
import exceptions.BadRequest;
import exceptions.Expired;
import exceptions.Unauthorized;
import exceptions.tokenerrors.AuthorizationPending;
import generator.CodeGenerator;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import parameters.DeviceFlowParameters;
import proxyseverconnect.ServerRequest;
import proxyseverconnect.TokenRequest;
import sources.DeviceAuthEndpoint;;
import sources.TokenEndpoint;
import sources.UserAuthenticationEndpoint;
import validator.ServerRequestValidator;
import validator.Validator;

import java.io.IOException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

@CrossOrigin
@RestController
public class EndpointsHandler {

    private DeviceFlowParameters deviceflowparameters = new DeviceFlowParameters();
    private Validator validator = new Validator();
    private CodeGenerator codeGenerator = new CodeGenerator();
    private String AuthId = codeGenerator.getAuthReqId();
    private DaoFactory daoFactory = new DaoFactory();
    private ServerRequest serverRequest = new ServerRequest();
    private ServerRequestValidator serverRequestValidator = new ServerRequestValidator();
    private TokenRequest tokenRequest = new TokenRequest();
    //private static String CLIENT_ID;

    public EndpointsHandler() throws NoSuchAlgorithmException, IOException, KeyManagementException {

    }

    //Mapping request to DeviceAuthEndpoint
    //required parameters are client id
    @PostMapping("/device_authorization")
    public DeviceAuthEndpoint deviceauthendpoint(@RequestParam(defaultValue = "", value = "client_id") String clientId)
            throws BadRequest, Unauthorized, NoSuchAlgorithmException, IOException, KeyManagementException {

        serverRequest.sendRequest(clientId);

//        System.out.println(AuthId);
//        authRequestCache.put(AuthId ,clientId);
//        System.out.println(authRequestCache.get(AuthId));

        if (!serverRequestValidator.getServerValidate(clientId)) {

            daoFactory.getConnector("InMemoryCache").addAuthRequest(AuthId, clientId);

            return new DeviceAuthEndpoint(
                    deviceflowparameters.setDeviceCode(),
                    deviceflowparameters.setUserCode(clientId),
                    deviceflowparameters.getVerificationUri(),
                    deviceflowparameters.getVerificationUriComplete(),
                    deviceflowparameters.setExpiresInDevice(),
                    deviceflowparameters.getInterval());
        }

        //exceptions handling
        else {
            throw new Unauthorized("invalid client");
        }
    }

    //map the request to token end point
    //required parameters are client id, device code and grant type
    @RequestMapping("/token")
    public TokenEndpoint tokenEndpoint(@RequestParam(defaultValue = "", value = "client_id") String clientId,
                                       @RequestParam(defaultValue = "", value = "device_code") String deviceCode,
                                       @RequestParam(defaultValue = "", value = "grant_type") String grantType)
            throws BadRequest, Unauthorized, Expired, AuthorizationPending {

        if (validator.getClientId(clientId) && validator.getDeviceCode(deviceCode) &&
                validator.getGrantType(grantType)) {

            if (tokenRequest.getAccessToken()==null || deviceflowparameters.getACCESS_TOKEN(deviceCode)==null ){
                throw new AuthorizationPending("Authorization Pending");
            }

            //return json type response
            return new TokenEndpoint(deviceflowparameters.getACCESS_TOKEN(deviceCode),
                    deviceflowparameters.getTokenType(), deviceflowparameters.getExpiresInToken());

            //throw exceptions
        } else if (!validator.getClientId(clientId)) {
            throw new Unauthorized("invalid client");

        } else if (!validator.getDeviceCode(deviceCode)) {
            throw new Unauthorized("invalid device");

        } else
            System.out.println("invalid client");
        throw new Unauthorized("invalid grant");

    }

    @RequestMapping("/user_authentication")
    public UserAuthenticationEndpoint userAuthenticationEndpoint(@RequestParam(defaultValue = "",
            value = "user_code") String userCode) throws BadRequest {

        System.out.println("user login");
        if(validator.getUserCode(userCode)) {
            return new UserAuthenticationEndpoint(serverRequest.getLocation());
        }
        return null;
    }

    @RequestMapping("/Device-Flow-Proxy-Server")
    public String authorizationCodeEndpoint(@RequestParam(defaultValue = "",
            value = "code") String code) throws NoSuchAlgorithmException, IOException, KeyManagementException {
        System.out.println(code);
        tokenRequest.sendRequest(code);
        return "Return To Device";
    }

}
