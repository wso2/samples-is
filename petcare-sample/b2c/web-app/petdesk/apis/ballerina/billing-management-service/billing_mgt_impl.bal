table<Billing> key(owner) billingRecords = table [];

function addBilling(BillingInfo billingInfo, string owner) returns Billing|error {

    billingRecords.put({owner: owner, cardName: billingInfo.cardName, 
        cardNumber: billingInfo.cardNumber, expiryDate: billingInfo.expiryDate, 
        securityCode: billingInfo.securityCode});
    Billing billingRecord = <Billing>billingRecords[owner];
    Billing billing = getBillingDetails(billingRecord);
    return billing;
}

function getBillingByOwner(string owner) returns Billing|() {

    Billing? billingRecord = billingRecords[owner];

    if billingRecord is () {
        return ();
    }

    return getBillingDetails(billingRecord);
}

function getBillingDetails(Billing billingRecord) returns Billing {

    Billing billing = {
        owner: billingRecord.owner,
        cardName: billingRecord.cardName,
        cardNumber: billingRecord.cardNumber,
        expiryDate: billingRecord.expiryDate,
        securityCode: billingRecord.securityCode
    };

    return billing;
}
