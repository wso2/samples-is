package sources;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserAuthenticationEndpoint {

    private final String location;

    public UserAuthenticationEndpoint(String location){
        this.location = location;
    }

    @JsonProperty("location")
    public String getLocation() {

        return location;
    }
}
