import ballerina/http;

public type InternalServerErrorString record {|
    *http:InternalServerError;
    string body;
|};

public type Billing record {
    *BillingInfo;
    readonly string owner;
};

public type BillingInfo record {
    string cardName?;
    string cardNumber?;
    string expiryDate?;
    string securityCode?;
};
