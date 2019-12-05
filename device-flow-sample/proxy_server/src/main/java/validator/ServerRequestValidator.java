package validator;

import proxyseverconnect.ServerRequest;

import java.io.IOException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

public class ServerRequestValidator {

    public ServerRequestValidator() throws NoSuchAlgorithmException, IOException, KeyManagementException {

    }

    private ServerRequest serverRequest = new ServerRequest();


    public boolean getServerValidate(String clientId) {
        return serverRequest.getLocation().equals("[https://localhost:9443/authenticationendpoint/oauth2_error.do?" +
                "oauthErrorCode=invalid_client&oauthErrorMsg=Cannot+find+an+application+associated+with+the+given+" +
                "consumer+key+%3A+" + clientId + "]");
    }
}
