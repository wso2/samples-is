import ballerina/http;
import ballerinax/mysql;
import ballerina/sql;
import ballerina/log;
import ballerinax/java.jdbc;
import ballerinax/mysql.driver as _;

configurable string dbHost = "localhost";
configurable string dbUsername = "admin";
configurable string dbPassword = "admin";
configurable string dbDatabase = "CHANNEL_DB";
configurable int dbPort = 3306;

table<Personalization> key(org) personalizationRecords = table [];

final mysql:Client|error dbClient;
boolean useDB = false;

function init() returns error? {

    if dbHost != "localhost" && dbHost != "" {
        useDB = true;
    }

    sql:ConnectionPool connPool = {
        maxOpenConnections: 20,
        minIdleConnections: 20,
        maxConnectionLifeTime: 300
    };

    mysql:Options mysqlOptions = {
        connectTimeout: 10
    };

    dbClient = new (dbHost, dbUsername, dbPassword, dbDatabase, dbPort, options = mysqlOptions, connectionPool = connPool);

    if dbClient is sql:Error {
        if (!useDB) {
            log:printInfo("DB configurations are not given. Hence storing the data locally");
        } else {
            log:printError("DB configuraitons are not correct. Please check the configuration", 'error = <sql:Error>dbClient);
            return error("DB configuraitons are not correct. Please check the configuration");
        }
    }

    if useDB {
        log:printInfo("DB configurations are given. Hence storing the data in DB");
    }

}

function getConnection() returns jdbc:Client|error {
    return dbClient;
}

function getPersonalization(string org) returns Personalization|error|http:NotFound {

    if (useDB) {
        return dbGetPersonalization(org);
    } else {
        Personalization? personalization = personalizationRecords[org];
        if personalization is () {
            return http:NOT_FOUND;
        }
        return personalization;
    }
}

function updatePersonalization(string org, Personalization personalization) returns Personalization|error {

    if (useDB) {
        return dbUpdatePersonalization(personalization);
    } else {
        Personalization? oldPersonalizationRecord = personalizationRecords[org];
        if oldPersonalizationRecord !is () {
            _ = personalizationRecords.remove(org);
        }
        personalizationRecords.put({
            ...personalization
        });
        return personalization;
    }
}

function deletePersonalization(string org) returns string|()|error {

    if (useDB) {
        return dbDeletePersonalization(org);
    } else {
        Personalization? oldPersonalizationRecord = personalizationRecords[org];
    if oldPersonalizationRecord !is () {
        _ = personalizationRecords.remove(org);
    }

    return "Branding deleted successfully";
    }
}
