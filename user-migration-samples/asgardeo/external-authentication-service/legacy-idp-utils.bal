// Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//
// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied. See the License for the
// specific language governing permissions and limitations
// under the License.

import ballerina/http;
import ballerina/log;

// Configurable parameters.
configurable string legacyIDPUrl = ?;

# Method to authenticate the user.
# 
# + user - The user object.
# + return - An error if the authentication fails.
isolated function authenticateUser(User user) returns error? {

    // Create a new HTTP client to connect to the external IDP.
    final http:Client legacyIDPClient = check new (legacyIDPUrl, {
        auth: {
            username: user.username,
            password: user.password
        },
        secureSocket: {
            enable: false
        }
    });

    // Authenticate the user by invoking the external IDP.
    // In this example, the external authentication is done invoking the SCIM2 Me endpoint.
    // You may replace this with an implementation that suits your IDP.
    http:Response response = check legacyIDPClient->get("/scim2/Me");

    // Check if the authentication was unsuccessful.
    if response.statusCode == http:STATUS_UNAUTHORIZED {
        log:printError(string `Authentication failed for the user: ${user.id}. Invalid credentials`);
        return error("Invalid credentials");
    } else if response.statusCode != http:STATUS_OK {
        log:printError(string `Authentication failed for the user: ${user.id}.`);
        return error("Authentication failed");
    }
}
