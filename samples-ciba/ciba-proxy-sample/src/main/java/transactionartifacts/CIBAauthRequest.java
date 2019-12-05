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
 * Authentication request object.
 */
public class CIBAauthRequest implements Artifacts {

    // Paramters specified in CIBA.
    private String scope;
    private String client_notification_token;
    private String acr_values;
    private String login_hint_token;
    private String login_hint;
    private String id_token_hint;
    private String binding_message;
    private String user_code;
    private long requested_expiry;

    // Parameters required if signed.
    private String aud;
    private String iss;
    private long exp;
    private long iat;
    private long nbf;
    private String jti;

    public String getScope() {

        return scope;
    }

    public void setScope(String scope) {

        this.scope = scope;
    }

    public String getClient_notification_token() {

        return client_notification_token;
    }

    public void setClient_notification_token(String client_notification_token) {

        this.client_notification_token = client_notification_token;
    }

    public String getAcr_values() {

        return acr_values;
    }

    public void setAcr_values(String acr_values) {

        this.acr_values = acr_values;
    }

    public String getLogin_hint_token() {

        return login_hint_token;
    }

    public void setLogin_hint_token(String login_hint_token) {

        this.login_hint_token = login_hint_token;
    }

    public String getLogin_hint() {

        return login_hint;
    }

    public void setLogin_hint(String login_hint) {

        this.login_hint = login_hint;
    }

    public String getId_token_hint() {

        return id_token_hint;
    }

    public void setId_token_hint(String id_token_hint) {

        this.id_token_hint = id_token_hint;
    }

    public String getBinding_message() {

        return binding_message;
    }

    public void setBinding_message(String binding_message) {

        this.binding_message = binding_message;
    }

    public String getUser_code() {

        return user_code;
    }

    public void setUser_code(String user_code) {

        this.user_code = user_code;
    }

    public long getRequested_expiry() {

        return requested_expiry;
    }

    public void setRequested_expiry(long requested_expiry) {

        this.requested_expiry = requested_expiry;
    }

    /*
    Getters and setters if signed request.
    */
    public String getAud() {

        return aud;
    }

    public void setAud(String aud) {

        this.aud = aud;
    }

    public String getIss() {

        return iss;
    }

    public void setIss(String iss) {

        this.iss = iss;
    }

    public long getExp() {

        return exp;
    }

    public void setExp(long exp) {

        this.exp = exp;
    }

    public long getIat() {

        return iat;
    }

    public void setIat(long iat) {

        this.iat = iat;
    }

    public long getNbf() {

        return nbf;
    }

    public void setNbf(long nbf) {

        this.nbf = nbf;
    }

    public String getJti() {

        return jti;
    }

    public void setJti(String jti) {

        this.jti = jti;
    }

}
