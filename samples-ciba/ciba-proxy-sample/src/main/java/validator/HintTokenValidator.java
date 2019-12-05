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

import net.minidev.json.JSONObject;

/**
 * Validate hint tokens.
 */
public class HintTokenValidator {

    private HintTokenValidator() {

    }

    private static HintTokenValidator hintTokenValidatorInstance = new HintTokenValidator();

    public static HintTokenValidator getInstance() {

        if (hintTokenValidatorInstance == null) {

            synchronized (HintTokenValidator.class) {

                if (hintTokenValidatorInstance == null) {

                    /* instance will be created at request time */
                    hintTokenValidatorInstance = new HintTokenValidator();
                }
            }
        }
        return hintTokenValidatorInstance;

    }

    public boolean validateLoginHintToken(JSONObject loginHintToken) {
        // typecasting obj to JSONObject
        JSONObject login_hint_token = (JSONObject) loginHintToken;
        // TODO: 8/4/19 Implement this validation.
        return true;
    }

    public boolean validateIDTokenHint(JSONObject idTokenHint) {
        // TODO: 8/4/19 Implement this validation.
        return true;
    }
}
