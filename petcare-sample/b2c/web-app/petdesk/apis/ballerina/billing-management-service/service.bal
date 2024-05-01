import ballerina/http;
import ballerina/jwt;

# A service representing a network-accessible API
# bound to port `9091`.
@http:ServiceConfig {
    cors: {
        allowOrigins: ["*"]
    }
}
service / on new http:Listener(9091) {
    resource function get billing(http:Headers headers) returns Billing|http:Ok|http:Unauthorized|http:BadRequest|error? {

        return checkAcr(headers);
    }
    resource function post billing(http:Headers headers, @http:Payload BillingInfo payload) returns Billing|http:Created|error? {
        
        string|error owner = getOwner(headers);
        if owner is error {
            return owner;
        }

        Billing|error result = addBilling(payload, owner);

        return result;
    }
}

function checkAcr(http:Headers headers) returns Billing|http:Ok|http:Unauthorized|http:BadRequest|error? {

    var jwtHeader = headers.getHeader("x-jwt-assertion");
    if jwtHeader is http:HeaderNotFoundError {
        var authHeader = headers.getHeader("Authorization");
        if authHeader is http:HeaderNotFoundError {
            return authHeader;
        } else {
            if (authHeader.startsWith("Bearer ")) {
                jwtHeader = authHeader.substring(7);
            }
        }
    }

    if (jwtHeader is http:HeaderNotFoundError) {
        return jwtHeader;
    }

    [jwt:Header, jwt:Payload] [_, payload] = check jwt:decode(jwtHeader);

    if (payload.hasKey("acr")) {
        if (payload["acr"] == "acr2") {
            return getBillingByOwner(check getOwner(headers));
        } else {
            return http:UNAUTHORIZED;
        }
    } else {
        return http:BAD_REQUEST;
    }
}

function getOwner(http:Headers headers) returns string|error {

    var jwtHeader = headers.getHeader("x-jwt-assertion");
    if jwtHeader is http:HeaderNotFoundError {
        var authHeader = headers.getHeader("Authorization");
        if authHeader is http:HeaderNotFoundError {
            return authHeader;
        } else {
            if (authHeader.startsWith("Bearer ")) {
                jwtHeader = authHeader.substring(7);
            }
        }
    }

    if (jwtHeader is http:HeaderNotFoundError) {
        return jwtHeader;
    }

    [jwt:Header, jwt:Payload] [_, payload] = check jwt:decode(jwtHeader);
    return getOwnerFromPayload(payload);
}

function getOwnerFromPayload(jwt:Payload payload) returns string {

    string? subClaim = payload.sub;
    if subClaim is () {
        subClaim = "Test_Key_User";
    }

    return <string>subClaim;
}
