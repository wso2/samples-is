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

import Foundation
import AppAuth

class WSO2OIDCAuthService {
    
    static let shared = WSO2OIDCAuthService()
    
    private init(){}
    
    // Configuration Properties
    var clientId: String?
    var issuerURLStr: String?
    var redirectURLStr: String?
    var authURLStr: String?
    var tokenURLStr: String?
    var userInfoURLStr: String?
    var logoutURLStr: String?
    
    // Tokens
    var accessToken: String?
    var refreshToken: String?
    var idToken: String?
    
    let kAuthStateKey = "authState"
    var authState: OIDAuthState?
    var config: OIDServiceConfiguration?
    var configFileDictionary: NSDictionary?
    
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    var userAgent:OIDExternalUserAgentIOS?
    
    
    /// Logs in user.
    ///
    /// - Parameters:
    ///   - configFilePath: Configuration file path.
    ///   - callingViewController: Calling view controller.
    ///   - completion: Completion callback.
    func logInUser(configFilePath: String, callingViewController: UIViewController,
                           completion: @escaping (_ userInfo : UserInfo?) -> Void) {
        
        self.authState = AuthStateManager.shared.getAuthState()
        
        //Load configurations into the resourceFileDictionary dictionary
        configFileDictionary = NSDictionary(contentsOfFile: configFilePath)
        
        // Read from dictionary content
        if let configFileDictionaryContent = configFileDictionary {
            clientId = configFileDictionaryContent.object(forKey:
                Constants.OAuthReqConstants.kClientIdPropKey) as? String
            issuerURLStr = configFileDictionaryContent.object(forKey:
                Constants.OAuthReqConstants.kIssuerIdPropKey) as? String
            redirectURLStr = configFileDictionaryContent.object(forKey:
                Constants.OAuthReqConstants.kRedirectURLPropKey) as? String
            authURLStr = configFileDictionaryContent.object(forKey:
                Constants.OAuthReqConstants.kAuthURLPropKey) as? String
            tokenURLStr = configFileDictionaryContent.object(forKey:
                Constants.OAuthReqConstants.kTokenURLPropKey) as? String
            userInfoURLStr = configFileDictionaryContent.object(forKey:
                Constants.OAuthReqConstants.kUserInfoURLPropKey) as? String
            logoutURLStr = configFileDictionaryContent.object(forKey:
                Constants.OAuthReqConstants.kLogoutURLPropKey) as? String
        }
        
        let authURL = URL(string: authURLStr!)
        let tokenURL = URL(string: tokenURLStr!)
        let redirectURL = URL(string: redirectURLStr!)
        let userInfoURL = URL(string: userInfoURLStr!)
        
        // Configure OIDC Service
        self.config = OIDServiceConfiguration(authorizationEndpoint: authURL!, tokenEndpoint: tokenURL!)
        
        // Generate authorization request with PKCE
        let authRequest = OIDAuthorizationRequest(configuration: config!,
                                                  clientId: clientId!,
                                                  scopes: [Constants.OAuthReqConstants.kScope],
                                                  redirectURL: redirectURL!,
                                                  responseType: OIDResponseTypeCode,
                                                  additionalParameters: nil)
        
        // Perform authorization
        appDelegate.externalUserAgentSession = OIDAuthState.authState(byPresenting: authRequest,
                                                                      presenting: callingViewController,
                                                                      callback: { (authorizationState, error) in
                                                                        
            // Handle authorization error
            if let e = error {
                print(NSLocalizedString("error.authorization", comment: Constants.ErrorMessages.kAuthorizationError) +
                    " : " + e.localizedDescription)
                let alert = UIAlertController(title: NSLocalizedString("info.alert.signin.fail.title",
                                                                       comment: "Could not sign you in"),
                                              message: NSLocalizedString("error.login.fail",
                                                                         comment: Constants.ErrorMessages.kLogInFail),
                                              preferredStyle: UIAlertControllerStyle.alert)
                alert.addAction(UIAlertAction(title: "Ok", style: UIAlertActionStyle.default, handler: nil))
                callingViewController.present(alert, animated: true, completion: nil)
            }
            
            // Authorization request success
            if let authState = authorizationState {
                self.authState = authState
                self.accessToken = authState.lastTokenResponse?.accessToken!
                self.refreshToken = authState.lastTokenResponse?.refreshToken!
                self.idToken = authState.lastTokenResponse?.idToken!
                
                print("Access Token: " + self.accessToken!)
                print("Refresh Token: " + self.refreshToken!)
                print("ID Token: " + self.idToken!)
                
                self.retrieveUserInfo(userInfoURL: userInfoURL!, authState: authState, completion: {
                    (userInfo: UserInfo?) -> Void in
                    if let uI = userInfo {
                        completion(uI)
                    } else {
                        completion(nil)
                    }
                })
            }
        })
        
    }
    
    /// Log out the user and clears the local application memory.
    ///
    /// - Parameters:
    ///   - callingViewController: Calling view controller.
    ///   - targetViewControllerId: Target view controller to redirect the user after logging out.
    func logOutUser(callingViewController: UIViewController, targetViewControllerId: String) {
        
        // Retrieve ID token from current state
        let currentIdToken: String? = authState?.lastTokenResponse?.idToken
        
        self.userAgent = OIDExternalUserAgentIOS(presenting: callingViewController)
        
        // Attempt to fetch fresh tokens if current tokens are expired and perform user info retrieval
        authState?.performAction() { (accessToken, idToken, error) in
            
            if error != nil  {
                print(NSLocalizedString("error.fetch.freshtokens", comment:
                    Constants.ErrorMessages.kErrorFetchingFreshTokens) +
                    " \(error?.localizedDescription ?? Constants.LogTags.kError)")
                return
            }
            
            guard let idToken = idToken else {
                print(NSLocalizedString("error.fetch.idtoken", comment:
                    Constants.ErrorMessages.kErrorRetrievingIdToken))
                return
            }
            
            if currentIdToken != idToken {
                print(NSLocalizedString("info.idtoken.refreshed", comment:
                    Constants.LogInfoMessages.kAccessTokenRefreshed)  +
                    ": (\(currentIdToken ?? Constants.LogTags.kCurrentIdToken) to \(idToken))")
            } else {
                print(NSLocalizedString("info.idtoken.valid", comment:
                    Constants.LogInfoMessages.kIdTokenValid))
            }
            
        }
        
        // Log out from the OP
        let alert = UIAlertController(title: NSLocalizedString("info.external.logout.notify.title",
                                                               comment: "Logout from WSO2"),
                                      message: NSLocalizedString("info.external.logout.notify.message",
                                                                 comment: "You will be redirected to the" +
                                        "log out page of WSO2"), preferredStyle: UIAlertControllerStyle.alert)
        
        // add an action (button)
        alert.addAction(UIAlertAction(title: "Ok", style: UIAlertActionStyle.default, handler: {
            (action: UIAlertAction!) in
            
            // Redirect to the OP's logout page
            let logoutURL = URL(string: self.logoutURLStr!)
            let authURL = URL(string: self.authURLStr!)
            let tokenURL = URL(string: self.tokenURLStr!)
            let postLogoutRedirURL = URL(string: self.redirectURLStr!)
            
            let config = OIDServiceConfiguration(authorizationEndpoint: authURL!, tokenEndpoint: tokenURL!,
                                                 issuer: nil, registrationEndpoint: nil, endSessionEndpoint: logoutURL)
            
            let logoutRequest = OIDEndSessionRequest(configuration: config, idTokenHint: currentIdToken!,
                                                     postLogoutRedirectURL: postLogoutRedirURL!,
                                                     state: (self.authState?.lastAuthorizationResponse.state)!,
                                                     additionalParameters: nil)
            
            self.appDelegate.externalUserAgentSession = OIDAuthorizationService.present(
                logoutRequest, externalUserAgent: self.userAgent!, callback: { (authorizationState, error) in })
        }))
        
        callingViewController.present(alert, animated: true, completion: nil)
        
        // Log out locally
        appDelegate.externalUserAgentSession = nil
        LocalStorageManager.shared.clearLocalMemory()
        let storyBoard = UIStoryboard(name: "Main", bundle: Bundle.main)
        let viewController = storyBoard.instantiateViewController(withIdentifier: targetViewControllerId)
        self.appDelegate.window?.rootViewController = viewController
        viewController.view.window?.rootViewController?.dismiss(animated: true, completion: nil)
    }
    

    /// Retrieves user information from the server using the access token.
    ///
    /// - Parameters:
    ///   - userInfoURL: User info URL.
    ///   - authState: Authentication state.
    ///   - completion: Completion callback.
    private func retrieveUserInfo(userInfoURL: URL, authState: OIDAuthState?,
                          completion: @escaping (_ userInfo : UserInfo?) -> Void) {
        
        // Retrieve access token from current state
        let currentAccessToken: String? = authState?.lastTokenResponse?.accessToken
        
        var jsonResponse: [String: Any]?
        
        // Attempt to fetch fresh tokens if current tokens are expired and perform user info retrieval
        authState?.performAction() { (accessToken, idToken, error) in
            
            if error != nil  {
                print(NSLocalizedString("error.fetch.freshtokens",
                                        comment: Constants.ErrorMessages.kErrorFetchingFreshTokens) +
                    " \(error?.localizedDescription ?? Constants.LogTags.kError)")
                return
            }
            
            guard let accessToken = accessToken else {
                print(NSLocalizedString("error.fetch.accesstoken",
                                        comment: Constants.ErrorMessages.kErrorRetrievingAccessToken))
                return
            }
            
            if currentAccessToken != accessToken {
                print(NSLocalizedString("info.accesstoken.refreshed",
                                        comment: Constants.LogInfoMessages.kAccessTokenRefreshed) +
                    ": (\(currentAccessToken ?? Constants.LogTags.kCurrentAccessToken) to \(accessToken))")
            } else {
                print(NSLocalizedString("info.accesstoken.valid",
                                        comment: Constants.LogInfoMessages.kAccessTokenValid) + ": \(accessToken)")
            }
            
            // Build user info request
            var urlRequest = URLRequest(url: userInfoURL)
            urlRequest.httpMethod = "GET"
            // Request header
            urlRequest.allHTTPHeaderFields = ["Authorization":"Bearer \(accessToken)"]
            
            // Retrieve user information
            let task = URLSession.shared.dataTask(with: urlRequest) { data, response, error in
                
                DispatchQueue.main.async {
                    
                    guard error == nil else {
                        print(NSLocalizedString("error.http.request.fail",
                                                comment: Constants.ErrorMessages.kHTTPRequestFailed) +
                            " \(error?.localizedDescription ?? Constants.LogTags.kError)")
                        return
                    }
                    
                    // Check for non-HTTP response
                    guard let response = response as? HTTPURLResponse else {
                        print(NSLocalizedString("info.nonhttp.response",
                                                comment: Constants.LogInfoMessages.kNonHTTPResponse))
                        return
                    }
                    
                    // Check for empty response
                    guard let data = data else {
                        print(NSLocalizedString("info.http.response.empty",
                                                comment: Constants.LogInfoMessages.kHTTPResponseEmpty))
                        return
                    }
                    
                    // Parse data into a JSON object
                    do {
                        jsonResponse = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
                    } catch {
                        print(NSLocalizedString("error.json.serialization",
                                                comment: Constants.ErrorMessages.kJSONSerializationError))
                    }
                    
                    // Response with an error
                    if response.statusCode != Constants.HTTPResponseCodes.kOk {
                        let responseText: String? = String(data: data, encoding: String.Encoding.utf8)
                        
                        if response.statusCode == Constants.HTTPResponseCodes.kUnauthorised {
                            // Possible an issue with the authorization grant
                            let oAuthError =
                                OIDErrorUtilities.resourceServerAuthorizationError(withCode: 0,
                                                                                   errorResponse: jsonResponse,
                                                                                   underlyingError: error)
                            authState?.update(withAuthorizationError: oAuthError)
                            print(Constants.ErrorMessages.kAuthorizationError +
                                " (\(oAuthError)). Response: \(responseText ?? Constants.LogTags.kResponseText)")
                        } else {
                            print(Constants.LogTags.kHTTP +
                                "\(response.statusCode), Response: \(responseText ?? Constants.LogTags.kResponseText)")
                        }
                    }
                    
                    if let json = jsonResponse {
                        print(NSLocalizedString("info.information.fetch.success",
                                                comment:Constants.LogInfoMessages.kInfoRetrievalSuccess) + ": \(json)")
                        let userName = jsonResponse!["sub"] as? String
                        var userInfo: UserInfo?
                        if let un = userName {
                            userInfo = UserInfo(userName: un)
                        }
                        completion(userInfo)
                    }
                }
            }
            task.resume()
        }
    }
    
    
    /// Reads from a configuration property file.
    ///
    /// - Parameter path: Property file path.
    private func readConfig(path: String) {
        var configFileDictionary: NSDictionary?
    
        //Load configurations into the resourceFileDictionary dictionary
        configFileDictionary = NSDictionary(contentsOfFile: path)
        
        // Read from dictionary content
        if let configFileDictionaryContent = configFileDictionary {
            clientId = configFileDictionaryContent.object(forKey:
                Constants.OAuthReqConstants.kClientIdPropKey) as? String
            issuerURLStr = configFileDictionaryContent.object(forKey:
                Constants.OAuthReqConstants.kIssuerIdPropKey) as? String
            redirectURLStr = configFileDictionaryContent.object(forKey:
                Constants.OAuthReqConstants.kRedirectURLPropKey) as? String
            authURLStr = configFileDictionaryContent.object(forKey:
                Constants.OAuthReqConstants.kAuthURLPropKey) as? String
            tokenURLStr = configFileDictionaryContent.object(forKey:
                Constants.OAuthReqConstants.kTokenURLPropKey) as? String
            userInfoURLStr = configFileDictionaryContent.object(forKey:
                Constants.OAuthReqConstants.kUserInfoURLPropKey) as? String
            logoutURLStr = configFileDictionaryContent.object(forKey:
                Constants.OAuthReqConstants.kLogoutURLPropKey) as? String
        }
        
    }
    
}
