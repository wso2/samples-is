package sources;

public class TokenEndpoint {

    private String accessToken;
    private String tokenType;
    private Integer expiresIn;

    public TokenEndpoint(String accessToken, String tokenType, Integer expiresIn) {

        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;

    }

    //get parameters
    public String getAccess_token() {

        return accessToken;
    }

    public String getToken_type() {

        return tokenType;
    }

    public Integer getExpires_in() {

        return expiresIn;
    }

}
