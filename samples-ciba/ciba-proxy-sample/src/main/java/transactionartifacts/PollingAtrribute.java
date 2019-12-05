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
 * Polling attribute object.
 */
public class PollingAtrribute implements Artifacts {

    private String auth_req_id;
    private long expiresIn;
    private long lastPolledTime;
    private long pollingInterval;
    private long issuedTime;
    private Boolean notificationIssued;

    public Boolean getNotificationIssued() {

        return notificationIssued;
    }

    public void setNotificationIssued(Boolean notificationIssued) {

        this.notificationIssued = notificationIssued;
    }

    public String getAuth_req_id() {

        return auth_req_id;
    }

    public void setAuth_req_id(String auth_req_id) {

        this.auth_req_id = auth_req_id;
    }

    public long getExpiresIn() {

        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {

        this.expiresIn = expiresIn;
    }

    public long getLastPolledTime() {

        return lastPolledTime;
    }

    public void setLastPolledTime(long lastPolledTime) {

        this.lastPolledTime = lastPolledTime;
    }

    public long getPollingInterval() {

        return pollingInterval;
    }

    public void setPollingInterval(long pollingInterval) {

        this.pollingInterval = pollingInterval;
    }

    public long getIssuedTime() {

        return issuedTime;
    }

    public void setIssuedTime(long issuedTime) {

        this.issuedTime = issuedTime;
    }
}
