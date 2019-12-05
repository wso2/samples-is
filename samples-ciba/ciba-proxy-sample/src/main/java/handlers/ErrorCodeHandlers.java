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

import com.nimbusds.jose.Payload;
import com.nimbusds.jwt.JWTClaimsSet;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * This class extends Runtimeexception for customized responses.
 */
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class ErrorCodeHandlers {

    private ErrorCodeHandlers() {

    }

    private static ErrorCodeHandlers errorCodeHandlersInstance = new ErrorCodeHandlers();

    public static ErrorCodeHandlers getInstance() {

        if (errorCodeHandlersInstance == null) {

            synchronized (ErrorCodeHandlers.class) {

                if (errorCodeHandlersInstance == null) {

                    /* instance will be created at request time */
                    errorCodeHandlersInstance = new ErrorCodeHandlers();
                }
            }
        }
        return errorCodeHandlersInstance;

    }

    public Payload createErrorResponse(String errorcode, String errormessage) {

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .claim("errorcode", errorcode)
                .claim("errormessage", errormessage)
                .build();

        Payload errorpayload = new Payload(claims.toJSONObject());
        return errorpayload;
    }
}
