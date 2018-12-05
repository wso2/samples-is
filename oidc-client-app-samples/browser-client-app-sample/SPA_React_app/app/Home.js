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

import { FLOW_TYPE_IMPLICIT, FLOW_TYPE_PKCE } from '@openid/appauth';

class Home extends Component {

  constructor(props) {
    super(props);

    this.app = props.app;
    this.appLogout = props.appLogout;
    this.appPKCE = props.appPKCE;
    this.appUserInfo = props.appUserInfo;

    // This binding is necessary to make `this` work in the callback
    this.loginClick = this.loginClick.bind(this);
  }

  componentDidMount() {

    // Redirect completion callback method execution for authorization completion callback and end session (logout) completion callabck.
    if (this.app.getConfiguration().flowType == FLOW_TYPE_IMPLICIT) {
      this.app.checkForAuthorizationResponse();
    } else if (this.app.getConfiguration().flowType == FLOW_TYPE_PKCE) {
      this.appPKCE.checkForAuthorizationResponse();
    }
    this.appLogout.checkForAuthorizationResponse();
    
  }

  loginClick() {

    // Execute OIDC authorize requests against WSO2 IS server
    if (this.app.getConfiguration().flowType == FLOW_TYPE_IMPLICIT) {
      this.app.makeAuthorizationRequest();
    } else if (this.app.getConfiguration().flowType == FLOW_TYPE_PKCE) {
      this.appPKCE.makeAuthorizationRequest();
    }
  }

   render() {
      return (
        <div class="login-dispatch">
          <section id="login">
            <div class="container">
              <div class="row">
                <div class="col-md-4 col-md-offset-4">
                  <div class="form-wrap-header">
                    <img src="resources/img/logo.png" class="center-block pickup-logo-login" alt="pickup-logo" />
                    <span class="app-title center-block">WSO2-IAM OIDC SPA React</span>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 col-md-offset-4">
                  <div class="form-wrap">
                    <button class="btn btn-custom btn-lg btn-block custom-primary add-margin-top-4x" onClick={this.loginClick}>Login</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <footer id="footer" class="login-footer login-dispatch">
            <div class="container">
              <div class="row">
                <div class="col-md-12">
                  <span class="text-muted">Copyright &copy;  <a href="http://wso2.com/" target="_blank" class="wso2-logo-link"><img src="resources/img/wso2-light.svg" class="wso2-logo" alt="wso2-logo" /></a> &nbsp;2018</span>
                </div>
              </div>
            </div>
          </footer>  
        </div>
      );
   }
}
export default Home;
