/*
 * Copyright (c) 2025, WSO2 LLC. (http://www.wso2.com).
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
 */

package org.wso2.samples.is.rar.ticket.booking.app.validator;

import org.apache.commons.lang.StringUtils;
import org.json.JSONObject;
import org.wso2.carbon.identity.application.authentication.framework.model.AuthenticatedUser;
import org.wso2.carbon.identity.oauth.rar.exception.AuthorizationDetailsProcessingException;
import org.wso2.carbon.identity.oauth.rar.model.AuthorizationDetail;
import org.wso2.carbon.identity.oauth.rar.model.AuthorizationDetails;
import org.wso2.carbon.identity.oauth.rar.model.ValidationResult;
import org.wso2.carbon.identity.oauth2.IdentityOAuth2ServerException;
import org.wso2.carbon.identity.oauth2.rar.core.AuthorizationDetailsProcessor;
import org.wso2.carbon.identity.oauth2.rar.model.AuthorizationDetailsContext;

import java.util.HashMap;
import java.util.Map;

import static org.wso2.samples.is.rar.ticket.booking.app.validator.Constant.ALLOWED_AMOUNT_KEY;
import static org.wso2.samples.is.rar.ticket.booking.app.validator.Constant.BOOKING_CREATION_AUTHORIZATION_PROCESSOR;
import static org.wso2.samples.is.rar.ticket.booking.app.validator.Constant.BOOKING_TYPE_KEY;
import static org.wso2.samples.is.rar.ticket.booking.app.validator.Constant.CURRENCY_KEY;
import static org.wso2.samples.is.rar.ticket.booking.app.validator.Constant.GOLD_CONCERT_BOOKING_LIMIT;
import static org.wso2.samples.is.rar.ticket.booking.app.validator.Constant.GOLD_FILM_BOOKING_LIMIT;
import static org.wso2.samples.is.rar.ticket.booking.app.validator.Constant.LIMIT_KEY;
import static org.wso2.samples.is.rar.ticket.booking.app.validator.Constant.SILVER_FILM_BOOKING_LIMIT;
import static org.wso2.samples.is.rar.ticket.booking.app.validator.Constant.SUPPORTED_CURRENCY;
import static org.wso2.samples.is.rar.ticket.booking.app.validator.Constant.USER_TYPE_CLAIM_MAPPING;

/**
 * Contains operations which are responsible for processing the authorization details of the booking creation request.
 */
public class BookingCreationAuthorizationProcessor implements AuthorizationDetailsProcessor {

    @Override
    public ValidationResult validate(AuthorizationDetailsContext authorizationDetailsContext)
            throws AuthorizationDetailsProcessingException, IdentityOAuth2ServerException {

        JSONObject authzDetailsObject = new JSONObject(authorizationDetailsContext.
                getAuthorizationDetail().getDetails());
        String bookingType = authzDetailsObject.getString(BOOKING_TYPE_KEY);
        AuthenticatedUser authenticatedUser = authorizationDetailsContext.getAuthenticatedUser();
        String accountType = authenticatedUser.getUserAttributes().get(USER_TYPE_CLAIM_MAPPING);
        if (StringUtils.isBlank(accountType) ||
                (StringUtils.equals(accountType, Constant.UserType.SILVER.getUserType()) &&
                        StringUtils.equals(bookingType, Constant.BookingType.CONCERT.getBookingType()))) {
            return new ValidationResult(false, "User is not allowed to create a booking.", null);
        }
        return new ValidationResult(true, "Ticket booking request validation performed Successfully.", null);
    }

    @Override
    public String getType() {

        return BOOKING_CREATION_AUTHORIZATION_PROCESSOR;
    }

    @Override
    public boolean isEqualOrSubset(AuthorizationDetail requestedAuthorizationDetail,
                                   AuthorizationDetails existingAuthorizationDetails) {

        return !existingAuthorizationDetails.getDetailsByType(BOOKING_CREATION_AUTHORIZATION_PROCESSOR).isEmpty();
    }

    @Override
    public AuthorizationDetail enrich(AuthorizationDetailsContext authorizationDetailsContext) {

        JSONObject authzDetailsObject = new JSONObject(authorizationDetailsContext.
                getAuthorizationDetail().getDetails());
        String bookingType = authzDetailsObject.getString(BOOKING_TYPE_KEY);
        AuthenticatedUser authenticatedUser = authorizationDetailsContext.getAuthenticatedUser();
        String accountType = authenticatedUser.getUserAttributes().get(USER_TYPE_CLAIM_MAPPING);

        if (StringUtils.equals(accountType, Constant.UserType.GOLD.getUserType())) {
            if (StringUtils.equals(bookingType, Constant.BookingType.FILM.getBookingType())) {
                assignLimit(GOLD_FILM_BOOKING_LIMIT, authorizationDetailsContext);
            } else if (StringUtils.equals(bookingType, Constant.BookingType.CONCERT.getBookingType())) {
                assignLimit(GOLD_CONCERT_BOOKING_LIMIT, authorizationDetailsContext);
            }
        } else if (StringUtils.equals(accountType, Constant.UserType.SILVER.getUserType())) {
            if (StringUtils.equals(bookingType, Constant.BookingType.FILM.getBookingType())) {
                assignLimit(SILVER_FILM_BOOKING_LIMIT, authorizationDetailsContext);
            }
        }

        return authorizationDetailsContext.getAuthorizationDetail();
    }

    /**
     * Assign the limit to the authorization details.
     *
     * @param limit Limit to be assigned.
     * @param authorizationDetails Authorization details object.
     */
    private void assignLimit(int limit, AuthorizationDetailsContext authorizationDetails) {

        Map<String, Object> limitDetails = new HashMap<>();
        limitDetails.put(LIMIT_KEY, limit);
        limitDetails.put(CURRENCY_KEY, SUPPORTED_CURRENCY);
        authorizationDetails.getAuthorizationDetail().setDetail(ALLOWED_AMOUNT_KEY, limitDetails);
    }
}
