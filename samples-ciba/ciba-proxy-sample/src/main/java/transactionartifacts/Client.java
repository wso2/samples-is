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

package transactionartifacts;


/**
 * Client object.
 */
public class Client implements Artifacts {

    private String clientName;
    private String clientSecret;
    private String clientMode;
    private String publickey;

    public String getClientName() {

        return clientName;
    }

    public void setClientName(String clientName) {

        this.clientName = clientName;
    }

    public String getClientSecret() {

        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {

        this.clientSecret = clientSecret;
    }

    public String getClientMode() {

        return clientMode;
    }

    public void setClientMode(String clientMode) {

        this.clientMode = clientMode;
    }

    public String getPublickey() {

        return publickey;
    }

    public void setPublickey(String publickey) {

        this.publickey = publickey;
    }

}
