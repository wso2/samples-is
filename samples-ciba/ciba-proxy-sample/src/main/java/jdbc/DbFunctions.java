/*
 * Copyright (c) 2013, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package jdbc;

import configuration.ConfigurationFile;
import dao.DbConnection;
import transactionartifacts.CIBAauthRequest;
import transactionartifacts.CIBAauthResponse;
import transactionartifacts.PollingAtrribute;
import transactionartifacts.TokenRequest;
import transactionartifacts.TokenResponse;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Logger;

/**
 * Implementations of DB queries.
 */
public class DbFunctions {

    Connection connection;

    private static final Logger LOGGER = Logger.getLogger(DbFunctions.class.getName());

    private DbFunctions() {

        {
            try {
                connection = DbConnection.getConnection();

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }

    private static DbFunctions dbFunctionsInstance = new DbFunctions();

    public static DbFunctions getInstance() {

        if (dbFunctionsInstance == null) {

            synchronized (DbFunctions.class) {

                if (dbFunctionsInstance == null) {

                    /* instance will be created at request time */
                    dbFunctionsInstance = new DbFunctions();
                }
            }
        }
        return dbFunctionsInstance;

    }

    public Boolean addAuthRequest(String authReqId, Object authRequest) {

        try {
            CIBAauthRequest cibAauthRequest = (CIBAauthRequest) authRequest;

            Statement statement = connection.createStatement();

            //use the configured database
            statement.execute("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            //create authentication request table if not exists
            statement.execute(DbScripts.getCREATE_CIBA_AUTH_REQUEST_DB_SCRIPT());

            //add user to store using prepared statements
            PreparedStatement prepStmt = connection.prepareStatement(DbScripts.getADD_AUTH_REQUEST_TO_DB_SCRIPT());
            prepStmt.setString(1, authReqId);

            prepStmt.setString(2, cibAauthRequest.getAud());
            prepStmt.setString(3, cibAauthRequest.getIss());
            prepStmt.setLong(4, cibAauthRequest.getExp());
            prepStmt.setLong(5, cibAauthRequest.getIat());
            prepStmt.setLong(6, cibAauthRequest.getNbf());
            prepStmt.setString(7, cibAauthRequest.getJti());

            if (cibAauthRequest.getScope() != null) {
                prepStmt.setString(8, cibAauthRequest.getScope());
            } else {
                prepStmt.setString(8, "");
            }

            if (cibAauthRequest.getClient_notification_token() != null) {
                prepStmt.setString(9, cibAauthRequest.getClient_notification_token());
            } else {
                prepStmt.setString(9, "");
            }

            if (cibAauthRequest.getAcr_values() != null) {
                prepStmt.setString(10, cibAauthRequest.getAcr_values());
            } else {
                prepStmt.setString(10, "");
            }

            if (cibAauthRequest.getLogin_hint_token() != null) {
                prepStmt.setString(11, cibAauthRequest.getLogin_hint_token());
            } else {
                prepStmt.setString(11, "");
            }

            if (cibAauthRequest.getLogin_hint() != null) {
                prepStmt.setString(12, cibAauthRequest.getLogin_hint());
            } else {
                prepStmt.setString(12, "");
            }

            if (cibAauthRequest.getId_token_hint() != null) {
                prepStmt.setString(13, cibAauthRequest.getId_token_hint());
            } else {
                prepStmt.setString(13, "");
            }

            if (cibAauthRequest.getBinding_message() != null) {
                prepStmt.setString(14, cibAauthRequest.getBinding_message());
            } else {
                prepStmt.setString(14, "");
            }

            if (cibAauthRequest.getUser_code() != null) {
                prepStmt.setString(15, cibAauthRequest.getUser_code());
            } else {
                prepStmt.setString(15, "");
            }

            if (cibAauthRequest.getRequested_expiry() != 0) {
                prepStmt.setLong(16, cibAauthRequest.getRequested_expiry());
            } else {
                prepStmt.setLong(16, 0);
            }

            Boolean result = prepStmt.execute();
            //System.out.println("actual result of execution is" + result);
            statement.close();
            prepStmt.close();

            return true; //as if there is no false it will result in false and only if error throw exception

        } catch (SQLException e) {

            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    public Boolean deleteAuthRequest(String authReqId) {

        try {

            Statement statement = connection.createStatement();

            //use the configured database
            statement.executeQuery("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            PreparedStatement preparedStmt =
                    connection.prepareStatement(DbScripts.getREMOVE_AUTH_REQUEST_FROM_DB_SCRIPT());
            preparedStmt.setString(1, authReqId);

            // execute the prepared statement
            Boolean result = preparedStmt.execute();
            statement.close();
            preparedStmt.close();

            return true;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public Object getAuthRequest(String authReqId) {

        CIBAauthRequest cibAauthRequest = new CIBAauthRequest();
        try {

            Statement statement = connection.createStatement();

            //use the configured database
            statement.executeQuery("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            PreparedStatement preparedStmt =
                    connection.prepareStatement(DbScripts.getGET_AUTH_REQUEST_FROM_DB_SCRIPT());
            preparedStmt.setString(1, authReqId);

            // execute the prepared statement
            ResultSet resultSet = preparedStmt.executeQuery();

            while (resultSet.next()) {               // Position the cursor

                cibAauthRequest.setAud(resultSet.getString(2));
                cibAauthRequest.setIss(resultSet.getString(3));
                cibAauthRequest.setExp(resultSet.getLong(4));
                cibAauthRequest.setIat(resultSet.getLong(5));
                cibAauthRequest.setNbf(resultSet.getLong(6));
                cibAauthRequest.setJti(resultSet.getString(7));
                cibAauthRequest.setScope(resultSet.getString(8));
                cibAauthRequest.setClient_notification_token(resultSet.getString(9));
                cibAauthRequest.setAcr_values(resultSet.getString(10));
                cibAauthRequest.setLogin_hint_token(resultSet.getString(11));
                cibAauthRequest.setLogin_hint(resultSet.getString(12));
                cibAauthRequest.setId_token_hint(resultSet.getString(13));
                cibAauthRequest.setBinding_message(resultSet.getString(14));
                cibAauthRequest.setUser_code(resultSet.getString(15));
                cibAauthRequest.setRequested_expiry(resultSet.getLong(16));

            }
            statement.close();
            preparedStmt.close();

        } catch (Exception e) {
            e.printStackTrace();

        }
        return cibAauthRequest;
    }

    public Boolean addAuthResponse(String authReqId, Object authResponse) {

        Boolean result;
        try {

            CIBAauthResponse cibAauthResponse = (CIBAauthResponse) authResponse;

            Statement statement = connection.createStatement();

            //use the configured database
            statement.execute("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            //create authentication request table if not exists
            statement.execute(DbScripts.getCREATE_CIBA_AUTH_RESPONSE_DB_SCRIPT());

            //add user to store using prepared statements
            PreparedStatement prepStmt = connection.prepareStatement(DbScripts.getADD_AUTH_RESPONSE_TO_DB_SCRIPT());
            prepStmt.setString(1, authReqId);
            prepStmt.setLong(2, cibAauthResponse.getExpiresIn());
            prepStmt.setLong(3, cibAauthResponse.getInterval());

            result = prepStmt.execute();
            statement.close();
            prepStmt.close();

            return true;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public Boolean deleteAuthResponse(String authReqId) {

        try {

            Statement statement = connection.createStatement();

            //use the configured database
            statement.executeQuery("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            PreparedStatement preparedStmt =
                    connection.prepareStatement(DbScripts.getREMOVE_AUTH_RESPONSE_FROM_DB_SCRIPT());
            preparedStmt.setString(1, authReqId);

            // execute the preparedstatement
            Boolean result = preparedStmt.execute();
            statement.close();
            preparedStmt.close();

            return true;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public Object getAuthResponse(String authReqId) {

        CIBAauthResponse cibAauthResponse = new CIBAauthResponse();
        try {

            Statement statement = connection.createStatement();

            //use the configured database
            statement.executeQuery("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            PreparedStatement preparedStmt =
                    connection.prepareStatement(DbScripts.getGET_AUTH_RESPONSE_FROM_DB_SCRIPT());
            preparedStmt.setString(1, authReqId);

            // execute the prepared statement
            ResultSet resultSet = preparedStmt.executeQuery();

            while (resultSet.next()) {               // Position the cursor

                cibAauthResponse.setAuthReqId(resultSet.getString(1));
                cibAauthResponse.setExpiresIn(resultSet.getLong(2));
                cibAauthResponse.setInterval(resultSet.getLong(3));
                return cibAauthResponse;

            }
            cibAauthResponse =
                    null;

            statement.close();
            preparedStmt.close();

        } catch (Exception e) {
            e.printStackTrace();

        }
        return cibAauthResponse;
    }

    public boolean addTokenRequest(String authReqId, Object tokenRequest1) {

        try {
            TokenRequest tokenRequest = (TokenRequest) tokenRequest1;

            Statement statement = connection.createStatement();

            //use the configured database
            statement.execute("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            //create authentication request table if not exists
            statement.execute(DbScripts.getCREATE_TOKEN_REQUEST_DB_SCRIPT());

            //add user to store using prepared statements
            PreparedStatement prepdStmt =
                    connection.prepareStatement(DbScripts.getCHECK_FOR_TOKEN_REQUEST_AVAILABILITY());
            prepdStmt.setString(1, authReqId);
            ResultSet resultSet = prepdStmt.executeQuery();
            System.out.println("result set " + resultSet);
            int count;
            while (resultSet.next()) {
                count = (resultSet.getInt(1));

                if (count >= 1) {
                    //do nothing
                    statement.close();
                    prepdStmt.close();
                    return true;
                } else {
                    PreparedStatement prepStmt =
                            connection.prepareStatement(DbScripts.getADD_TOKEN_REQUEST_TO_DB_SCRIPT());
                    prepStmt.setString(1, authReqId);

                    prepStmt.setString(2, tokenRequest.getGrant_type());

                    Boolean result1 = prepStmt.execute();
                    statement.close();
                    prepStmt.close();

                    return true;
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteTokenRequest(String authReqId) {

        try {

            Statement statement = connection.createStatement();

            //use the configured database
            statement.execute("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            PreparedStatement preparedStmt =
                    connection.prepareStatement(DbScripts.getREMOVE_TOKEN_REQUEST_FROM_DB_SCRIPT());
            preparedStmt.setString(1, authReqId);

            // execute the preparedstatement
            Boolean result = preparedStmt.execute();
            statement.close();
            preparedStmt.close();

            return true;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public Object getTokenRequest(String authReqId) {

        TokenRequest tokenRequest = new TokenRequest();
        try {

            Statement statement = connection.createStatement();

            //use the configured database
            statement.execute("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            PreparedStatement preparedStmt =
                    connection.prepareStatement(DbScripts.getGET_TOKEN_REQUEST_FROM_DB_SCRIPT());
            preparedStmt.setString(1, authReqId);

            // execute the prepared statement
            ResultSet resultSet = preparedStmt.executeQuery();

            while (resultSet.next()) {               // Position the cursor

                tokenRequest.setAuth_req_id(resultSet.getString(1));
                tokenRequest.setGrant_type(resultSet.getString(2));

            }
            statement.close();
            preparedStmt.close();

        } catch (Exception e) {
            e.printStackTrace();

        }
        return tokenRequest;
    }

    public boolean addTokenResponse(String authReqId, Object tokenResponse1) {

        try {
            TokenResponse tokenResponse = (TokenResponse) tokenResponse1;

            Statement statement = connection.createStatement();

            //use the configured database
            statement.execute("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            //create authentication request table if not exists
            statement.execute(DbScripts.getCREATE_TOKEN_RESPONSE_DB_SCRIPT());

            //add user to store using prepared statements
            PreparedStatement prepStmt = connection.prepareStatement(DbScripts.getADD_TOKEN_RESPONSE_TO_DB_SCRIPT());
            prepStmt.setString(1, authReqId);

            prepStmt.setString(2, tokenResponse.getAccessToken());
            prepStmt.setString(3, tokenResponse.getIdToken());
            prepStmt.setString(4, tokenResponse.getTokenType());
            prepStmt.setLong(5, tokenResponse.getTokenExpirein());
            prepStmt.setString(6, tokenResponse.getRefreshToken());

            Boolean result = prepStmt.execute();
            statement.close();
            prepStmt.close();

            return true;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteTokenResponse(String authReqId) {

        try {

            Statement statement = connection.createStatement();

            //use the configured database
            statement.execute("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            PreparedStatement preparedStmt =
                    connection.prepareStatement(DbScripts.getREMOVE_TOKEN_RESPONSE_FROM_DB_SCRIPT());
            preparedStmt.setString(1, authReqId);

            // execute the preparedstatement
            Boolean result = preparedStmt.execute();
            statement.close();
            preparedStmt.close();

            return true;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public Object getTokenResponse(String authReqId) {

        TokenResponse tokenResponse = new TokenResponse();
        try {

            Statement statement = connection.createStatement();

            //use the configured database
            statement.execute("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            PreparedStatement preparedStmt =
                    connection.prepareStatement(DbScripts.getGET_TOKEN_RESPONSE_FROM_DB_SCRIPT());
            preparedStmt.setString(1, authReqId);

            // execute the prepared statement
            ResultSet resultSet = preparedStmt.executeQuery();

            while (resultSet.next()) {               // Position the cursor

                tokenResponse.setAccessToken(resultSet.getString(2));
                tokenResponse.setIdToken(resultSet.getString(3));
                tokenResponse.setTokenType(resultSet.getString(4));
                tokenResponse.setTokenExpirein(resultSet.getLong(5));
                tokenResponse.setRefreshToken(resultSet.getString(6));

            }
            statement.close();
            preparedStmt.close();

            return tokenResponse;

        } catch (Exception e) {
            e.printStackTrace();

        }
        return null;
    }

    public boolean addPollingAttribute(String authReqId, Object pollingattribute1) {

        try {
            PollingAtrribute pollingAtrribute = (PollingAtrribute) pollingattribute1;

            Statement statement = connection.createStatement();

            //use the configured database
            statement.execute("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            //create authentication request table if not exists
            statement.execute(DbScripts.getCREATE_POLLING_ATTRIBUTE_DB_SCRIPT());

            //add user to store using prepared statements
            PreparedStatement prepStmt = connection.prepareStatement(DbScripts.getADD_POLLING_ATTRIBUTE_TO_DB_SCRIPT());
            prepStmt.setString(1, authReqId);

            prepStmt.setLong(2, pollingAtrribute.getExpiresIn());
            prepStmt.setLong(3, pollingAtrribute.getPollingInterval());
            prepStmt.setLong(4, pollingAtrribute.getLastPolledTime());
            prepStmt.setLong(5, pollingAtrribute.getIssuedTime());
            prepStmt.setBoolean(6, pollingAtrribute.getNotificationIssued());

            Boolean result = prepStmt.execute();
            statement.close();
            prepStmt.close();

            return true;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deletePollingAttribute(String authReqId) {

        try {

            Statement statement = connection.createStatement();

            //use the configured database
            statement.execute("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            PreparedStatement preparedStmt =
                    connection.prepareStatement(DbScripts.getREMOVE_POLLING_ATTRIBUTE_FROM_DB_SCRIPT());
            preparedStmt.setString(1, authReqId);

            // execute the preparedstatement
            Boolean result = preparedStmt.execute();
            statement.close();
            preparedStmt.close();

            return true;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public Object getPollingAttribute(String authReqId) {

        PollingAtrribute pollingAtrribute = new PollingAtrribute();
        try {

            Statement statement = connection.createStatement();

            //use the configured database
            statement.execute("Use " + ConfigurationFile.getInstance().getDATABASE() + ";");

            PreparedStatement preparedStmt =
                    connection.prepareStatement(DbScripts.getGET_POLLING_ATTRIBUTE_FROM_DB_SCRIPT());
            preparedStmt.setString(1, authReqId);

            // execute the prepared statement
            ResultSet resultSet = preparedStmt.executeQuery();

            while (resultSet.next()) {               // Position the cursor
                pollingAtrribute.setAuth_req_id(resultSet.getString(1));
                pollingAtrribute.setExpiresIn(resultSet.getLong(2));
                pollingAtrribute.setPollingInterval(resultSet.getLong(3));
                pollingAtrribute.setLastPolledTime(resultSet.getLong(4));
                pollingAtrribute.setIssuedTime(resultSet.getLong(5));
                pollingAtrribute.setNotificationIssued(resultSet.getBoolean(6));

            }
            statement.close();
            preparedStmt.close();

            return pollingAtrribute;

        } catch (Exception e) {
            e.printStackTrace();

        }

        return null;
    }
}

