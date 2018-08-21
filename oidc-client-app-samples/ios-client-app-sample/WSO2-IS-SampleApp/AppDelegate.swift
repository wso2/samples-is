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

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    let authStateManager = AuthStateManager.shared
    
    // External user agent session
    var externalUserAgentSession: OIDExternalUserAgentSession?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions:
        [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        
        // Resume app if already run
        if (authStateManager.getAuthState() != nil) {
            let storyBoard = UIStoryboard(name: "Main", bundle: Bundle.main)
            let viewController = storyBoard.instantiateViewController(withIdentifier: "profileVc")
            self.window?.rootViewController = viewController
        }
        
        return true
    }
    
    func application(_ app: UIApplication, open url: URL, options:
        [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {

        if let authorizationFlow = self.externalUserAgentSession,
            authorizationFlow.resumeExternalUserAgentFlow(with: url) {
            self.externalUserAgentSession = nil
            return true
        }

        return false
    }

}

