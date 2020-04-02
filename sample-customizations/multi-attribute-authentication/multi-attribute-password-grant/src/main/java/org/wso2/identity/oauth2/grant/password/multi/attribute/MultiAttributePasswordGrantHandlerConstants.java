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
package org.wso2.identity.oauth2.grant.password.multi.attribute;

public class MultiAttributePasswordGrantHandlerConstants {

    public static final String EMAIL_CLAIM = "http://wso2.org/claims/emailaddress";
    public static final String USERNAME_CLAIM = "http://wso2.org/claims/username";
    public static final String MOBILE_CLAIM = "http://wso2.org/claims/mobile";

    public static final String EMAIL_REGEX = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
    public static final String MOBILE_REGEX = "^[0-9]*$";
    public static final String DEFAULT_PROFILE = "default";
    public static final String TENANT_DOMAIN = "tenantDomain";
}
