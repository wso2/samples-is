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

package util;

import org.springframework.context.annotation.Scope;

import java.util.UUID;

/**
 * This class create random codes for various purposes.
 */

@Scope("singleton")
public class CodeGenerator {

    private CodeGenerator() {

    }

    private static CodeGenerator codeGeneratorInstance = new CodeGenerator();

    public static CodeGenerator getInstance() {

        if (codeGeneratorInstance == null) {

            synchronized (CodeGenerator.class) {

                if (codeGeneratorInstance == null) {

                    /* instance will be created at request time */
                    codeGeneratorInstance = new CodeGenerator();
                }
            }
        }
        return codeGeneratorInstance;

    }

    /**
     * Generate a random string.
     */
    public String getAuthReqId() {

        UUID authReqId = UUID.randomUUID();
        return authReqId.toString();

    }

    public String getRandomID() {

        UUID ID = UUID.randomUUID();
        return ID.toString();

    }

    public String getUserid() {

        UUID userId = UUID.randomUUID();
        return userId.toString();
    }
}
