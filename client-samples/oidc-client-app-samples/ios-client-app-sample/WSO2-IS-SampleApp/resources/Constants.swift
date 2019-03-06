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

class Constants {
    
    static let shared = Constants()
    
    private init(){}
    
    /// Constants related to OAuth
    struct OAuthReqConstants {
        static let kClientIdPropKey: String = "ClientID"
        static let kIssuerIdPropKey: String = "IssuerURL"
        static let kRedirectURLPropKey: String = "RedirectURL"
        static let kAuthURLPropKey: String = "AuthURL"
        static let kTokenURLPropKey: String = "TokenURL"
        static let kScope: String = "openid"
        static let kUserInfoURLPropKey = "UserInfoURL"
        static let kLogoutURLPropKey = "LogOutURL"
    }
    
    /// Fallback error messages
    struct ErrorMessages {
        static let kAuthorizationErrorGeneral = "Authorization failed."
        static let kErrorFetchingFreshTokens = "Error fetching fresh tokens."
        static let kErrorRetrievingAccessToken = "Error retrieving access token."
        static let kErrorRetrievingIdToken = "Error retrieving ID token."
        static let kHTTPRequestFailed = "HTTP request failed."
        static let kJSONSerializationError = "JSON Serialization Error."
        static let kAuthorizationError = "Authorization Error."
        static let kUserInfoFetchError = "Error fetching user information."
        static let kLogInFail = "Could not log you in"
    }
    
    /// Log message tags
    struct LogTags {
        static let kError = "ERROR"
        static let kResponseText = "RESPONSE_TEXT"
        static let kCurrentAccessToken = "CURRENT_ACCESS_TOKEN"
        static let kCurrentIdToken = "CURRENT_ID_TOKEN"
        static let kHTTP = "HTTP"
    }
    
    /// Log messages
    struct LogInfoMessages {
        static let kAccessTokenRefreshed = "Access token was refreshed automatically."
        static let kAccessTokenValid = "Access token was valid and not updated."
        static let kIdTokenValid = "ID token was valid and not updated."
        static let kHTTPResponseEmpty = "HTTP response data is empty."
        static let kNonHTTPResponse = "Non-HTTP response."
        static let kInfoRetrievalSuccess = "Information retrieval success."
    }
    
    /// HTTPS response codes
    struct HTTPResponseCodes {
        static let kOk = 200
        static let kUnauthorised = 401
    }
}
