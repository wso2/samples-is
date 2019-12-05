package sources;

import com.fasterxml.jackson.annotation.JsonProperty;
import parameters.DeviceFlowParameters;

public class DeviceAuthEndpoint {

    private final String deviceCode;
    private final String userCode;
    private final String verificationUri;
    private final String verificationUriComplete;
    private Integer expiresIn;
    private Integer interval;

    //private DeviceFlowParameters deviceFlowParameters = new DeviceFlowParameters();

    public DeviceAuthEndpoint(String deviceCode, String UserCode, String verificationUri,
                              String verificationUriComplete, Integer expiresIn, Integer interval) {

        this.deviceCode = deviceCode;
        this.userCode = UserCode;
        this.verificationUri = verificationUri;
        this.verificationUriComplete = verificationUriComplete;
        this.expiresIn = expiresIn;
        this.interval = interval;

    }

    //get parameters
    @JsonProperty("device_code")
    public String getDeviceCode() {

        return deviceCode;
    }

    @JsonProperty("user_code")
    public String getUserCode() {

        return userCode;
    }

    @JsonProperty("verification_uri")
    public String getVerificationUri() {

        return verificationUri;
    }

    @JsonProperty("verification_uri_complete")
    public String getVerificationUriComplete() {

        return verificationUriComplete;
    }

    @JsonProperty("expires_in")
    public Integer getExpiresIn() {

        return expiresIn;
    }

    @JsonProperty("interval")
    public Integer getInterval() {

        return interval;
    }

}
