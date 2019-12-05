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

import exceptions.InternalServerErrorException;
import net.minidev.json.JSONObject;
import transactionartifacts.TokenResponse;

import java.util.logging.Logger;

/**
 * Validates token response obtained from IS.
 */
public class TokenResponseValidator {

    private static final Logger LOGGER = Logger.getLogger(TokenResponseValidator.class.getName());

    private TokenResponseValidator() {
        // this.run();
    }

    private static TokenResponseValidator tokenResponseValidatorInstance = new TokenResponseValidator();

    public static TokenResponseValidator getInstance() {

        if (tokenResponseValidatorInstance == null) {

            synchronized (TokenResponseValidator.class) {

                if (tokenResponseValidatorInstance == null) {

                    /* instance will be created at request time */
                    tokenResponseValidatorInstance = new TokenResponseValidator();
                }
            }
        }
        return tokenResponseValidatorInstance;
    }

    public TokenResponse validateTokens(JSONObject token) {

        TokenResponse tokenResponse = new TokenResponse();


        // Validation for refresh token.
        if ((String.valueOf(token.get("refresh_token")).isEmpty())) {
            tokenResponse = null;

        } else if (token.get("refresh_token") == null) {
            tokenResponse = null;

        } else {
            tokenResponse.setRefreshToken(String.valueOf(token.get("refresh_token")));
        }

        // Validation for id-token.
        try {
            if (String.valueOf(token.get("id_token")).isEmpty()) {

                tokenResponse = null;
                LOGGER.warning("Invalid Token Parameters.Id_token not found.");
                throw new InternalServerErrorException("Invalid Token Parameters.Id_token not found.");

            } else if (token.get("id_token") == null) {
                tokenResponse = null;
                LOGGER.warning("Invalid Token Parameters.Id_token not found.");
                throw new InternalServerErrorException("Invalid Token Parameters.Id_token not found.");
            } else {
                tokenResponse.setIdToken(String.valueOf(token.get("id_token")));
            }
        } catch (InternalServerErrorException internalServerErrorException) {
            internalServerErrorException.getMessage();
        }

        // Validation for access-token.
        try {
            if (String.valueOf(token.get("access_token")).isEmpty()) {
                tokenResponse = null;
                LOGGER.warning("Invalid Token Parameters.Access_token not found.");
                throw new InternalServerErrorException("Invalid Token Parameters.");

            } else if (token.get("access_token") == null) {
                tokenResponse = null;
                LOGGER.warning("Invalid Token Parameters.Access_token not found.");
                throw new InternalServerErrorException("Invalid Token Parameters.Access_token not found.");

            } else {
                tokenResponse.setAccessToken(String.valueOf(token.get("access_token")));
            }

        } catch (InternalServerErrorException internalServerErrorException) {
            internalServerErrorException.getMessage();
        }

        // Validation for expires_in.
        try {
            if (String.valueOf(token.get("expires_in")).isEmpty()) {
                tokenResponse = null;
                LOGGER.warning("Invalid Token Parameters.'expires_in' not found.");
                throw new InternalServerErrorException("Invalid Token Parameters.'expires_in' not found.");
            } else if (token.get("expires_in") == null) {
                tokenResponse = null;
                LOGGER.warning("Invalid Token Parameters.'expires_in' not found.");
                throw new InternalServerErrorException("Invalid Token Parameters.'expires_in' not found.");

            } else {
                tokenResponse.setTokenExpirein(Long.parseLong(String.valueOf(token.get("expires_in"))));
            }

        } catch (InternalServerErrorException internalServerErrorException) {
            internalServerErrorException.getMessage();
        }

        // Validation for token_type.
        try {
            if (String.valueOf(token.get("token_type")).isEmpty()) {
                tokenResponse = null;
                LOGGER.warning("Invalid Token Parameters.'token_type' not found.");
                throw new InternalServerErrorException("Invalid Token Parameters.'token_type' not found.");
            } else if (token.get("token_type") == null) {
                tokenResponse = null;
                LOGGER.warning("Invalid Token Parameters.'token_type' not found.");
                throw new InternalServerErrorException("Invalid Token Parameters.'token_type' not found.");

            } else {
                tokenResponse.setTokenType(String.valueOf(token.get("token_type")));
            }

        } catch (InternalServerErrorException internalServerErrorException) {
            internalServerErrorException.getMessage();
        }

        return tokenResponse;
    }
}
