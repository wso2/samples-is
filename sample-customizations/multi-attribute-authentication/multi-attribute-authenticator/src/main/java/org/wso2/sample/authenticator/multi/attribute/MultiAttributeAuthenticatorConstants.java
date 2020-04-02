/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.wso2.sample.authenticator.multi.attribute;

import java.util.ArrayList;
import java.util.List;

/**
 * Constants used by the AttributeBasedAuthenticator
 */
public class MultiAttributeAuthenticatorConstants {

    public static final String AUTHENTICATOR_NAME = "MultiAttributeAuthenticator";
    public static final String AUTHENTICATOR_FRIENDLY_NAME = "multi-attribute-authenticator";

    public static final String DEFAULT_PROFILE = "default";
    public static final String FOUND_MULTIPLE_USERS_WITH_SAME_IDENTIFIER = "foundMultipleUsersWithSameIdentifier";

    public static final String LOGIN_IDENTIFIER = "loginidentifier";
    public static final String TENANT_DOMAIN = "tenantDomain";
    public static final String EMAIL_CLAIM = "http://wso2.org/claims/emailaddress";

    // Regex based identifier selection
    public static final String USERNAME_CLAIM = "http://wso2.org/claims/username";
    public static final String EMAIL_REGEX = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";

    public static final String MOBILE_CLAIM = "http://wso2.org/claims/mobile";
    public static final String MOBILE_REGEX = "^\\+?(\\d{3})*[0-9,\\-]{8,}$";

}
