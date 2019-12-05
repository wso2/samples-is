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
package jdbc;

import java.util.logging.Logger;

/**
 * SQL Queries.
 */
public class DbScripts {

    private static final Logger LOGGER = Logger.getLogger(DbScripts.class.getName());

    private DbScripts() {

    }

    private static DbScripts DbScriptsInstance = new DbScripts();

    public static DbScripts getInstance() {

        // TODO: 8/27/19 need to change this to database
        if (DbScriptsInstance == null) {

            synchronized (DbScripts.class) {

                if (DbScriptsInstance == null) {

                    /* instance will be created at request time */
                    DbScriptsInstance = new DbScripts();
                }
            }
        }
        return DbScriptsInstance;

    }

    private final static String CREATE_CIBA_AUTH_REQUEST_DB_SCRIPT = "CREATE TABLE IF NOT EXISTS authRequest (" +
            "auth_req_id VARCHAR(255) NOT NULL,  aud VARCHAR(255) NOT NULL ," +
            "iss VARCHAR(255) NOT NULL,  exp BIGINT NOT NULL  ," +
            "iat BIGINT NOT NULL ,  nbf  BIGINT NOT NULL ," +
            "jti VARCHAR(255) NOT NULL,  scope VARCHAR(255) ," +
            "client_notification_token VARCHAR(255) ,  acr_values VARCHAR(255) ," +
            "login_hint_token TEXT ,  login_hint TEXT ," +
            "id_token_hint TEXT ,  binding_message VARCHAR(255) ," +
            "user_code VARCHAR(255) ,  requested_expiry BIGINT," +
            "primary key (auth_req_id));";

    public static final String ADD_AUTH_REQUEST_TO_DB_SCRIPT = "INSERT INTO authRequest" +
            "(auth_req_id, aud, iss, exp, iat, nbf, jti," +
            " scope,client_notification_token, acr_values, login_hint_token, login_hint," +
            "  id_token_hint, binding_message ,user_code , requested_expiry )" +
            " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";

    private static final String REMOVE_AUTH_REQUEST_FROM_DB_SCRIPT = "DELETE FROM authRequest where auth_req_id = ?";
    private static final String GET_AUTH_REQUEST_FROM_DB_SCRIPT = "SELECT * FROM authRequest where auth_req_id = ? ";

    public static String getCREATE_CIBA_AUTH_REQUEST_DB_SCRIPT() {

        return CREATE_CIBA_AUTH_REQUEST_DB_SCRIPT;
    }

    public static String getADD_AUTH_REQUEST_TO_DB_SCRIPT() {

        return ADD_AUTH_REQUEST_TO_DB_SCRIPT;
    }

    public static String getREMOVE_AUTH_REQUEST_FROM_DB_SCRIPT() {

        return REMOVE_AUTH_REQUEST_FROM_DB_SCRIPT;
    }

    public static String getGET_AUTH_REQUEST_FROM_DB_SCRIPT() {

        return GET_AUTH_REQUEST_FROM_DB_SCRIPT;
    }

    private final static String CREATE_CIBA_AUTH_RESPONSE_DB_SCRIPT = "CREATE TABLE IF NOT EXISTS authResponse (" +
            "auth_req_id VARCHAR(255) NOT NULL,  expires_in BIGINT NOT NULL ," +
            "interval_time BIGINT NOT NULL, " +
            "primary key (auth_req_id));";

    public static final String ADD_AUTH_RESPONSE_TO_DB_SCRIPT = "INSERT INTO authResponse" +
            "(auth_req_id, expires_in, interval_time)" +
            " VALUES (?,?,?) ";

    private static final String REMOVE_AUTH_RESPONSE_FROM_DB_SCRIPT = "DELETE FROM authResponse where auth_req_id = ?";
    private static final String GET_AUTH_RESPONSE_FROM_DB_SCRIPT = "SELECT * FROM authResponse where auth_req_id = ? ";

    public static String getCREATE_CIBA_AUTH_RESPONSE_DB_SCRIPT() {

        return CREATE_CIBA_AUTH_RESPONSE_DB_SCRIPT;
    }

    public static String getADD_AUTH_RESPONSE_TO_DB_SCRIPT() {

        return ADD_AUTH_RESPONSE_TO_DB_SCRIPT;
    }

    public static String getREMOVE_AUTH_RESPONSE_FROM_DB_SCRIPT() {

        return REMOVE_AUTH_RESPONSE_FROM_DB_SCRIPT;
    }

    public static String getGET_AUTH_RESPONSE_FROM_DB_SCRIPT() {

        return GET_AUTH_RESPONSE_FROM_DB_SCRIPT;
    }

    private final static String CREATE_EXPIRES_IN_DB_SCRIPT = "CREATE TABLE IF NOT EXISTS expiresIn (" +
            "auth_req_id VARCHAR(255) NOT NULL,  expires_in BIGINT NOT NULL ," +
            "primary key (auth_req_id));";

    public static final String ADD_EXPIRES_IN_TO_DB_SCRIPT = "INSERT INTO expiresIn" +
            "(auth_req_id, expires_in)" +
            " VALUES (?,?) ";

    private static final String REMOVE_EXPIRES_IN_FROM_DB_SCRIPT = "DELETE FROM expiresIn where auth_req_id = ?";
    private static final String GET_EXPIRES_IN_FROM_DB_SCRIPT = "SELECT * FROM expiresIn where auth_req_id = ? ";

    public static String getCREATE_EXPIRES_IN_DB_SCRIPT() {

        return CREATE_EXPIRES_IN_DB_SCRIPT;
    }

    public static String getADD_EXPIRES_IN_TO_DB_SCRIPT() {

        return ADD_EXPIRES_IN_TO_DB_SCRIPT;
    }

    public static String getREMOVE_EXPIRES_IN_FROM_DB_SCRIPT() {

        return REMOVE_EXPIRES_IN_FROM_DB_SCRIPT;
    }

    public static String getGET_EXPIRES_IN_FROM_DB_SCRIPT() {

        return GET_EXPIRES_IN_FROM_DB_SCRIPT;
    }

    private static final String CREATE_INTERVAL_DB_SCRIPT = "CREATE TABLE IF NOT EXISTS interval_time (" +
            "auth_req_id VARCHAR(255) NOT NULL,  interval_time BIGINT NOT NULL ," +
            "primary key (auth_req_id));";

    private static final String ADD_INTERVAL_TO_DB_SCRIPT = "INSERT INTO interval_time" +
            "(auth_req_id, interval_time)" +
            " VALUES (?,?) ";

    private static final String REMOVE_INTERVAL_FROM_DB_SCRIPT = "DELETE FROM interval_time where auth_req_id = ?";
    private static final String GET_INTERVAL_FROM_DB_SCRIPT = "SELECT * FROM interval_time where auth_req_id = ? ";

    public static String getCREATE_INTERVAL_DB_SCRIPT() {

        return CREATE_INTERVAL_DB_SCRIPT;
    }

    public static String getADD_INTERVAL_TO_DB_SCRIPT() {

        return ADD_INTERVAL_TO_DB_SCRIPT;
    }

    public static String getREMOVE_INTERVAL_FROM_DB_SCRIPT() {

        return REMOVE_INTERVAL_FROM_DB_SCRIPT;
    }

    public static String getGET_INTERVAL_FROM_DB_SCRIPT() {

        return GET_INTERVAL_FROM_DB_SCRIPT;
    }

    private static final String CREATE_ISSUEDTIME_DB_SCRIPT = "CREATE TABLE IF NOT EXISTS issuedTime (" +
            "auth_req_id VARCHAR(255) NOT NULL,  issuedTime BIGINT NOT NULL ," +
            "primary key (auth_req_id));";

    private static final String ADD_ISSUEDTIME_TO_DB_SCRIPT = "INSERT INTO issuedTime" +
            "(auth_req_id, issuedTime)" +
            " VALUES (?,?) ";

    private static final String REMOVE_ISSUEDTIME_FROM_DB_SCRIPT = "DELETE FROM issuedTIme where auth_req_id = ?";
    private static final String GET_ISSUEDTIME_FROM_DB_SCRIPT = "SELECT * FROM issuedTime where auth_req_id = ? ";

    public static String getCREATE_ISSUEDTIME_DB_SCRIPT() {

        return CREATE_ISSUEDTIME_DB_SCRIPT;
    }

    public static String getADD_ISSUEDTIME_TO_DB_SCRIPT() {

        return ADD_ISSUEDTIME_TO_DB_SCRIPT;
    }

    public static String getREMOVE_ISSUEDTIME_FROM_DB_SCRIPT() {

        return REMOVE_ISSUEDTIME_FROM_DB_SCRIPT;
    }

    public static String getGET_ISSUEDTIME_FROM_DB_SCRIPT() {

        return GET_ISSUEDTIME_FROM_DB_SCRIPT;
    }

    private static final String CREATE_LASTPOLL_DB_SCRIPT = "CREATE TABLE IF NOT EXISTS lastPoll (" +
            "auth_req_id VARCHAR(255) NOT NULL,  lastPoll BIGINT NOT NULL ," +
            "primary key (auth_req_id));";

    private static final String ADD_LASTPOLL_TO_DB_SCRIPT = "INSERT INTO lastPoll" +
            "(auth_req_id, lastPoll)" +
            " VALUES (?,?) ";

    private static final String REMOVE_LASTPOLL_FROM_DB_SCRIPT = "DELETE FROM lastPoll where auth_req_id = ?";
    private final static String GET_LASTPOLL_FROM_DB_SCRIPT = "SELECT * FROM lastPoll where auth_req_id = ? ";

    public static String getCREATE_LASTPOLL_DB_SCRIPT() {

        return CREATE_LASTPOLL_DB_SCRIPT;
    }

    public static String getADD_LASTPOLL_TO_DB_SCRIPT() {

        return ADD_LASTPOLL_TO_DB_SCRIPT;
    }

    public static String getREMOVE_LASTPOLL_FROM_DB_SCRIPT() {

        return REMOVE_LASTPOLL_FROM_DB_SCRIPT;
    }

    public static String getGET_LASTPOLL_FROM_DB_SCRIPT() {

        return GET_LASTPOLL_FROM_DB_SCRIPT;
    }

    private final static String CREATE_TOKEN_REQUEST_DB_SCRIPT = "CREATE TABLE IF NOT EXISTS tokenRequest (" +
            "auth_req_id VARCHAR(255) NOT NULL,  grantType VARCHAR(255) NOT NULL ," +
            "primary key (auth_req_id));";

    private static final String ADD_TOKEN_REQUEST_TO_DB_SCRIPT = "INSERT INTO tokenRequest" +
            "(auth_req_id, grantType)" +
            " VALUES (?,?) ";

    private static final String REMOVE_TOKEN_REQUEST_FROM_DB_SCRIPT = "DELETE FROM tokenRequest where auth_req_id = ?";
    private final static String GET_TOKEN_REQUEST_FROM_DB_SCRIPT = "SELECT * FROM tokenRequest where auth_req_id = ? ";
    private static final String CHECK_FOR_TOKEN_REQUEST_AVAILABILITY = "SELECT COUNT(auth_req_id) from tokenRequest " +
            "where tokenRequest.auth_req_id = ?";

    public static String getCREATE_TOKEN_REQUEST_DB_SCRIPT() {

        return CREATE_TOKEN_REQUEST_DB_SCRIPT;
    }

    public static String getADD_TOKEN_REQUEST_TO_DB_SCRIPT() {

        return ADD_TOKEN_REQUEST_TO_DB_SCRIPT;
    }

    public static String getREMOVE_TOKEN_REQUEST_FROM_DB_SCRIPT() {

        return REMOVE_TOKEN_REQUEST_FROM_DB_SCRIPT;
    }

    public static String getGET_TOKEN_REQUEST_FROM_DB_SCRIPT() {

        return GET_TOKEN_REQUEST_FROM_DB_SCRIPT;
    }

    public static String getCHECK_FOR_TOKEN_REQUEST_AVAILABILITY() {

        return CHECK_FOR_TOKEN_REQUEST_AVAILABILITY;
    }

    private final static String CREATE_TOKEN_RESPONSE_DB_SCRIPT = "CREATE TABLE IF NOT EXISTS tokenResponse (" +
            "auth_req_id VARCHAR(255) NOT NULL,  access_token TEXT NOT NULL , " +
            "id_token TEXT NOT NULL , token_type VARCHAR(255) NOT NULL ," +
            "expires_in BIGINT NOT NULL ,refresh_token TEXT, " +
            "primary key (auth_req_id));";

    private static final String ADD_TOKEN_RESPONSE_TO_DB_SCRIPT = "INSERT INTO tokenResponse" +
            "(auth_req_id,access_token,id_token,token_type,expires_in,refresh_token)" +
            " VALUES (?,?,?,?,?,?) ";

    private static final String REMOVE_TOKEN_RESPONSE_FROM_DB_SCRIPT =
            "DELETE FROM tokenResponse where auth_req_id = ?";
    private final static String GET_TOKEN_RESPONSE_FROM_DB_SCRIPT =
            "SELECT * FROM tokenResponse where auth_req_id = ? ";

    public static String getCREATE_TOKEN_RESPONSE_DB_SCRIPT() {

        return CREATE_TOKEN_RESPONSE_DB_SCRIPT;
    }

    public static String getADD_TOKEN_RESPONSE_TO_DB_SCRIPT() {

        return ADD_TOKEN_RESPONSE_TO_DB_SCRIPT;
    }

    public static String getREMOVE_TOKEN_RESPONSE_FROM_DB_SCRIPT() {

        return REMOVE_TOKEN_RESPONSE_FROM_DB_SCRIPT;
    }

    public static String getGET_TOKEN_RESPONSE_FROM_DB_SCRIPT() {

        return GET_TOKEN_RESPONSE_FROM_DB_SCRIPT;
    }

    private final static String CREATE_POLLING_ATTRIBUTE_DB_SCRIPT = "CREATE TABLE IF NOT EXISTS pollingAttribute (" +
            "auth_req_id VARCHAR(255) NOT NULL,  expiresIn BIGINT NOT NULL," +
            "pollingTime BIGINT NOT NULL, lastPolled BIGINT NOT NULL," +
            " issuedTime BIGINT NOT NULL, notification_issued BOOLEAN NOT NULL ," +
            "primary key (auth_req_id));";

    private static final String ADD_POLLING_ATTRIBUTE_TO_DB_SCRIPT = "INSERT INTO pollingAttribute" +
            "(auth_req_id,expiresIn,pollingTime,lastPolled,issuedTime,notification_issued)" +
            " VALUES (?,?,?,?,?,?) ";

    private static final String REMOVE_POLLING_ATTRIBUTE_FROM_DB_SCRIPT =
            "DELETE FROM pollingAttribute where auth_req_id = ?";
    private final static String GET_POLLING_ATTRIBUTE_FROM_DB_SCRIPT =
            "SELECT * FROM pollingAttribute where auth_req_id = ? ";

    public static String getCREATE_POLLING_ATTRIBUTE_DB_SCRIPT() {

        return CREATE_POLLING_ATTRIBUTE_DB_SCRIPT;
    }

    public static String getADD_POLLING_ATTRIBUTE_TO_DB_SCRIPT() {

        return ADD_POLLING_ATTRIBUTE_TO_DB_SCRIPT;
    }

    public static String getREMOVE_POLLING_ATTRIBUTE_FROM_DB_SCRIPT() {

        return REMOVE_POLLING_ATTRIBUTE_FROM_DB_SCRIPT;
    }

    public static String getGET_POLLING_ATTRIBUTE_FROM_DB_SCRIPT() {

        return GET_POLLING_ATTRIBUTE_FROM_DB_SCRIPT;
    }
}




