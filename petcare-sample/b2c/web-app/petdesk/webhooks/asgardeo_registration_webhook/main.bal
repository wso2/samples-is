import ballerinax/trigger.asgardeo;
import ballerina/log;
import ballerinax/salesforce;
import ballerina/http;

// Create Salesforce client configuration by reading from environment.
configurable string salesforceAppClientId = ?;
configurable string salesforceAppClientSecret = ?;
configurable string salesforceAppRefreshToken = ?;
configurable string salesforceAppRefreshUrl = ?;
configurable string salesforceAppBaseUrl = ?;

// Using direct-token config for client configuration
salesforce:ConnectionConfig sfConfig = {
    baseUrl: salesforceAppBaseUrl,
    auth: {
        clientId: salesforceAppClientId,
        clientSecret: salesforceAppClientSecret,
        refreshToken: salesforceAppRefreshToken,
        refreshUrl: salesforceAppRefreshUrl
    }
};

configurable asgardeo:ListenerConfig config = ?;

listener http:Listener httpListener = new(8090);
listener asgardeo:Listener webhookListener =  new(config,httpListener);

service asgardeo:RegistrationService on webhookListener {

    remote function onAddUser(asgardeo:AddUserEvent event ) returns error? {

        salesforce:Client baseClient = check new (sfConfig);

        log:printInfo(event.toJsonString());
        
        json responseData = event.eventData.toJson();

        map<json> mj = <map<json>> responseData;
        map<json> userClaims = <map<json>> mj.get("claims");
        
        string lastName = <string>userClaims["http://wso2.org/claims/lastname"];
        string firstName = <string>userClaims["http://wso2.org/claims/givenname"];
        string email = <string>userClaims["http://wso2.org/claims/emailaddress"];

        record {} leadRecord = {
            "Company": string `${firstName}_${lastName}`,
            "Email": email,
            "FirstName": firstName,
            "LastName": lastName
        };

        salesforce:CreationResponse|error res = baseClient->create("Lead", leadRecord);

        if res is salesforce:CreationResponse {
            log:printInfo("Lead Created Successfully. Lead ID : " + res.id);
        } else {
            log:printError(msg = res.message());
        }
    }

    remote function onConfirmSelfSignup(asgardeo:GenericEvent event ) returns error? {

        log:printInfo(event.toJsonString());
    }

    remote function onAcceptUserInvite(asgardeo:GenericEvent event ) returns error? {

        log:printInfo(event.toJsonString());
    }
}

service /ignore on httpListener {}

