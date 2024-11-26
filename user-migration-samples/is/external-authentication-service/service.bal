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
import ballerina/uuid;

// In this example, authentication results are stored in an in-memory map and hence supports only 
// single-replica deployments. This is not recommended for production use. You need to replace this 
// with a high available implementation that suits your requirement (i.e. DB or cache service).
isolated map<AuthenticationContext> userAuthContextMap = {};

isolated function pushToContext(string contextId, AuthenticationContext context) {

    lock {
        userAuthContextMap[contextId] = context;
    }
}

isolated function isContextExists(string contextId) returns boolean {

    lock {
        return userAuthContextMap.hasKey(contextId);
    }
}

isolated function popFromContext(string contextId) returns AuthenticationContext {

    lock {
        return userAuthContextMap.remove(contextId);
    }
}

// Authentication service implementation.
service / on new http:Listener(9090) {

    resource function post start\-authentication(http:Caller caller, User user) {

        string contextId = uuid:createType1AsString();

        log:printInfo(string `${contextId}: Received authentication request for the user: ${user.id}.`);

        do {
            // Create future to authenticate user with the external IDP.
            future<error?> authStatusFuture = start authenticateUser(user.cloneReadOnly());

            // Return request received response to Identity Server.
            check caller->respond(<http:Ok>{
                body: {
                    message: "Received",
                    contextId: contextId
                }
            });

            // Retrieve user from Identity Server for the given user id.
            // In this example, username is validated back with Identity Server to ensure it is a valid user.
            // You may replace this with your own logic.
            future<IdentityServerUser|error> identityServerUserFuture = start getIdentityServerUser(user.id);

            // Wait for the response from external legacy IDP. If no error, it is assumed as 
            // a successful authentication.
            error? authStatus = check wait authStatusFuture;

            log:printInfo(string `${contextId}: User authenticated successfully with external IDP.`);

            // Wait for the response of Identity Server invocation.
            IdentityServerUser|error identityServerUser = check wait identityServerUserFuture;
            log:printInfo(string `${contextId}: User retrieved from Identity Server.`);

            if identityServerUser is error {
                log:printInfo(string `${contextId}: Error occurred while retrieving user from Identity Server.`, 
                    identityServerUser);
                fail error("Something went wrong.");
            }

            // Validate the username.
            if identityServerUser.username !== user.username {
                log:printInfo(string `${contextId}: Invalid username provided for the user: ${user.id}.`);
                fail error("Invalid credentials");
            }
            log:printInfo(string `${contextId}: Username validated successfully.`);

            log:printInfo(string `${contextId}: External authentication successful for the user: ${user.id}.`);

            // Add successful authentication result to the map.
            AuthenticationContext context = {
                username: user.username,
                status: "SUCCESS",
                message: "Authenticated successful"
            };
            pushToContext(contextId, context);

        } on fail error err {
            if err.message() == "Invalid credentials" {
                log:printInfo(string `${contextId}: Invalid credentials provided for the user: ${user.id}.`);

                AuthenticationContext context = {
                    username: user.username,
                    status: "FAIL",
                    message: "Invalid credentials"
                };
                pushToContext(contextId, context);
            } else {
                log:printError(string `${contextId}: Error occurred while authenticating the user: ${user.id}.`, err);

                AuthenticationContext context = {
                    username: user.username,
                    status: "FAIL",
                    message: "Something went wrong"
                };
                pushToContext(contextId, context);
            }
        }
    }

    resource function post authentication\-status(AuthenticationStatusRequest authStatus) 
        returns http:Ok|http:BadRequest {

        string contextId = authStatus.contextId;
        string username = authStatus.username;

        log:printInfo(string `Received authentication status check for the context id: ${contextId}.`);

        if (isContextExists(contextId)) {
            AuthenticationContext? context = popFromContext(contextId);

            if (context == null) {
                log:printInfo(
                    string `${contextId}: Error while retrieving the authentication status. Context not found.`);

                return <http:BadRequest>{
                    body: {
                        message: "Invalid context id"
                    }
                };
            }

            log:printInfo(string `${contextId}: Authentication status retrieved successfully.`);

            if (context.username == username) {
                log:printInfo(string `${contextId}: Username validated successfully.`);

                return <http:Ok>{
                    body: {
                        status: context.status,
                        message: context.message
                    }
                };
            } else {
                log:printInfo(string `${contextId}: Provided username does NOT match with the context username.`);

                return <http:Ok>{
                    body: {
                        status: "FAIL",
                        message: "Invalid request"
                    }
                };
            }
        } else {
            log:printInfo(string `Authentication status not found for the context id: ${contextId}.`);

            return <http:BadRequest>{
                body: {
                    message: "Invalid context id"
                }
            };
        }
    }

    resource function get authentication\-status(string contextId) returns http:Ok {

        log:printInfo(string `Received status polling query for the context id: ${contextId}.`);

        if (isContextExists(contextId)) {
            log:printInfo(string `${contextId}: Context found for the status query.`);

            return <http:Ok>{
                body: {
                    status: "COMPLETE"
                }
            };
        } else {
            log:printInfo(string `${contextId}: Context not found for the status query.`);

            return <http:Ok>{
                body: {
                    status: "PENDING"
                }
            };
        }
    }
}
