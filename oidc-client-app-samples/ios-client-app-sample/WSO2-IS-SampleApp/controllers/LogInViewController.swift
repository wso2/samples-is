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
    
    let appDelegate = UIApplication.shared.delegate as! AppDelegate
    var userInfo: UserInfo!

    override func viewDidLoad() {
        super.viewDidLoad()
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
        guard let configPath = Bundle.main.path(forResource: "Config", ofType: "plist") else {
            let alert = UIAlertController(title: NSLocalizedString("info.alert.signin.fail.title",
                                                                   comment: "Could not sign you in"),
                                          message: NSLocalizedString("error.login.fail",
                                                                     comment: Constants.ErrorMessages.kLogInFail),
                                          preferredStyle: UIAlertControllerStyle.alert)
            alert.addAction(UIAlertAction(title: "Ok", style: UIAlertActionStyle.default, handler: nil))
            self.present(alert, animated: true, completion: nil)
            return
        }
        
        WSO2OIDCAuthService.shared.logInUser(configFilePath: configPath, callingViewController: self, completion: {
            (userInfo: UserInfo?) -> Void in
            
            if let uI = userInfo {
                UserInfoManager.shared.saveUserInfo(userInfo: uI)
                self.performSegue(withIdentifier: "loggedInSegue", sender: self)
                self.userInfo = uI
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
    
    // MARK: - Navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        let loggedInVC : ProfileViewController = segue.destination as! ProfileViewController
        if let userInfo = self.userInfo {
            loggedInVC.userInfo = userInfo
        }
    }
    
}


