import ballerinax/java.jdbc;
import ballerina/sql;
import ballerina/log;
import ballerina/http;

function dbGetPersonalization(string org) returns Personalization|error|http:NotFound {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    sql:ParameterizedQuery query = `SELECT org, logoUrl, logoAltText, faviconUrl, primaryColor, secondaryColor from Branding 
    WHERE org = ${org}`;

    Personalization|sql:Error result = dbClient->queryRow(query);

    if result is sql:NoRowsError {
        return http:NOT_FOUND;
    } else if result is sql:Error {
        return handleError(result);
    } else {
        return result;
    }
}

function dbUpdatePersonalization(Personalization personalization) returns Personalization|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    do {
        sql:ParameterizedQuery query = `INSERT INTO Branding (org, logoUrl, logoAltText, faviconUrl, primaryColor, secondaryColor)
            VALUES (${personalization.org}, ${personalization.logoUrl}, ${personalization.logoAltText}, ${personalization.faviconUrl}, 
            ${personalization.primaryColor}, ${personalization.secondaryColor})
            ON DUPLICATE KEY UPDATE logoUrl = VALUES(logoUrl), logoAltText = VALUES(logoAltText), faviconUrl = VALUES(faviconUrl),
            primaryColor = VALUES(primaryColor), secondaryColor = VALUES(secondaryColor);`;
        _ = check dbClient->execute(query);

        Personalization|http:NotFound|error updatedInfo = dbGetPersonalization(personalization.org);

        if updatedInfo is http:NotFound|error {
            return error("Error while updating the org info");
        }
        return updatedInfo;
    }
    on fail error e {
        return handleError(e);
    }
}

function dbDeletePersonalization(string orgId) returns string|()|error {

    jdbc:Client|error dbClient = getConnection();
    if dbClient is error {
        return handleError(dbClient);
    }

    sql:ParameterizedQuery query = `DELETE FROM Branding WHERE org = ${orgId};`;
    sql:ExecutionResult|sql:Error result = dbClient->execute(query);

    if result is sql:Error {
        return handleError(result);
    } else if result.affectedRowCount == 0 {
        return ();
    }

    return "Branding deleted successfully";
}

function handleError(error err) returns error {
    log:printError("Error while processing the request", err);
    return error("Error while processing the request");
}
