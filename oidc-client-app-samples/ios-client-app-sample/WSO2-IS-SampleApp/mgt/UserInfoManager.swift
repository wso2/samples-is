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

class UserInfoManager {
    
    static let shared = UserInfoManager()
    
    private init(){}
    
    let storageManager = LocalStorageManager.shared
    let kDefaultUserInfoKey = "userInfo"
    
    /// Saves user information to memory with a given key.
    ///
    /// - Parameters:
    ///   - userInfo: User information.
    ///   - userInfoKey: Key to store user information.
    func saveUserInfo(userInfo: UserInfo, userInfoKey: String) {
        storageManager.saveData(object: userInfo, key: userInfoKey)
    }
    
    /// Saves user information to memory with default key.
    ///
    /// - Parameter userInfo: User information.
    func saveUserInfo(userInfo: UserInfo) {
        storageManager.saveData(object: userInfo, key: kDefaultUserInfoKey)
    }
    
    /// Retrieves user information from memory for a given key.
    ///
    /// - Parameter userInfoKey: Key to retrieve user information.
    /// - Returns: Retrieved user information if exist, nil otherwise.
    func getUserInfo(userInfoKey: String) -> UserInfo? {
        if let userInfo = storageManager.getData(key: userInfoKey) as? UserInfo {
            return userInfo
        } else {
            return nil
        }
    }
    
    /// Retrieves user information from memory for the default key.
    ///
    /// - Returns: Retrieved user information if exist, nil otherwise.
    func getUserInfo() -> UserInfo? {
        if let userInfo = storageManager.getData(key: kDefaultUserInfoKey) as? UserInfo {
            return userInfo
        } else {
            return nil
        }
    }
    
}
