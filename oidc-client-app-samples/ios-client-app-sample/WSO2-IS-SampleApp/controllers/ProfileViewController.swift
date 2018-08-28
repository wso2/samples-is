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
import SafariServices

class ProfileViewController: UIViewController, SFSafariViewControllerDelegate {
    
    var logoutURLStr: String?
    var authURLStr: String?
    var tokenURLStr: String?
    var authState: OIDAuthState?
    var redirectURLStr: String?
    var clientId: String?
    var userInfo: UserInfo?
    
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    var userAgent:OIDExternalUserAgentIOS?
    
    // MARK: Properties
    @IBOutlet weak var userNameLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        if self.authState == nil {
            self.authState = AuthStateManager.shared.getAuthState()
        }
        
        if self.userInfo == nil {
            self.userInfo = UserInfoManager.shared.getUserInfo()
        }

        // Setting user information to labels
        if let userInfo = self.userInfo {
            userNameLabel.text = userInfo.userName
        }
    
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    // MARK: Actions
    @IBAction func signOutButton(_ sender: UIButton) {
        let refreshAlert = UIAlertController(title: NSLocalizedString("info.alert.signout.title",
                                                                      comment: "Sign out"),
                                             message: NSLocalizedString("info.alert.signout.message",
                                                                        comment: "Are you sure you want to logout? " +
                                                "This will clear all your data on this device."),
                                             preferredStyle: UIAlertControllerStyle.alert)
        
        refreshAlert.addAction(UIAlertAction(title: "Yes", style: .default, handler: { (action: UIAlertAction!) in
            WSO2OIDCAuthService.shared.logOutUser(callingViewController: self, targetViewControllerId: "loginVC")
        }))
        
        refreshAlert.addAction(UIAlertAction(title: "No", style: .cancel, handler: { (action: UIAlertAction!) in }))
        
        present(refreshAlert, animated: true, completion: nil)
    }

}
