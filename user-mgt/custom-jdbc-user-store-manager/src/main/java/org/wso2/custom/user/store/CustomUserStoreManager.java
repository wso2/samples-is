/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.custom.user.store;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jasypt.util.password.StrongPasswordEncryptor;
import org.wso2.carbon.user.api.RealmConfiguration;
import org.wso2.carbon.user.core.UserCoreConstants;
import org.wso2.carbon.user.core.UserRealm;
import org.wso2.carbon.user.core.UserStoreException;
import org.wso2.carbon.user.core.claim.ClaimManager;
import org.wso2.carbon.user.core.common.AuthenticationResult;
import org.wso2.carbon.user.core.common.FailureReason;
import org.wso2.carbon.user.core.common.User;
import org.wso2.carbon.user.core.jdbc.JDBCRealmConstants;
import org.wso2.carbon.user.core.jdbc.UniqueIDJDBCUserStoreManager;
import org.wso2.carbon.user.core.profile.ProfileConfigurationManager;
import org.wso2.carbon.utils.Secret;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Map;

/**
 * This class implements the Custom User Store Manager.
 */
public class CustomUserStoreManager extends UniqueIDJDBCUserStoreManager {

    private static final Log log = LogFactory.getLog(CustomUserStoreManager.class);

    private static final StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();


    public CustomUserStoreManager() {

    }

    public CustomUserStoreManager(RealmConfiguration realmConfig, Map<String, Object> properties, ClaimManager
            claimManager, ProfileConfigurationManager profileManager, UserRealm realm, Integer tenantId)
            throws UserStoreException {

        super(realmConfig, properties, claimManager, profileManager, realm, tenantId);
        log.info("CustomUserStoreManager initialized...");
    }


    @Override
    public AuthenticationResult doAuthenticateWithUserName(String userName, Object credential)
            throws UserStoreException {

        boolean isAuthenticated = false;
        String userID = null;
        User user;
        // In order to avoid unnecessary db queries.
        if (!isValidUserName(userName)) {
            String reason = "Username validation failed.";
            if (log.isDebugEnabled()) {
                log.debug(reason);
            }
            return getAuthenticationResult(reason);
        }

        if (!isValidCredentials(credential)) {
            String reason = "Password validation failed.";
            if (log.isDebugEnabled()) {
                log.debug(reason);
            }
            return getAuthenticationResult(reason);
        }

        try {
            String candidatePassword = String.copyValueOf(((Secret) credential).getChars());

            Connection dbConnection = null;
            ResultSet rs = null;
            PreparedStatement prepStmt = null;
            String sql = null;
            dbConnection = this.getDBConnection();
            dbConnection.setAutoCommit(false);
            // get the SQL statement used to select user details
            sql = this.realmConfig.getUserStoreProperty(JDBCRealmConstants.SELECT_USER_NAME);
            if (log.isDebugEnabled()) {
                log.debug(sql);
            }

            prepStmt = dbConnection.prepareStatement(sql);
            prepStmt.setString(1, userName);
            // check whether tenant id is used
            if (sql.contains(UserCoreConstants.UM_TENANT_COLUMN)) {
                prepStmt.setInt(2, this.tenantId);
            }

            rs = prepStmt.executeQuery();
            if (rs.next()) {
                userID = rs.getString(1);
                String storedPassword = rs.getString(3);

                // check whether password is expired or not
                boolean requireChange = rs.getBoolean(5);
                Timestamp changedTime = rs.getTimestamp(6);
                GregorianCalendar gc = new GregorianCalendar();
                gc.add(GregorianCalendar.HOUR, -24);
                Date date = gc.getTime();
                if (!(requireChange && changedTime.before(date))) {
                    // compare the given password with stored password using jasypt
                    isAuthenticated = passwordEncryptor.checkPassword(candidatePassword, storedPassword);
                }
            }
            dbConnection.commit();
            log.info(userName + " is authenticated? " + isAuthenticated);
        } catch (SQLException exp) {
            try {
                this.getDBConnection().rollback();
            } catch (SQLException e1) {
                throw new UserStoreException("Transaction rollback connection error occurred while" +
                        " retrieving user authentication info. Authentication Failure.", e1);
            }
            log.error("Error occurred while retrieving user authentication info.", exp);
            throw new UserStoreException("Authentication Failure");
        }
        if (isAuthenticated) {
            user = getUser(userID, userName);
            AuthenticationResult authenticationResult = new AuthenticationResult(
                    AuthenticationResult.AuthenticationStatus.SUCCESS);
            authenticationResult.setAuthenticatedUser(user);
            return authenticationResult;
        } else {
            AuthenticationResult authenticationResult = new AuthenticationResult(
                    AuthenticationResult.AuthenticationStatus.FAIL);
            authenticationResult.setFailureReason(new FailureReason("Invalid credentials."));
            return authenticationResult;
        }
    }

    @Override
    protected String preparePassword(Object password, String saltValue) throws UserStoreException {
        if (password != null) {
            String candidatePassword = String.copyValueOf(((Secret) password).getChars());
            // ignore saltValue for the time being
            log.info("Generating hash value using jasypt...");
            return passwordEncryptor.encryptPassword(candidatePassword);
        } else {
            log.error("Password cannot be null");
            throw new UserStoreException("Authentication Failure");
        }
    }

    private AuthenticationResult getAuthenticationResult(String reason) {

        AuthenticationResult authenticationResult = new AuthenticationResult(
                AuthenticationResult.AuthenticationStatus.FAIL);
        authenticationResult.setFailureReason(new FailureReason(reason));
        return authenticationResult;
    }
}
