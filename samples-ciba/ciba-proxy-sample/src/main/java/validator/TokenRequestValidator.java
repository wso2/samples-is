/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package validator;

import cibaparameters.CIBAParameters;
import configuration.ConfigurationFile;
import dao.ArtifactStoreConnectors;
import dao.DaoFactory;
import exceptions.BadRequestException;
import exceptions.UnAuthorizedRequestException;
import handlers.TokenResponseHandler;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import tempErrorCache.TempErrorCache;
import transactionartifacts.PollingAtrribute;
import transactionartifacts.TokenRequest;

import java.time.ZonedDateTime;
import java.util.logging.Logger;

/**
 * Validates token request.
 */
public class TokenRequestValidator {

    private DaoFactory daoFactory = DaoFactory.getInstance();
    private static final Logger LOGGER = Logger.getLogger(TokenRequestValidator.class.getName());

    private TokenRequestValidator() {

    }

    private static TokenRequestValidator tokenRequestValidatorInstance = new TokenRequestValidator();

    public static TokenRequestValidator getInstance() {

        if (tokenRequestValidatorInstance == null) {

            synchronized (TokenRequestValidator.class) {

                if (tokenRequestValidatorInstance == null) {

                    /* instance will be created at request time */
                    tokenRequestValidatorInstance = new TokenRequestValidator();
                }
            }
        }
        return tokenRequestValidatorInstance;

    }

    /**
     * Validates token request.
     *
     * @param authReqId Authentication request identifier.
     * @param grantType grantType for the token.
     */
    public TokenRequest validateTokenRequest(String authReqId, String grantType) {

        TokenRequest tokenRequest = new TokenRequest();
        ArtifactStoreConnectors artifactStoreConnectors =
                daoFactory.getArtifactStoreConnector(ConfigurationFile.getInstance().getSTORE_CONNECTOR_TYPE());

        CIBAParameters cibaparameters = CIBAParameters.getInstance();

        try {
            if (authReqId.isEmpty() || authReqId.equals("") || authReqId == null) {
                tokenRequest = null;
                LOGGER.info("Invalid auth_req_id");

                throw new UnAuthorizedRequestException("Invalid auth_req_id");

            } else if (artifactStoreConnectors.getAuthResponse(authReqId) == null) {
                LOGGER.info("Invalid auth_req_id");

                throw new UnAuthorizedRequestException("Invalid auth_req_id");

            } else if (grantType.isEmpty()) {
                tokenRequest = null;
                LOGGER.info("Improper grant_type");
                throw new BadRequestException("Improper grant_type");

            } else {
                //check whether provided auth_req_id is valid and provided by the system and has relevant auth response

                if (!(artifactStoreConnectors.getAuthResponse(authReqId) == null) &&
                        (grantType.equals(cibaparameters.getGrant_type()))) {

                    long expiryduration = artifactStoreConnectors.getPollingAttribute(authReqId).getExpiresIn();
                    long issuedtime = artifactStoreConnectors.getPollingAttribute(authReqId).getIssuedTime();
                    long currenttime = ZonedDateTime.now().toInstant().toEpochMilli();
                    long interval = artifactStoreConnectors.getPollingAttribute(authReqId).getPollingInterval();
                    long lastpolltime = artifactStoreConnectors.getPollingAttribute(authReqId).getLastPolledTime();
                    Boolean notificationIssued =
                            artifactStoreConnectors.getPollingAttribute(authReqId).getNotificationIssued();
                    System.out.println("notification status : " + notificationIssued);
                    try {
                        if (!notificationIssued) {
                            LOGGER.info("Improper Flow. Subscribed to Ping but yet Polling");
                            throw new BadRequestException("Improper Flow. Subscribed to Ping but yet Polling");

                        } else if (currenttime > issuedtime + expiryduration + 5) {
                            tokenRequest = null;
                            LOGGER.info("Expired Token");
                            throw new BadRequestException("Expired Token");

                            //checking for frequency of poll
                        } else if (currenttime - lastpolltime < interval) {

                            artifactStoreConnectors.removePollingAttribute(authReqId);

                            PollingAtrribute pollingAtrribute2 = new PollingAtrribute();
                            pollingAtrribute2.setIssuedTime(issuedtime);
                            pollingAtrribute2.setLastPolledTime(currenttime);
                            pollingAtrribute2.setPollingInterval(5000);
                            pollingAtrribute2.setAuth_req_id(authReqId);
                            pollingAtrribute2.setExpiresIn(expiryduration);
                            System.out.println("notification status 2: " + notificationIssued);
                            pollingAtrribute2.setNotificationIssued(notificationIssued);
                            // TODO: 8/31/19   pollingAtrribute2.setNotificationIssued();

                            artifactStoreConnectors.addPollingAttribute(authReqId, pollingAtrribute2);
                            //updating the polling frequency -deleting and adding new object with updated values
                            tokenRequest = null;
                            throw new BadRequestException("Slow Down");
                        } else {
                            if (TempErrorCache.getInstance().getAuthenticationResponse(authReqId).equals("Sucess") ||
                                    TempErrorCache.getInstance().getAuthenticationResponse(authReqId)
                                            .equals("RequestSent")) {

                                if (TokenResponseHandler.getInstance().checkTokenReceived(authReqId)) {
                                    //check for the reception of token is handled here
                                    tokenRequest.setGrant_type(grantType);
                                    tokenRequest.setAuth_req_id(authReqId);

                                    //storing token request
                                    artifactStoreConnectors.addTokenRequest(authReqId, tokenRequest);

                                    artifactStoreConnectors.removePollingAttribute(authReqId);

                                    PollingAtrribute pollingAtrribute3 = new PollingAtrribute();
                                    pollingAtrribute3.setIssuedTime(issuedtime);
                                    pollingAtrribute3.setLastPolledTime(currenttime);
                                    pollingAtrribute3.setPollingInterval(interval);
                                    pollingAtrribute3.setAuth_req_id(authReqId);
                                    pollingAtrribute3.setExpiresIn(expiryduration);
                                    pollingAtrribute3.setNotificationIssued(notificationIssued);

                                    artifactStoreConnectors.addPollingAttribute(authReqId, pollingAtrribute3);
                                    //updating last polled time
                                } else {
                                    tokenRequest = null;
                                    throw new BadRequestException("authorization pending");
                                }
                            } else {
                                System.out.println("Not authenticated");
                                return null;
                            }
                            return tokenRequest;
                        }
                    } catch (BadRequestException badrequest) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, badrequest.getMessage());
                    }
                }
            }
        } catch (UnAuthorizedRequestException unAuthorizedRequestException) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, unAuthorizedRequestException.getMessage());
        } catch (BadRequestException badRequestException) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, badRequestException.getMessage());
        }
        return tokenRequest;
    }
}
