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
import { App } from '@openid/appauth';

import Home from './Home';
import Profile from './Profile';

class Base extends Component {

    constructor(props) {
        super(props);

        var appConfigs = {
            'authorizeUrl': 'https://localhost:9443/oauth2/authorize', // change the https://localhost:9443 to your WSO2-IAM installation domain name in all the places of appConfigs JSON if necessary
            'tokenUrl': 'https://localhost:9443/oauth2/token',
            'revokeUrl': 'https://localhost:9443/oauth2/revoke',
            'logoutUrl': 'https://localhost:9443/oidc/logout',
            'userInfoUrl': 'https://localhost:9443/oauth2/userinfo',
            'flowType': "PKCE", // Possible values are IMPLICIT and PKCE, default is IMPLICIT
            'userStore': "LOCAL_STORAGE", // Possible values are LOCAL_STORAGE and SESSION_STORAGE, default is LOCAL_STORAGE and SESSION_STORAGE is not not supported yet
            'clientId': '0Ob7gGlPWWoCMx4qrGNSWjRgnMwa', // Get this value from WSO2-IAM Server Service Provider (SP) definition
            'clientSecret': '4jjZU5nke4iovlq5seaSPVxnqBMa', // Get this value from WSO2-IAM Server Service Provider (SP) definition
            'redirectUri': 'http://localhost:7777/', // Specify the redirect URL to land back after login redirect to WSO2-IAM Server login page
            'scope': 'openid', // This is to specify that you are using openID Connect
            'postLogoutRedirectUri': 'http://localhost:7777/' // Specify the post logout redirect URL to land back after logout redirect to WSO2-IAM Server logout page
          };
      
        this.application = new App(appConfigs);
    }

    componentDidMount() {
        this.application.init();
    }

    // To demonstrate SPA, 2 links with 2 pages should be added, thus in profile page, there should be a validation to check whether
    // the user is logged in to show the content of the profile page
   render() {
      return (
         <BrowserRouter>
            <Switch>
                <Route exact path='/' component={(props) => <Profile application={this.application} {...props}/>} />
                <Route exact path='/Profile' component={(props) => <Home application={this.application} {...props}/>} />
            </Switch>
         </BrowserRouter>
      );
   }
}
export default Base;