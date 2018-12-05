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

import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { App, FLOW_TYPE_IMPLICIT, FLOW_TYPE_PKCE, LOCAL_STORAGE } from '@openid/appauth';
import { AppLogout } from '@wso2/appauth-ext-logout';
import { AppPKCE } from '@wso2/appauth-ext-pkce';
import { AppUserInfo } from '@wso2/appauth-ext-userinfo';

import Home from './Home';
import Profile from './Profile';

class Base extends Component {

    constructor(props) {
        super(props);

        var appConfigs = {
            // change the https://localhost:9443 to your WSO2-IAM installation domain name in all the places of appConfigs JSON if necessary
            'authorizeUrl': 'https://localhost:9443/oauth2/authorize',
            'tokenUrl': 'https://localhost:9443/oauth2/token',
            'revokeUrl': 'https://localhost:9443/oauth2/revoke',
            'logoutUrl': 'https://localhost:9443/oidc/logout',
            'userInfoUrl': 'https://localhost:9443/oauth2/userinfo',
            // Possible values are FLOW_TYPE_IMPLICIT and FLOW_TYPE_PKCE, default is FLOW_TYPE_IMPLICIT
            'flowType': FLOW_TYPE_PKCE,
            // Possible values are LOCAL_STORAGE and SESSION_STORAGE, default is LOCAL_STORAGE and SESSION_STORAGE is not not supported yet
            'userStore': LOCAL_STORAGE,
            // Get this value from WSO2-IAM Server Service Provider (SP) definition
            'clientId': '0Ob7gGlPWWoCMx4qrGNSWjRgnMwa',
            // Get this value from WSO2-IAM Server Service Provider (SP) definition
            'clientSecret': '4jjZU5nke4iovlq5seaSPVxnqBMa',
            // Specify the redirect URL to land back after login redirect to WSO2-IAM Server login page
            'redirectUri': 'http://localhost:7777/',
            // This is to specify that you are using openID Connect
            'scope': 'openid',
            // Specify the post logout redirect URL to land back after logout redirect to WSO2-IAM Server logout page
            'postLogoutRedirectUri': 'http://localhost:7777/'
          };
      
        this.app = new App(appConfigs);
        this.appLogout = new AppLogout(this.app, appConfigs.postLogoutRedirectUri, appConfigs.clientId);
        this.appPKCE = new AppPKCE(this.app, appConfigs.clientId, appConfigs.clientSecret, appConfigs.redirectUri, 
            appConfigs.scope, appConfigs.tokenUrl);
        this.appUserInfo = new AppUserInfo(this.app, appConfigs.userInfoUrl);
    }

    componentDidMount() {
        this.app.init();
        this.appLogout.init();
        this.appPKCE.init();
    }

    // To demonstrate SPA, 2 links with 2 pages should be added, thus in profile page, there should be a validation to check whether
    // the user is logged in to show the content of the profile page
   render() {
      return (
         <BrowserRouter>
            <Switch>
                <Route exact path='/' component={(props) => <Profile app={this.app} appLogout={this.appLogout}
                         appPKCE={this.appPKCE} appUserInfo={this.appUserInfo} {...props}/>} />
                <Route exact path='/Profile' component={(props) => <Home app={this.app} appLogout={this.appLogout}
                         appPKCE={this.appPKCE} appUserInfo={this.appUserInfo} {...props}/>} />
            </Switch>
         </BrowserRouter>
      );
   }
}
export default Base;
