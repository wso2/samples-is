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
 * Token request object.
 */
public class TokenRequest implements Artifacts {

    private String auth_req_id;
    private String grant_type;
    // private enum errormessage;

    public String getAuth_req_id() {

        return auth_req_id;
    }

    public void setAuth_req_id(String auth_req_id) {

        this.auth_req_id = auth_req_id;
    }

    public String getGrant_type() {

        return grant_type;
    }

    public void setGrant_type(String grant_type) {

        this.grant_type = grant_type;
    }
}
