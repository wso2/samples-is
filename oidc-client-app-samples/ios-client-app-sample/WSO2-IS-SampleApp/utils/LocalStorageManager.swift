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

class LocalStorageManager {
    
    static let shared = LocalStorageManager()
    
    private init(){}
    
    
    /// Saves data to the local storage.
    ///
    /// - Parameters:
    ///   - object: Object to be saved.
    ///   - key: Key to be saved under.
    func saveData(object: Any, key: String) {
        var data: Data? = nil
        data = NSKeyedArchiver.archivedData(withRootObject: object)
        
        UserDefaults.standard.set(data, forKey: key)
        UserDefaults.standard.synchronize()
    }
    
    /// Retrieves data from the local storage.
    ///
    /// - Parameter key: Key which data is stored under.
    /// - Returns: Retrieved data object if exists, nil otherwise.
    func getData(key: String) -> Any? {
        guard let data = UserDefaults.standard.object(forKey: key) as? Data else {
            return nil
        }
        
        return NSKeyedUnarchiver.unarchiveObject(with: data)
    }
    
    
    /// Deletes an entry from local memory stored under a key.
    ///
    /// - Parameter key: Key which the object was saved under.
    /// - Returns: Returns true if the deletion is successful, false otherwise.
    func deleteData(key: String) -> Bool {
        guard let data = UserDefaults.standard.object(forKey: key) as? Data else {
            return false
        }
        let defaults = UserDefaults.standard
        defaults.removeObject(forKey: key)
        defaults.synchronize()
        
        return true
    }
    
    /// Clears the local memory
    func clearLocalMemory() {
        let domain = Bundle.main.bundleIdentifier!
        UserDefaults.standard.removePersistentDomain(forName: domain)
        UserDefaults.standard.synchronize()
    }
    
}
