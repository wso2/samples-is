package org.wso2.sample.identity.oauth2;

public class ClientAppException extends Exception {

    public ClientAppException(String message) {

        super(message);
    }

    public ClientAppException(String message, Throwable cause) {

        super(message, cause);
    }

}
