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

class AuthStateManager {
    
    static let shared = AuthStateManager()
    
    private init(){}
    
    let storageManager = LocalStorageManager.shared
    let kDefaultAuthStateKey = "authState"
    
    
    /// Saves the auth state to memory with a given key.
    ///
    /// - Parameters:
    ///   - authState: Authorization state.
    ///   - authStateKey: Key to store authorization state.
    func saveAuthState(authState: OIDAuthState, authStateKey: String) {
        storageManager.saveData(object: authState, key: authStateKey)
    }
    
    /// Saves the auth state to memory with default key.
    ///
    /// - Parameter authState: Authorization state.
    func saveAuthState(authState: OIDAuthState) {
        storageManager.saveData(object: authState, key: kDefaultAuthStateKey)
    }
    
    /// Retrieves the auth state from memory from a given key.
    ///
    /// - Parameter authStateKey: Key to retrieve authorization state.
    /// - Returns: Retrieved authorization state if exists, nil otherwise.
    func getAuthState(authStateKey: String) -> OIDAuthState? {
        if let authState = storageManager.getData(key: authStateKey) as? OIDAuthState {
            return authState
        } else {
            return nil
        }
    }
    
    /// Retrieves the auth state from memory from default key.
    ///
    /// - Returns: Retrieved authorization state if exists, nil otherwise.
    func getAuthState() -> OIDAuthState? {
        if let authState = storageManager.getData(key: kDefaultAuthStateKey) as? OIDAuthState {
            return authState
        } else {
            return nil
        }
    }
    
}
