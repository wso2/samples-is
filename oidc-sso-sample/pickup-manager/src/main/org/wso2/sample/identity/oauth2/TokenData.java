package org.wso2.sample.identity.oauth2;

public class TokenData {

    private String accessToken;
    private String idToken;

    public String getAccessToken() {

        return accessToken;
    }

    public void setAccessToken(String accessToken) {

        this.accessToken = accessToken;
    }

    public String getIdToken() {

        return idToken;
    }

    public void setIdToken(String idToken) {

        this.idToken = idToken;
    }
}
