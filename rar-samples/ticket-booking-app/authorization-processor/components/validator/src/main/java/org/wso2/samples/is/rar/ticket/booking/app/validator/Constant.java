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

import org.wso2.carbon.identity.application.common.model.ClaimMapping;

/**
 * Constants used for ticket booking authorization details processing.
 */
public class Constant {

    /**
     * Private constructor to prevent instantiation.
     */
    private Constant() {}

    /**
     * Type name of the booking creation authorization processor.
     */
    public static final String BOOKING_CREATION_AUTHORIZATION_PROCESSOR = "booking_creation";

    /**
     * Type of users allowed for booking creation.
     */
    public enum UserType {
        SILVER("Silver"),
        GOLD("Gold");

        private final String userType;

        UserType(String userType) {
            this.userType = userType;
        }

        public String getUserType() {
            return userType;
        }
    }

    /**
     * Ticket booking types.
     */
    public enum BookingType {
        FILM("film"),
        CONCERT("concert");

        private final String bookingType;

        BookingType(String bookingType) {
            this.bookingType = bookingType;
        }

        public String getBookingType() {
            return bookingType;
        }
    }

    /**
     * Booking limits for each user type.
     */
    public static final int SILVER_FILM_BOOKING_LIMIT = 50;
    public static final int GOLD_FILM_BOOKING_LIMIT = 500;
    public static final int GOLD_CONCERT_BOOKING_LIMIT = 1000;

    /**
     * Claim mappings for user type.
     */
    public static final ClaimMapping USER_TYPE_CLAIM_MAPPING =
            ClaimMapping.build("accountType", "accountType", null, false);

    /**
     * Key name for the booking type.
     */
    public static final String BOOKING_TYPE_KEY = "bookingType";

    /**
     * Key name for the limit.
     */
    public static final String LIMIT_KEY = "limit";

    /**
     * Key name for the currency.
     */
    public static final String CURRENCY_KEY = "currency";
    
    /**
     * Key name for the allowed amount object.
     */
    public static final String ALLOWED_AMOUNT_KEY = "allowedAmount";

    /**
     * Supported currency.
     */
    public static final String SUPPORTED_CURRENCY = "USD";
}
