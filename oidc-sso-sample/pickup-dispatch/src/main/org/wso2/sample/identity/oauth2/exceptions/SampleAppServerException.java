package org.wso2.sample.identity.oauth2.exceptions;

public class SampleAppServerException extends Exception {

    public SampleAppServerException(final String message) {
        super(message);
    }

    public SampleAppServerException(final String message, final Throwable ex) {
        super(message, ex);
    }
}
