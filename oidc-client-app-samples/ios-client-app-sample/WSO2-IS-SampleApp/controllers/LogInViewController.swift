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

import UIKit
import AppAuth

class LogInViewController: UIViewController {
    
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
    
    var userInfo: UserInfo!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        var configFileDictionary: NSDictionary?
        
        self.authState = AuthStateManager.shared.getAuthState()
        
        //Load configurations into the resourceFileDictionary dictionary
        if let path = Bundle.main.path(forResource: "Config", ofType: "plist") {
            configFileDictionary = NSDictionary(contentsOfFile: path)
        }
        
        // Load auth state if exists
        let authState = AuthStateManager.shared.getAuthState()
        if (authState != nil) {
            self.authState = authState
        }
        
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

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }

    /// Disable auto-rotate
    override open var shouldAutorotate: Bool {
        return false
    }

    // MARK: Actions
    @IBAction func loginButtonAction(_ sender: UIButton) {
        // Action when the login button is clicked
        startAuthWithPKCE()
    }
    
    /// Starts authorization flow.
    func startAuthWithPKCE() {
        
        let authURL = URL(string: authURLStr!)
        let tokenURL = URL(string: tokenURLStr!)
        let redirectURL = URL(string: redirectURLStr!)
        let userInfoURL = URL(string: userInfoURLStr!)
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        
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
        appDelegate.externalUserAgentSession = OIDAuthState.authState(byPresenting: authRequest, presenting: self,
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
                self.present(alert, animated: true, completion: nil)
            }
            
            // Authorization request success
            if let authState = authorizationState {
                self.setAuthState(authState)
                self.accessToken = authState.lastTokenResponse?.accessToken!
                self.refreshToken = authState.lastTokenResponse?.refreshToken!
                self.idToken = authState.lastTokenResponse?.idToken!
                
                OAuthUtils.shared.retrieveUserInfo(userInfoURL: userInfoURL!, authState: authState, completion: {
                    (userInfo: UserInfo?) -> Void in
                    if let uI = userInfo {
                       self.logIn(userInfo: uI)
                    } else {
                        print(NSLocalizedString("error.userinfo.fetch", comment:
                            Constants.ErrorMessages.kUserInfoFetchError))
                        let alert = UIAlertController(title: "Error", message: NSLocalizedString(
                            "error.userinfo.fetch", comment: Constants.ErrorMessages.kUserInfoFetchError),
                                                      preferredStyle: UIAlertControllerStyle.alert)
                        alert.addAction(UIAlertAction(title: "Ok", style: UIAlertActionStyle.default, handler: nil))
                        self.present(alert, animated: true, completion: nil)
                    }
                })
            }
        })
        
    }
    
    /// Logs user in and switches to the next view.
    func logIn(userInfo: UserInfo?) {
        print("Access Token: " + accessToken!)
        print("Refresh Token: " + refreshToken!)
        print("ID Token: " + idToken!)

        UserInfoManager.shared.saveUserInfo(userInfo: userInfo!)
        performSegue(withIdentifier: "loggedInSegue", sender: self)
    }
    
    // MARK: - Navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let loggedInVC : ProfileViewController = segue.destination as! ProfileViewController
        loggedInVC.authState = self.authState
        loggedInVC.clientId = self.clientId
        if let userInfo = self.userInfo {
            loggedInVC.userInfo = userInfo
        }
    }
    
}

//MARK: OIDAuthState Delegate
extension LogInViewController: OIDAuthStateChangeDelegate, OIDAuthStateErrorDelegate {
    
    func didChange(_ state: OIDAuthState) {
        self.authStateChanged()
    }
    
    func authState(_ state: OIDAuthState, didEncounterAuthorizationError error: Error) {
        print("Authorization error: \(error)")
    }
    
}

//MARK: Helper Methods
extension LogInViewController {
 
    /// Sets or updates the auth state.
    func setAuthState(_ authState: OIDAuthState?) {
        if (self.authState == authState) {
            return;
        }
        self.authState = authState;
        self.authState?.stateChangeDelegate = self;
        self.authStateChanged()
    }
    
    /// Updates the state when a change occures.
    func authStateChanged() {
        AuthStateManager.shared.saveAuthState(authState: self.authState!)
    }
    
    /// Clears the auth state.
    func clearAuthState() {
        self.authState = nil
    }
    
}

