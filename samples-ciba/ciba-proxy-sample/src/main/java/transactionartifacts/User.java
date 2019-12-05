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

import exceptions.InternalServerErrorException;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;

/**
 * User Object.
 */
public class User implements Artifacts {

    private String userName;
    private String password;
    private String clientappid;
    private String appid;
    private HashMap<String, String> claimstore = new HashMap<String, String>();

    public String getUserName() {

        return userName;
    }

    public void setUserName(String userName) {

        this.userName = userName;
    }

    public String getPassword() {

        return password;
    }

    public void setPassword(String password) {

        this.password = password;
    }

    public String getClientappid() {

        return clientappid;
    }

    public void setClientappid(String clientappid) {

        this.clientappid = clientappid;
    }

    public String getAppid() {

        return appid;
    }

    public void setAppid(String appid) {

        this.appid = appid;
    }

    public String getClaim(String claim) {

        try {
            if (claimstore.get(claim) != null) {
                return claimstore.get(claim);
            }
            throw new InternalServerErrorException("Unexpected claim request.");

        } catch (InternalServerErrorException internalServerErrorException) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, internalServerErrorException
                    .getMessage());
        }
    }

    public void addClaim(String claimkey, String claimvalue) {

        claimstore.put(claimkey, claimvalue);
    }

}
