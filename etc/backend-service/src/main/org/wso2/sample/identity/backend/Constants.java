/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
package org.wso2.sample.identity.backend;

import java.util.Arrays;
import java.util.List;

/**
 * Simple class to store constants for backend services
 */
public class Constants {

    private static final String PORT_ARG = "-port";

    private static final String INTROSPECT_ARG = "-introspectionEnabled";

    private static final String INTROSPECT_EP = "-introspectionEndpoint";

    static List<String> getArgList() {

        return Arrays.asList(PORT_ARG, INTROSPECT_ARG, INTROSPECT_EP);
    }

    static String getPropertyForArg(final String argString) {

        return argString.substring(1);
    }
}
