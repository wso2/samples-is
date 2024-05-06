/*
 * Copyright (c) 2024, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.wso2.custom.user.store.listener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.user.core.UserStoreException;
import org.wso2.carbon.user.core.UserStoreManager;
import org.wso2.carbon.user.core.common.AbstractUserOperationEventListener;

import java.lang.Override;
import java.lang.String;

import java.util.Map;

/**
 * Custom User Store Listener Implementation.
 */
public class MyUserStoreCustomListener extends AbstractUserOperationEventListener {

    private static final Log log = LogFactory.getLog(MyUserStoreCustomListener.class);

    @Override
    public int getExecutionOrderId() {

        return 9883;
    }

    @Override
    public boolean doPostAuthenticate(String userName, boolean authenticated, UserStoreManager userStoreManager)
            throws UserStoreException {

        // check whether user is authenticated
        if (authenticated) {

            log.info("=== doPostAuthenticate ===");
            log.info("User " + userName + " logged in at " + System.currentTimeMillis());
            log.info("=== /doPostAuthenticate ===");
        }

        return true;
    }

    @Override
    public boolean doPostAddUser(String userName, Object credential, String[] roleList,
                                 Map<String, String> claims, String profile,
                                 UserStoreManager userStoreManager)
            throws UserStoreException {

        log.info("=== doPostAddUser ===");
        log.info("User " + userName + " created at " + System.currentTimeMillis());
        log.info(credential.toString());
        log.info(" === ");
        log.info(claims.toString());
        log.info("=== /doPostAddUser ===");

        return true;
    }

    @Override
    public boolean doPostSetUserClaimValues(String userName, Map<String, String> claims,
                                            String profileName, UserStoreManager userStoreManager)
            throws UserStoreException {

        log.info("=== doPostSetUserClaimValues ===");

        log.info("Username: " + userName);
        log.info("Profile: " + profileName);

        log.info("NAME: " +
                userStoreManager.getUserClaimValue(userName, "http://wso2.org/claims/fullname", profileName));
        log.info("EMAIL: " +
                userStoreManager.getUserClaimValue(userName, "http://wso2.org/claims/emailaddress", profileName));

//        This doens't work for identity claims
//        log.info("LOCKED: " + userStoreManager.getUserClaimValue(userName, "http://wso2.org/claims/identity/accountLocked", profileName));

//        Following is the workaround for above problem

        String[] claimNames = {
                "http://wso2.org/claims/identity/accountLocked",
                "http://wso2.org/claims/identity/emailVerified"
        };

        Map<String, String> claimValues = userStoreManager.getUserClaimValues(userName, claimNames, profileName);

        log.info("LOCKED: " + claimValues.get(claimNames[0]));
        log.info("EmailVerified: " + claimValues.get(claimNames[1]));

        log.info(claims.toString());

        log.info("=== /doPostSetUserClaimValues ===");

        return true;
    }

}
