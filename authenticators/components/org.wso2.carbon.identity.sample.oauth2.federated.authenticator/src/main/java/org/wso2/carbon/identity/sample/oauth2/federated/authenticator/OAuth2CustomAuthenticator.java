/*******************************************************************************
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
 ******************************************************************************/

package org.wso2.carbon.identity.sample.oauth2.federated.authenticator;

import org.wso2.carbon.identity.application.authenticator.oauth2.Oauth2GenericAuthenticator;
import org.wso2.carbon.identity.application.common.model.Property;

import java.util.ArrayList;
import java.util.List;

import static org.wso2.carbon.identity.sample.oauth2.federated.authenticator.OAuth2CustomAuthenticatorConstants.*;

/**
 * This class is used to create an OAuth2 Custom Authenticator as an outbound authenticator.
 */
public class OAuth2CustomAuthenticator extends Oauth2GenericAuthenticator {

    private static final long serialVersionUID = 6614257960044886319L;

    @Override
    public String getFriendlyName() {

        return AUTHENTICATOR_FRIENDLY_NAME;
    }

    @Override
    public String getName() {

        return AUTHENTICATOR_NAME;
    }

    // TODO: Override buildClaims to match the response of respective OAuth2 identity provider

    @Override
    public List<Property> getConfigurationProperties() {

        List<Property> configProperties = new ArrayList<>();

        Property clientId = new Property();
        clientId.setName(CLIENT_ID);
        clientId.setDisplayName(CLIENT_ID_DP);
        clientId.setRequired(true);
        clientId.setDescription(CLIENT_ID_DESC);
        clientId.setDisplayOrder(1);
        configProperties.add(clientId);

        Property clientSecret = new Property();
        clientSecret.setName(CLIENT_SECRET);
        clientSecret.setDisplayName(CLIENT_SECRET_DP);
        clientSecret.setRequired(true);
        clientSecret.setConfidential(true);
        clientSecret.setDescription(CLIENT_SECRET_DESC);
        clientSecret.setDisplayOrder(2);
        configProperties.add(clientSecret);

        Property callbackUrl = new Property();
        callbackUrl.setName(CALLBACK_URL);
        callbackUrl.setDisplayName(CALLBACK_URL_DP);
        callbackUrl.setRequired(true);
        callbackUrl.setDescription(CALLBACK_URL_DESC);
        callbackUrl.setDisplayOrder(3);
        configProperties.add(callbackUrl);

        Property authorizationUrl = new Property();
        authorizationUrl.setName(AUTHZ_URL);
        authorizationUrl.setDisplayName(AUTHZ_URL_DP);
        authorizationUrl.setRequired(true);
        authorizationUrl.setDescription(AUTHZ_URL_DESC);
        authorizationUrl.setDisplayOrder(4);
        configProperties.add(authorizationUrl);

        Property tokenUrl = new Property();
        tokenUrl.setName(TOKEN_URL);
        tokenUrl.setDisplayName(TOKEN_URL_DP);
        tokenUrl.setRequired(true);
        tokenUrl.setDescription(TOKEN_URL_DESC);
        tokenUrl.setDisplayOrder(5);
        configProperties.add(tokenUrl);

        Property userInfoUrl = new Property();
        userInfoUrl.setName(USER_INFO_URL);
        userInfoUrl.setDisplayName(USER_INFO_URL_DP);
        userInfoUrl.setRequired(true);
        userInfoUrl.setDescription(USER_INFO_URL_DESC);
        userInfoUrl.setDisplayOrder(6);
        configProperties.add(userInfoUrl);

        return configProperties;
    }
}
