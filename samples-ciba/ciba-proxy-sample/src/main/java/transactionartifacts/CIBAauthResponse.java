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
 * Authentication response object.
 */
public class CIBAauthResponse implements Artifacts {

    private String authReqId;
    private long expiresIn;
    private long interval;

    public String getAuthReqId() {

        return authReqId;
    }

    public void setAuthReqId(String authReqId) {

        this.authReqId = authReqId;
    }

    public long getExpiresIn() {

        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {

        this.expiresIn = expiresIn;
    }

    public long getInterval() {

        return interval;
    }

    public void setInterval(long interval) {

        this.interval = interval;
    }

}
