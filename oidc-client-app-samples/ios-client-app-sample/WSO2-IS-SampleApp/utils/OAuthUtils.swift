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

class OAuthUtils {
    
    static let shared = OAuthUtils()
    
    private init(){}
    
    /// Retrieves user information from the server using the access token.
    ///
    /// - Parameters:
    ///   - userInfoEP: User information endpoint.
    /// - Returns: User information as a JSON object.
    func retrieveUserInfo(userInfoURL: URL, authState: OIDAuthState?,
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
    
    /// Decodes JWT tokens.
    ///
    /// - Parameter jwt: JWT Token string.
    /// - Returns: Decoded JWT token.
    func decodeJWT(jwtToken jwt: String) -> [String: Any] {
        let segments = jwt.components(separatedBy: ".")
        return decodeJWTPart(segments[1]) ?? [:]
    }
    
    /// Decodes Base64 URLs.
    ///
    /// - Parameter value: Base64 encoded string.
    /// - Returns: Decoded string.
    func base64UrlDecode(_ value: String) -> Data? {
        var base64 = value
            .replacingOccurrences(of: "-", with: "+")
            .replacingOccurrences(of: "_", with: "/")
        
        let length = Double(base64.lengthOfBytes(using: String.Encoding.utf8))
        let requiredLength = 4 * ceil(length / 4.0)
        let paddingLength = requiredLength - length
        if paddingLength > 0 {
            let padding = "".padding(toLength: Int(paddingLength), withPad: "=", startingAt: 0)
            base64 = base64 + padding
        }
        return Data(base64Encoded: base64, options: .ignoreUnknownCharacters)
    }
    
    /// Decodes a segment of JWT.
    ///
    /// - Parameter value: JWT Segment.
    /// - Returns: Decoded JWT segment as a string.
    func decodeJWTPart(_ value: String) -> [String: Any]? {
        guard let bodyData = base64UrlDecode(value),
            let json = try? JSONSerialization.jsonObject(with: bodyData, options: []), let payload =
            json as? [String: Any] else {
                return nil
        }
        return payload
    }
    
}
