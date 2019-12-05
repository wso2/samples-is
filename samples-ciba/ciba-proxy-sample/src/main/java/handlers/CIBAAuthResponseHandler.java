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

package handlers;

import ciba.proxy.server.servicelayer.ServerRequestHandler;
import cibaparameters.CIBAParameters;
import com.nimbusds.jose.Payload;
import com.nimbusds.jwt.JWTClaimsSet;
import configuration.ConfigurationFile;
import dao.DaoFactory;
import transactionartifacts.CIBAauthRequest;
import transactionartifacts.CIBAauthResponse;
import transactionartifacts.PollingAtrribute;

import java.time.ZonedDateTime;
import java.util.logging.Logger;

/**
 * Handles the CIBA authentication responses.
 */
public class CIBAAuthResponseHandler implements Handlers {

    private static final Logger LOGGER = Logger.getLogger(CIBAAuthResponseHandler.class.getName());
    DaoFactory daoFactory = DaoFactory.getInstance();
    CIBAParameters cibaparameters = CIBAParameters.getInstance();

    private CIBAAuthResponseHandler() {

    }

    private static CIBAAuthResponseHandler cibaAuthResponseHandlerInstance = new CIBAAuthResponseHandler();

    public static CIBAAuthResponseHandler getInstance() {

        if (cibaAuthResponseHandlerInstance == null) {

            synchronized (CIBAAuthResponseHandler.class) {

                if (cibaAuthResponseHandlerInstance == null) {

                    /* instance will be created at request time */
                    cibaAuthResponseHandlerInstance = new CIBAAuthResponseHandler();
                }
            }
        }
        return cibaAuthResponseHandlerInstance;

    }

    /**
     * Creating authentication response.
     *
     * @param authReqId Ciba Authentication request identifier.
     * @return Payload of authentication response.
     */
    public Payload createAuthResponse(String authReqId) {

        CIBAauthResponse cibAauthResponse = new CIBAauthResponse();

        // Creating authentication response for the request.
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .claim("auth_req_id", authReqId)
                .claim("expires_in", cibaparameters.getExpires_in())
                .claim("interval", cibaparameters.getInterval())
                .build();

        Payload responsepayload = new Payload(claims.toJSONObject());

        // Creating authentication response object and store to memory.
        cibAauthResponse.setAuthReqId(authReqId);
        cibAauthResponse.setExpiresIn(cibaparameters.getExpires_in());
        cibAauthResponse.setInterval(cibaparameters.getInterval());
        this.storeAuthResponse(authReqId, cibAauthResponse);

        LOGGER.info("CIBA Authentication Response payload created and forwarded");
        return responsepayload;

    }

    /**
     * Storing auth response to store.
     *
     * @param authReqId        Ciba Authentication request identifier.
     * @param cibAauthResponse Ciba Authentication response.
     */
    public void storeAuthResponse(String authReqId, CIBAauthResponse cibAauthResponse) {

        daoFactory.getArtifactStoreConnector(ConfigurationFile.getInstance().getSTORE_CONNECTOR_TYPE()).
                addAuthResponse(authReqId, cibAauthResponse);

        LOGGER.info("CIBA Authentication Response stored in Auth Response Store.");
        System.out
                .println("Working in perfection" + daoFactory.getArtifactStoreConnector(ConfigurationFile.getInstance().
                        getSTORE_CONNECTOR_TYPE()).getAuthResponse(authReqId).getExpiresIn());

        // Store polling attributes.
        storePollingAttribute(authReqId);

        // Triggering the server to initiate the flow.
        triggerServerRequestHandler(authReqId);

    }

    /**
     * Trigger server authorize request handler to fire authorize request.
     *
     * @param authReqId Ciba Authentication request identifier.
     */
    private void triggerServerRequestHandler(String authReqId) {

        CIBAauthRequest cibAauthRequest = daoFactory.getArtifactStoreConnector(ConfigurationFile.getInstance().
                getSTORE_CONNECTOR_TYPE()).getAuthRequest(authReqId);

        // Initiate Identity server communication.
        ServerRequestHandler.getInstance().initiateServerCommunication(cibAauthRequest, authReqId);
    }

    /**
     * Store polling attributes in the store.
     *
     * @param authReqId Ciba Authentication request identifier.
     */
    private void storePollingAttribute(String authReqId) {

        long currentTime = ZonedDateTime.now().toInstant().toEpochMilli();

        PollingAtrribute pollingAtrribute = new PollingAtrribute();
        pollingAtrribute.setAuth_req_id(authReqId);
        pollingAtrribute.setExpiresIn(cibaparameters.getExpires_in() * 1000);
        pollingAtrribute.setIssuedTime(currentTime);
        pollingAtrribute.setLastPolledTime(currentTime);
        pollingAtrribute.setPollingInterval(cibaparameters.getInterval() * 1000);

        if (ConfigurationFile.getInstance().getFLOW_MODE().equalsIgnoreCase("ping")) {
            pollingAtrribute.setNotificationIssued(false);
        } else if (ConfigurationFile.getInstance().getFLOW_MODE().equalsIgnoreCase("poll")) {
            pollingAtrribute.setNotificationIssued(true);
        } else {
            //do nothing
        }

        daoFactory.getArtifactStoreConnector(ConfigurationFile.getInstance().getSTORE_CONNECTOR_TYPE()).
                addPollingAttribute(authReqId, pollingAtrribute);
    }
}
