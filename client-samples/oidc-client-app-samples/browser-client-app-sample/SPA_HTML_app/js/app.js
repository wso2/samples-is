/*
~   Copyright (c) 2018 WSO2 Inc. (http://wso2.com) All Rights Reserved.
~
~   Licensed under the Apache License, Version 2.0 (the "License");
~   you may not use this file except in compliance with the License.
~   You may obtain a copy of the License at
~
~        http://www.apache.org/licenses/LICENSE-2.0
~
~   Unless required by applicable law or agreed to in writing, software
~   distributed under the License is distributed on an "AS IS" BASIS,
~   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
~   See the License for the specific language governing permissions and
~   limitations under the License.
*/



/** 
  To run this app with minimal config changes in order to test this sample app
    1. Install WSO2-IAM Server in your local
    2. Create an SP in WSO2-IAM Server
    3. Specify clientId and clientSecret here in the appConfig JSON
    4. Deploy the sample app with the app folder in <Tomcat installation>/webapps/
*/

var appConfigs = {
  // change the https://localhost:9443 to your WSO2-IAM installation domain name in all the places of appConfigs JSON if necessary
  'authorizeUrl': 'https://localhost:9443/oauth2/authorize',
  'tokenUrl': 'https://localhost:9443/oauth2/token',
  'revokeUrl': 'https://localhost:9443/oauth2/revoke',
  'logoutUrl': 'https://localhost:9443/oidc/logout',
  'userInfoUrl': 'https://localhost:9443/oauth2/userinfo',
  // Possible values are FLOW_TYPE_IMPLICIT and FLOW_TYPE_PKCE, default is FLOW_TYPE_IMPLICIT
  'flowType': FLOW_TYPE_IMPLICIT,
  // Possible values are LOCAL_STORAGE and SESSION_STORAGE, default is LOCAL_STORAGE and SESSION_STORAGE is not not supported yet
  'userStore': LOCAL_STORAGE,
  // Get this value from WSO2-IAM Server Service Provider (SP) definition
  'clientId': 'YDMv8lTAWH42jYiZkdvqHTocFXsa',
  // Get this value from WSO2-IAM Server Service Provider (SP) definition
  'clientSecret': 'dLKJZIvPZX5H_GhTItlQ1eTNEE8a',
  // Specify the redirect URL to land back after login redirect to WSO2-IAM Server login page
  'redirectUri': 'http://localhost:8080/SPA_HTML_app/',
  // This is to specify that you are using openID Connect
  'scope': 'openid',
  // Specify the post logout redirect URL to land back after logout redirect to WSO2-IAM Server logout page
  'postLogoutRedirectUri': 'http://localhost:8080/SPA_HTML_app/'
};

var app = null;
var appLogout = null;
var appPKCE = null;
var appUserInfo = null;

var init = function (authCompletionCallback, logoutCompletionCallback) {

  // Remove any object initialization of you are not using and remove the respective js library file in js folder.
  app = new App(appConfigs);
  appLogout = new AppLogout(app, appConfigs.postLogoutRedirectUri, appConfigs.clientId);
  appPKCE = new AppPKCE(app, appConfigs.clientId, appConfigs.clientSecret, appConfigs.redirectUri, 
    appConfigs.scope, appConfigs.tokenUrl);
  appUserInfo = new AppUserInfo(app, appConfigs.userInfoUrl);

  var appArray = [app, appLogout, appPKCE, appUserInfo];

  app.init(authCompletionCallback);
  appLogout.init(logoutCompletionCallback);
  appPKCE.init(authCompletionCallback);
  // There is no init function in AppUserInfo class

  // check for authorization response if available.
  if (FLOW_TYPE_IMPLICIT == appConfigs.flowType) {
    app.checkForAuthorizationResponse();
  } else if (FLOW_TYPE_PKCE == appConfigs.flowType) {
    appPKCE.checkForAuthorizationResponse();
  }
  appLogout.checkForAuthorizationResponse();

  return appArray;
}

var makeAuthorizationRequest = function () {
  if (FLOW_TYPE_IMPLICIT == appConfigs.flowType) {
    app.makeAuthorizationRequest();
  } else if (FLOW_TYPE_PKCE == appConfigs.flowType) {
    appPKCE.makeAuthorizationRequest();
  }
}
