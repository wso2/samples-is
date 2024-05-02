import ballerina/http;

public type InternalServerErrorString record {|
    *http:InternalServerError;
    string body;
|};

public type Account record {
    string accountId?;
    boolean isUpgraded?;
};

public type LeadInfo record {
    string username?;
    string email?;
};
