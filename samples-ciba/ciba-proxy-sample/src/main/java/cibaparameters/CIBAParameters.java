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

package cibaparameters;

/**
 * Stores the features of the transaction.
 */
public class CIBAParameters {

    private CIBAParameters() {

    }

    private static CIBAParameters cibaParametersInstance = new CIBAParameters();

    public static CIBAParameters getInstance() {

        if (cibaParametersInstance == null) {

            synchronized (CIBAParameters.class) {

                if (cibaParametersInstance == null) {

                    /* instance will be created at request time */
                    cibaParametersInstance = new CIBAParameters();
                }
            }
        }
        return cibaParametersInstance;

    }

    private long expires_in = 3600;
    private long interval = 2;

    public String getCallBackURL() {

        return callBackURL;
    }

    public void setCallBackURL(String callBackURL) {

        this.callBackURL = callBackURL;
    }

    private String callBackURL = "http://10.10.10.134:8080/CallBackEndpoint";

    private String grant_type = "urn:openid:params:grant-type:ciba";

    public String getAUTHORIZE_ENDPOINT() {

        return AUTHORIZE_ENDPOINT;
    }

    public void setAUTHORIZE_ENDPOINT(String AUTHORIZE_ENDPOINT) {

        this.AUTHORIZE_ENDPOINT = AUTHORIZE_ENDPOINT;
    }

    private String AUTHORIZE_ENDPOINT = "https://localhost:9443/oauth2/authorize";

    private long token_expires_in = 3600;

    public long getExpires_in() {

        return expires_in;
    }

    public void setExpires_in(long expires_in) {

        this.expires_in = expires_in;
    }

    public long getInterval() {

        return interval;
    }

    public void setInterval(int interval) {

        this.interval = interval;
    }

    public String getGrant_type() {

        return grant_type;
    }

    public void setGrant_type(String grant_type) {

        this.grant_type = grant_type;
    }
}
