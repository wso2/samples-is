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

package com.wso2is.androidsample.models;

/**
 * Model class for creating User objects capable of storing and retrieving user information.
 */
public class User {

    private String username;
    private String email;

    /**
     * Get username from the User object.
     *
     * @return Username of the currently logged user.
     */
    public String getUsername() {

        return username;
    }

    /**
     * Get email from the User object.
     *
     * @return Email of the currently logged user.
     */
    public String getEmail() {

        return email;
    }

    /**
     * Set username for the User object.
     *
     * @param username Username of the currently logged user.
     */
    public void setUsername(String username) {

        this.username = username;
    }

    /**
     * Set email for the User object.
     *
     * @param email Email of the currently logged user.
     */
    public void setEmail(String email) {

        this.email = email;
    }
}
