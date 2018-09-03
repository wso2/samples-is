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
  'authorizeUrl': 'https://localhost:9443/oauth2/authorize', // change the https://localhost:9443 to your WSO2-IAM installation domain name in all the places of appConfigs JSON if necessary
  'tokenUrl': 'https://localhost:9443/oauth2/token',
  'revokeUrl': 'https://localhost:9443/oauth2/revoke',
  'logoutUrl': 'https://localhost:9443/oidc/logout',
  'userInfoUrl': 'https://localhost:9443/oauth2/userinfo',
  'flowType': "PKCE", // Possible values are IMPLICIT and PKCE, default is IMPLICIT
  'userStore': "LOCAL_STORAGE", // Possible values are LOCAL_STORAGE and SESSION_STORAGE, default is LOCAL_STORAGE and SESSION_STORAGE is not not supported yet
  'clientId': '0Ob7gGlPWWoCMx4qrGNSWjRgnMwa', // Get this value from WSO2-IAM Server Service Provider (SP) definition
  'clientSecret': '4jjZU5nke4iovlq5seaSPVxnqBMa', // Get this value from WSO2-IAM Server Service Provider (SP) definition
  'redirectUri': 'http://localhost:8080/app/', // Specify the redirect URL to land back after login redirect to WSO2-IAM Server login page
  'scope': 'openid', // This is to specify that you are using openID Connect
  'postLogoutRedirectUri': 'http://localhost:8080/app/' // Specify the post logout redirect URL to land back after logout redirect to WSO2-IAM Server logout page
};

var init = function (authCompletionCallback, logoutCompletionCallback) {
  var application = new App(appConfigs);

  application.init(authCompletionCallback, logoutCompletionCallback);

  // check for authorization response if available.
  application.checkForAuthorizationResponse();

  return application;
}
