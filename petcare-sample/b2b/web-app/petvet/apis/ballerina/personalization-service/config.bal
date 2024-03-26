import ballerina/os;

public string issuer = check getValueFromEnvVariables("ISSUER", "https://localhost:9443/t/carbon.super/oauth2/token");
public string jwksUrl = check getValueFromEnvVariables("JWKS_URL", "https://localhost:9443/t/carbon.super/oauth2/jwks");

function getValueFromEnvVariables(string variable, string defaultValue) returns string {
    string value = os:getEnv(variable);
    return value != "" ? value : defaultValue;
}
