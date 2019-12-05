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

/**
 * Validates registration.
 */
public class RegistrationValidator {

    private RegistrationValidator() {

    }

    private static RegistrationValidator registrationValidatorInstance = new RegistrationValidator();

    public static RegistrationValidator getInstance() {

        if (registrationValidatorInstance == null) {

            synchronized (RegistrationValidator.class) {

                if (registrationValidatorInstance == null) {

                    /* instance will be created at request time */
                    registrationValidatorInstance = new RegistrationValidator();
                }
            }
        }
        return registrationValidatorInstance;

    }

    /**
     * Validates registration.
     */
    public Boolean validate(String appname, String password, String mode) {

        return true;
        // TODO: 8/12/19 have to validate the client request for duplicates.
    }
}
