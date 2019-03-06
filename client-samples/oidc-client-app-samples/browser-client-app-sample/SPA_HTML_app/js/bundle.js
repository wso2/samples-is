(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Represents the test web app that uses the AppAuthJS library.
var authorization_request_1 = require("../authorization_request");
var authorization_request_handler_1 = require("../authorization_request_handler");
var authorization_service_configuration_1 = require("../authorization_service_configuration");
var logger_1 = require("../logger");
var redirect_based_handler_1 = require("../redirect_based_handler");
var types_1 = require("../types");
var storage_1 = require("../storage");
var crypto_utils_1 = require("../crypto_utils");
/**
 * The wrapper appication.
 */
var App = /** @class */ (function () {
    function App(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.authorizeUrl, authorizeUrl = _c === void 0 ? '' : _c, _d = _b.tokenUrl, tokenUrl = _d === void 0 ? '' : _d, _e = _b.revokeUrl, revokeUrl = _e === void 0 ? '' : _e, _f = _b.logoutUrl, logoutUrl = _f === void 0 ? '' : _f, _g = _b.userInfoUrl, userInfoUrl = _g === void 0 ? '' : _g, _h = _b.flowType, flowType = _h === void 0 ? types_1.FLOW_TYPE_IMPLICIT : _h, _j = _b.userStore, userStore = _j === void 0 ? types_1.LOCAL_STORAGE : _j, _k = _b.clientId, clientId = _k === void 0 ? '511828570984-7nmej36h9j2tebiqmpqh835naet4vci4.apps.googleusercontent.com' : _k, _l = _b.clientSecret, clientSecret = _l === void 0 ? '' : _l, _m = _b.redirectUri, redirectUri = _m === void 0 ? 'http://localhost:8080/app/' : _m, _o = _b.scope, scope = _o === void 0 ? 'openid' : _o, _p = _b.postLogoutRedirectUri, postLogoutRedirectUri = _p === void 0 ? 'http://localhost:8080/app/' : _p, _q = _b.discoveryUri, discoveryUri = _q === void 0 ? 'https://accounts.google.com' : _q;
        this.authorizeUrl = authorizeUrl;
        this.tokenUrl = tokenUrl;
        this.revokeUrl = revokeUrl;
        this.logoutUrl = logoutUrl;
        this.userInfoUrl = userInfoUrl;
        this.flowTypeInternal = types_1.FLOW_TYPE_IMPLICIT;
        if (flowType == types_1.FLOW_TYPE_PKCE) {
            this.flowTypeInternal = types_1.FLOW_TYPE_PKCE;
        }
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.scope = scope;
        this.redirectUri = redirectUri;
        this.postLogoutRedirectUri = postLogoutRedirectUri;
        this.discoveryUri = discoveryUri;
        if (userStore == types_1.LOCAL_STORAGE) {
            this.userStore = new storage_1.LocalStorageBackend();
        }
        else {
            console.log('Session storage is not currently supported on underlying platform.');
            this.userStore = new storage_1.LocalStorageBackend();
        }
        this.configuration = new authorization_service_configuration_1.AuthorizationServiceConfiguration(this.flowTypeInternal, authorizeUrl, tokenUrl, revokeUrl, logoutUrl, userInfoUrl);
        this.notifier = new authorization_request_handler_1.AuthorizationNotifier();
        this.authorizationHandler = new redirect_based_handler_1.RedirectRequestHandler();
    }
    App.prototype.getConfiguration = function () {
        return this.configuration;
    };
    App.prototype.init = function (authorizationListenerCallback) {
        var _this = this;
        // set notifier to deliver responses
        this.authorizationHandler.setAuthorizationNotifier(this.notifier);
        // set a listener to listen for authorization responses
        this.notifier.setAuthorizationListener(function (request, response, error) {
            logger_1.log('Authorization request complete ', request, response, error);
            if (response) {
                _this.showMessage("Authorization Code " + response.code);
            }
            if (authorizationListenerCallback) {
                authorizationListenerCallback(request, response, error);
            }
        });
    };
    App.prototype.fetchServiceConfiguration = function () {
        var _this = this;
        authorization_service_configuration_1.AuthorizationServiceConfiguration.fetchFromIssuer(this.discoveryUri)
            .then(function (response) {
            logger_1.log('Fetched service configuration', response);
            response.oauthFlowType = _this.flowTypeInternal;
            _this.showMessage('Completed fetching configuration');
            _this.configuration = response;
        })
            .catch(function (error) {
            logger_1.log('Something bad happened', error);
            _this.showMessage("Something bad happened " + error);
        });
    };
    App.prototype.makeAuthorizationRequest = function (state, nonce) {
        // generater state
        if (!state) {
            state = App.generateState();
        }
        // create a request
        var request;
        if (this.configuration.toJson().oauth_flow_type == types_1.FLOW_TYPE_IMPLICIT) {
            // generater nonce
            if (!nonce) {
                nonce = App.generateNonce();
            }
            request = new authorization_request_1.AuthorizationRequest(this.clientId, this.redirectUri, this.scope, authorization_request_1.AuthorizationRequest.RESPONSE_TYPE_ID_TOKEN, state, { 'prompt': 'consent', 'access_type': 'online', 'nonce': nonce });
            // make the authorization request
            this.authorizationHandler.performAuthorizationRequest(this.configuration, request);
        }
    };
    App.prototype.checkForAuthorizationResponse = function () {
        var isAuthRequestComplete = false;
        switch (this.configuration.toJson().oauth_flow_type) {
            case types_1.FLOW_TYPE_IMPLICIT:
                var params = this.parseQueryString(location, true);
                isAuthRequestComplete = params.hasOwnProperty('id_token');
                break;
        }
        if (isAuthRequestComplete) {
            return this.authorizationHandler.completeAuthorizationRequestIfPossible();
        }
    };
    App.prototype.showMessage = function (message) {
        console.log(message);
    };
    App.generateNonce = function () {
        var nonceLen = 8;
        return crypto_utils_1.cryptoGenerateRandom(nonceLen);
    };
    App.generateState = function () {
        var stateLen = 8;
        return crypto_utils_1.cryptoGenerateRandom(stateLen);
    };
    App.prototype.parseQueryString = function (location, splitByHash) {
        var urlParams;
        if (splitByHash) {
            urlParams = location.hash;
        }
        else {
            urlParams = location.search;
        }
        var result = {};
        // if anything starts with ?, # or & remove it
        urlParams = urlParams.trim().replace(/^(\?|#|&)/, '');
        var params = urlParams.split('&');
        for (var i = 0; i < params.length; i += 1) {
            var param = params[i]; // looks something like a=b
            var parts = param.split('=');
            if (parts.length >= 2) {
                var key = decodeURIComponent(parts.shift());
                var value = parts.length > 0 ? parts.join('=') : null;
                if (value) {
                    result[key] = decodeURIComponent(value);
                }
            }
        }
        return result;
    };
    return App;
}());
exports.App = App;
// export App
window['App'] = App;

},{"../authorization_request":2,"../authorization_request_handler":3,"../authorization_service_configuration":5,"../crypto_utils":6,"../logger":9,"../redirect_based_handler":11,"../storage":12,"../types":13}],2:[function(require,module,exports){
"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_utils_1 = require("./crypto_utils");
/**
 * Generates a cryptographically random new state. Useful for CSRF protection.
 */
var BYTES_LENGTH = 10; // 10 bytes
var newState = function (generateRandom) {
    return generateRandom(BYTES_LENGTH);
};
/**
 * Represents the AuthorizationRequest.
 * For more information look at
 * https://tools.ietf.org/html/rfc6749#section-4.1.1
 */
var AuthorizationRequest = /** @class */ (function () {
    /**
     * Constructs a new AuthorizationRequest.
     * Use a `undefined` value for the `state` parameter, to generate a random
     * state for CSRF protection.
     */
    function AuthorizationRequest(clientId, redirectUri, scope, responseType, state, extras, generateRandom) {
        if (responseType === void 0) { responseType = AuthorizationRequest.RESPONSE_TYPE_CODE; }
        if (generateRandom === void 0) { generateRandom = crypto_utils_1.cryptoGenerateRandom; }
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.scope = scope;
        this.responseType = responseType;
        this.extras = extras;
        this.state = state || newState(generateRandom);
    }
    /**
     * Serializes the AuthorizationRequest to a JavaScript Object.
     */
    AuthorizationRequest.prototype.toJson = function () {
        return {
            response_type: this.responseType,
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            scope: this.scope,
            state: this.state,
            extras: this.extras
        };
    };
    /**
     * Creates a new instance of AuthorizationRequest.
     */
    AuthorizationRequest.fromJson = function (input) {
        return new AuthorizationRequest(input.client_id, input.redirect_uri, input.scope, input.response_type, input.state, input.extras);
    };
    /**
     * Adds additional extra fields to the AuthorizationRequest.
     */
    AuthorizationRequest.prototype.setExtrasField = function (key, value) {
        if (this.extras) {
            this.extras[key] = value;
        }
    };
    AuthorizationRequest.RESPONSE_TYPE_CODE = 'code';
    AuthorizationRequest.RESPONSE_TYPE_ID_TOKEN = 'id_token';
    return AuthorizationRequest;
}());
exports.AuthorizationRequest = AuthorizationRequest;

},{"./crypto_utils":6}],3:[function(require,module,exports){
"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("./logger");
/**
 * Authorization Service notifier.
 * This manages the communication of the AuthorizationResponse to the 3p client.
 */
var AuthorizationNotifier = /** @class */ (function () {
    function AuthorizationNotifier() {
        this.listener = null;
    }
    AuthorizationNotifier.prototype.setAuthorizationListener = function (listener) {
        this.listener = listener;
    };
    /**
     * The authorization complete callback.
     */
    AuthorizationNotifier.prototype.onAuthorizationComplete = function (request, response, error) {
        if (this.listener) {
            // complete authorization request
            this.listener(request, response, error);
        }
    };
    return AuthorizationNotifier;
}());
exports.AuthorizationNotifier = AuthorizationNotifier;
// TODO(rahulrav@): add more built in parameters.
/* built in parameters. */
exports.BUILT_IN_PARAMETERS = ['redirect_uri', 'client_id', 'response_type', 'state', 'scope'];
/**
 * Defines the interface which is capable of handling an authorization request
 * using various methods (iframe / popup / different process etc.).
 */
var AuthorizationRequestHandler = /** @class */ (function () {
    function AuthorizationRequestHandler(utils, generateRandom) {
        this.utils = utils;
        this.generateRandom = generateRandom;
        // notifier send the response back to the client.
        this.notifier = null;
    }
    /**
     * A utility method to be able to build the authorization request URL.
     */
    AuthorizationRequestHandler.prototype.buildRequestUrl = function (configuration, request) {
        // build the query string
        // coerce to any type for convenience
        var requestMap = {
            'redirect_uri': request.redirectUri,
            'client_id': request.clientId,
            'response_type': request.responseType,
            'state': request.state,
            'scope': request.scope
        };
        // copy over extras
        if (request.extras) {
            for (var extra in request.extras) {
                if (request.extras.hasOwnProperty(extra)) {
                    // check before inserting to requestMap
                    if (exports.BUILT_IN_PARAMETERS.indexOf(extra) < 0) {
                        requestMap[extra] = request.extras[extra];
                    }
                }
            }
        }
        var query = this.utils.stringify(requestMap);
        var baseUrl = configuration.authorizationEndpoint;
        var url = baseUrl + "?" + query;
        return url;
    };
    /**
     * Completes the authorization request if necessary & when possible.
     */
    AuthorizationRequestHandler.prototype.completeAuthorizationRequestIfPossible = function () {
        var _this = this;
        // call complete authorization if possible to see there might
        // be a response that needs to be delivered.
        logger_1.log("Checking to see if there is an authorization response to be delivered.");
        if (!this.notifier) {
            logger_1.log("Notifier is not present on AuthorizationRequest handler.\n          No delivery of result will be possible");
        }
        return this.completeAuthorizationRequest().then(function (result) {
            if (!result) {
                logger_1.log("No result is available yet.");
            }
            if (result && _this.notifier) {
                _this.notifier.onAuthorizationComplete(result.request, result.response, result.error);
            }
        });
    };
    /**
     * Sets the default Authorization Service notifier.
     */
    AuthorizationRequestHandler.prototype.setAuthorizationNotifier = function (notifier) {
        this.notifier = notifier;
        return this;
    };
    ;
    return AuthorizationRequestHandler;
}());
exports.AuthorizationRequestHandler = AuthorizationRequestHandler;

},{"./logger":9}],4:[function(require,module,exports){
"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents the Authorization Response type.
 * For more information look at
 * https://tools.ietf.org/html/rfc6749#section-4.1.2
 */
var AuthorizationResponse = /** @class */ (function () {
    function AuthorizationResponse(code, state, id_token) {
        this.code = code;
        this.state = state;
        this.id_token = id_token;
    }
    AuthorizationResponse.prototype.toJson = function () {
        return { code: this.code, state: this.state, id_token: this.id_token };
    };
    AuthorizationResponse.fromJson = function (json) {
        return new AuthorizationResponse(json.code, json.state, json.id_token);
    };
    return AuthorizationResponse;
}());
exports.AuthorizationResponse = AuthorizationResponse;
/**
 * Represents the Authorization error response.
 * For more information look at:
 * https://tools.ietf.org/html/rfc6749#section-4.1.2.1
 */
var AuthorizationError = /** @class */ (function () {
    function AuthorizationError(error, errorDescription, errorUri, state) {
        this.error = error;
        this.errorDescription = errorDescription;
        this.errorUri = errorUri;
        this.state = state;
    }
    AuthorizationError.prototype.toJson = function () {
        return {
            error: this.error,
            error_description: this.errorDescription,
            error_uri: this.errorUri,
            state: this.state
        };
    };
    AuthorizationError.fromJson = function (json) {
        return new AuthorizationError(json.error, json.error_description, json.error_uri, json.state);
    };
    return AuthorizationError;
}());
exports.AuthorizationError = AuthorizationError;

},{}],5:[function(require,module,exports){
"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var xhr_1 = require("./xhr");
/**
 * The standard base path for well-known resources on domains.
 * See https://tools.ietf.org/html/rfc5785 for more information.
 */
var WELL_KNOWN_PATH = '.well-known';
/**
 * The standard resource under the well known path at which an OpenID Connect
 * discovery document can be found under an issuer's base URI.
 */
var OPENID_CONFIGURATION = 'openid-configuration';
/**
 * Configuration details required to interact with an authorization service.
 *
 * More information at https://openid.net/specs/openid-connect-discovery-1_0-17.html
 */
var AuthorizationServiceConfiguration = /** @class */ (function () {
    function AuthorizationServiceConfiguration(oauthFlowType, authorizationEndpoint, tokenEndpoint, revocationEndpoint, // for Revoking Access Tokens
    endSessionEndpoint, // for OpenID session management
    userInfoEndpoint) {
        if (oauthFlowType === void 0) { oauthFlowType = types_1.FLOW_TYPE_IMPLICIT; }
        this.oauthFlowType = oauthFlowType;
        this.authorizationEndpoint = authorizationEndpoint;
        this.tokenEndpoint = tokenEndpoint;
        this.revocationEndpoint = revocationEndpoint;
        this.endSessionEndpoint = endSessionEndpoint;
        this.userInfoEndpoint = userInfoEndpoint;
    }
    AuthorizationServiceConfiguration.prototype.toJson = function () {
        return {
            oauth_flow_type: this.oauthFlowType,
            authorization_endpoint: this.authorizationEndpoint,
            token_endpoint: this.tokenEndpoint,
            revocation_endpoint: this.revocationEndpoint,
            end_session_endpoint: this.endSessionEndpoint,
            userinfo_endpoint: this.userInfoEndpoint
        };
    };
    AuthorizationServiceConfiguration.fromJson = function (json) {
        return new AuthorizationServiceConfiguration(json.oauth_flow_type, json.authorization_endpoint, json.token_endpoint, json.revocation_endpoint, json.end_session_endpoint, json.userinfo_endpoint);
    };
    AuthorizationServiceConfiguration.fetchFromIssuer = function (openIdIssuerUrl, requestor) {
        var fullUrl = openIdIssuerUrl + "/" + WELL_KNOWN_PATH + "/" + OPENID_CONFIGURATION;
        var requestorToUse = requestor || new xhr_1.JQueryRequestor();
        return requestorToUse
            .xhr({ url: fullUrl, dataType: 'json' })
            .then(function (json) { return AuthorizationServiceConfiguration.fromJson(json); });
    };
    return AuthorizationServiceConfiguration;
}());
exports.AuthorizationServiceConfiguration = AuthorizationServiceConfiguration;

},{"./types":13,"./xhr":14}],6:[function(require,module,exports){
"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function bufferToString(buffer) {
    var state = [];
    for (var i = 0; i < buffer.byteLength; i += 1) {
        var index = (buffer[i] % CHARSET.length) | 0;
        state.push(CHARSET[index]);
    }
    return state.join('');
}
exports.bufferToString = bufferToString;
var DEFAULT_SIZE = 1; /** size in bytes */
var HAS_CRYPTO = typeof window !== 'undefined' && !!window.crypto;
exports.cryptoGenerateRandom = function (sizeInBytes) {
    if (sizeInBytes === void 0) { sizeInBytes = DEFAULT_SIZE; }
    var buffer = new Uint8Array(sizeInBytes);
    if (HAS_CRYPTO) {
        window.crypto.getRandomValues(buffer);
    }
    else {
        // fall back to Math.random() if nothing else is available
        for (var i = 0; i < sizeInBytes; i += 1) {
            buffer[i] = Math.random();
        }
    }
    return bufferToString(buffer);
};

},{}],7:[function(require,module,exports){
"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents the AppAuthError type.
 */
var AppAuthError = /** @class */ (function () {
    function AppAuthError(message, extras) {
        this.message = message;
        this.extras = extras;
    }
    return AppAuthError;
}());
exports.AppAuthError = AppAuthError;

},{}],8:[function(require,module,exports){
"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* Global flags that control the behavior of App Auth JS. */
/* Logging turned on ? */
exports.IS_LOG = true;
/* Profiling turned on ? */
exports.IS_PROFILE = false;

},{}],9:[function(require,module,exports){
"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var flags_1 = require("./flags");
function log(message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (flags_1.IS_LOG) {
        var length_1 = args ? args.length : 0;
        if (length_1 > 0) {
            console.log.apply(console, [message].concat(args));
        }
        else {
            console.log(message);
        }
    }
}
exports.log = log;
;
// check to see if native support for profiling is available.
var NATIVE_PROFILE_SUPPORT = typeof window !== 'undefined' && !!window.performance && !!console.profile;
/**
 * A decorator that can profile a function.
 */
function profile(target, propertyKey, descriptor) {
    if (flags_1.IS_PROFILE) {
        return performProfile(target, propertyKey, descriptor);
    }
    else {
        // return as-is
        return descriptor;
    }
}
exports.profile = profile;
function performProfile(target, propertyKey, descriptor) {
    var originalCallable = descriptor.value;
    // name must exist
    var name = originalCallable.name;
    if (!name) {
        name = 'anonymous function';
    }
    if (NATIVE_PROFILE_SUPPORT) {
        descriptor.value = function (args) {
            console.profile(name);
            var startTime = window.performance.now();
            var result = originalCallable.call.apply(originalCallable, [this || window].concat(args));
            var duration = window.performance.now() - startTime;
            console.log(name + " took " + duration + " ms");
            console.profileEnd();
            return result;
        };
    }
    else {
        descriptor.value = function (args) {
            log("Profile start " + name);
            var start = Date.now();
            var result = originalCallable.call.apply(originalCallable, [this || window].concat(args));
            var duration = Date.now() - start;
            log("Profile end " + name + " took " + duration + " ms.");
            return result;
        };
    }
    return descriptor;
}

},{"./flags":8}],10:[function(require,module,exports){
"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var BasicQueryStringUtils = /** @class */ (function () {
    function BasicQueryStringUtils() {
    }
    BasicQueryStringUtils.prototype.parse = function (input, useHash) {
        if (useHash) {
            return this.parseQueryString(input.hash);
        }
        else {
            return this.parseQueryString(input.search);
        }
    };
    BasicQueryStringUtils.prototype.parseQueryString = function (query) {
        var result = {};
        // if anything starts with ?, # or & remove it
        query = query.trim().replace(/^(\?|#|&)/, '');
        var params = query.split('&');
        for (var i = 0; i < params.length; i += 1) {
            var param = params[i]; // looks something like a=b
            var parts = param.split('=');
            if (parts.length >= 2) {
                var key = decodeURIComponent(parts.shift());
                var value = parts.length > 0 ? parts.join('=') : null;
                if (value) {
                    result[key] = decodeURIComponent(value);
                }
            }
        }
        return result;
    };
    BasicQueryStringUtils.prototype.stringify = function (input) {
        var encoded = [];
        for (var key in input) {
            if (input.hasOwnProperty(key) && input[key]) {
                encoded.push(encodeURIComponent(key) + "=" + encodeURIComponent(input[key]));
            }
        }
        return encoded.join('&');
    };
    return BasicQueryStringUtils;
}());
exports.BasicQueryStringUtils = BasicQueryStringUtils;

},{}],11:[function(require,module,exports){
"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
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
var authorization_request_1 = require("./authorization_request");
var authorization_request_handler_1 = require("./authorization_request_handler");
var authorization_response_1 = require("./authorization_response");
var authorization_service_configuration_1 = require("./authorization_service_configuration");
var crypto_utils_1 = require("./crypto_utils");
var logger_1 = require("./logger");
var query_string_utils_1 = require("./query_string_utils");
var storage_1 = require("./storage");
var types_1 = require("./types");
/** key for authorization request. */
var authorizationRequestKey = function (handle) {
    return handle + "_appauth_authorization_request";
};
/** key for authorization service configuration */
var authorizationServiceConfigurationKey = function (handle) {
    return handle + "_appauth_authorization_service_configuration";
};
/** key in local storage which represents the current authorization request. */
var AUTHORIZATION_REQUEST_HANDLE_KEY = 'appauth_current_authorization_request';
/**
 * Represents an AuthorizationRequestHandler which uses a standard
 * redirect based code flow.
 */
var RedirectRequestHandler = /** @class */ (function (_super) {
    __extends(RedirectRequestHandler, _super);
    function RedirectRequestHandler(
    // use the provided storage backend
    // or initialize local storage with the default storage backend which
    // uses window.localStorage
    storageBackend, utils, locationLike, generateRandom) {
        if (storageBackend === void 0) { storageBackend = new storage_1.LocalStorageBackend(); }
        if (utils === void 0) { utils = new query_string_utils_1.BasicQueryStringUtils(); }
        if (locationLike === void 0) { locationLike = window.location; }
        if (generateRandom === void 0) { generateRandom = crypto_utils_1.cryptoGenerateRandom; }
        var _this = _super.call(this, utils, generateRandom) || this;
        _this.storageBackend = storageBackend;
        _this.locationLike = locationLike;
        return _this;
    }
    RedirectRequestHandler.prototype.performAuthorizationRequest = function (configuration, request) {
        var _this = this;
        var handle = this.generateRandom();
        // before you make request, persist all request related data in local storage.
        var persisted = Promise.all([
            this.storageBackend.setItem(AUTHORIZATION_REQUEST_HANDLE_KEY, handle),
            this.storageBackend.setItem(authorizationRequestKey(handle), JSON.stringify(request.toJson())),
            this.storageBackend.setItem(authorizationServiceConfigurationKey(handle), JSON.stringify(configuration.toJson())),
        ]);
        persisted.then(function () {
            // make the redirect request
            var url = _this.buildRequestUrl(configuration, request);
            logger_1.log('Making a request to ', request, url);
            _this.locationLike.assign(url);
        });
    };
    /**
     * Attempts to introspect the contents of storage backend and completes the
     * request.
     */
    RedirectRequestHandler.prototype.completeAuthorizationRequest = function () {
        var _this = this;
        // TODO(rahulrav@): handle authorization errors.
        return this.storageBackend.getItem(AUTHORIZATION_REQUEST_HANDLE_KEY).then(function (handle) {
            if (handle) {
                // we have a pending request.
                // fetch authorization request, and check state
                return _this.storageBackend
                    .getItem(authorizationRequestKey(handle))
                    // requires a corresponding instance of result
                    // TODO(rahulrav@): check for inconsitent state here
                    .then(function (result) { return JSON.parse(result); })
                    .then(function (json) { return authorization_request_1.AuthorizationRequest.fromJson(json); })
                    .then(function (request) {
                    return _this.storageBackend.getItem(authorizationServiceConfigurationKey(handle))
                        .then(function (result) {
                        var configurationJson = JSON.parse(result);
                        var configuration = new authorization_service_configuration_1.AuthorizationServiceConfiguration(configurationJson.oauth_flow_type, configurationJson.authorization_endpoint, configurationJson.token_endpoint, configurationJson.revocation_endpoint, configurationJson.endSession_endpoint, configurationJson.userinfo_endpoint);
                        // check redirect_uri and state
                        var currentUri = "" + _this.locationLike.origin + _this.locationLike.pathname;
                        var queryParams;
                        switch (configuration.oauthFlowType) {
                            case types_1.FLOW_TYPE_IMPLICIT:
                                queryParams = _this.utils.parse(_this.locationLike, true /* use hash */);
                                break;
                            case types_1.FLOW_TYPE_PKCE:
                                queryParams = _this.utils.parse(_this.locationLike, false /* use ? */);
                                break;
                            default:
                                queryParams = _this.utils.parse(_this.locationLike, true /* use hash */);
                        }
                        var state = queryParams['state'];
                        var code = queryParams['code'];
                        var idToken = queryParams['id_token'];
                        var error = queryParams['error'];
                        logger_1.log('Potential authorization request ', currentUri, queryParams, state, code, error);
                        var shouldNotify = state === request.state;
                        var authorizationResponse = null;
                        var authorizationError = null;
                        if (shouldNotify) {
                            if (error) {
                                // get additional optional info.
                                var errorUri = queryParams['error_uri'];
                                var errorDescription = queryParams['error_description'];
                                authorizationError =
                                    new authorization_response_1.AuthorizationError(error, errorDescription, errorUri, state);
                            }
                            else {
                                authorizationResponse = new authorization_response_1.AuthorizationResponse(code, state, idToken);
                            }
                            // cleanup state
                            return Promise
                                .all([
                                _this.storageBackend.removeItem(AUTHORIZATION_REQUEST_HANDLE_KEY),
                                _this.storageBackend.removeItem(authorizationRequestKey(handle)),
                                _this.storageBackend.removeItem(authorizationServiceConfigurationKey(handle)),
                                _this.storageBackend.setItem(types_1.AUTHORIZATION_RESPONSE_HANDLE_KEY, (authorizationResponse == null ?
                                    '' :
                                    JSON.stringify(authorizationResponse.toJson())))
                            ])
                                .then(function () {
                                logger_1.log('Delivering authorization response');
                                return {
                                    request: request,
                                    response: authorizationResponse,
                                    error: authorizationError
                                };
                            });
                        }
                        else {
                            logger_1.log('Mismatched request (state and request_uri) dont match.');
                            return Promise.resolve(null);
                        }
                    });
                });
            }
            else {
                return null;
            }
        });
    };
    return RedirectRequestHandler;
}(authorization_request_handler_1.AuthorizationRequestHandler));
exports.RedirectRequestHandler = RedirectRequestHandler;

},{"./authorization_request":2,"./authorization_request_handler":3,"./authorization_response":4,"./authorization_service_configuration":5,"./crypto_utils":6,"./logger":9,"./query_string_utils":10,"./storage":12,"./types":13}],12:[function(require,module,exports){
"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Asynchronous storage APIs. All methods return a `Promise`.
 * All methods take the `DOMString`
 * IDL type (as it is the lowest common denominator).
 */
var StorageBackend = /** @class */ (function () {
    function StorageBackend() {
    }
    return StorageBackend;
}());
exports.StorageBackend = StorageBackend;
/**
 * A `StorageBackend` backed by `localstorage`.
 */
var LocalStorageBackend = /** @class */ (function (_super) {
    __extends(LocalStorageBackend, _super);
    function LocalStorageBackend(storage) {
        var _this = _super.call(this) || this;
        _this.storage = storage || window.localStorage;
        return _this;
    }
    LocalStorageBackend.prototype.getItem = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var value = _this.storage.getItem(name);
            if (value) {
                resolve(value);
            }
            else {
                resolve(null);
            }
        });
    };
    LocalStorageBackend.prototype.removeItem = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.storage.removeItem(name);
            resolve();
        });
    };
    LocalStorageBackend.prototype.clear = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.storage.clear();
            resolve();
        });
    };
    LocalStorageBackend.prototype.setItem = function (name, value) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.storage.setItem(name, value);
            resolve();
        });
    };
    return LocalStorageBackend;
}(StorageBackend));
exports.LocalStorageBackend = LocalStorageBackend;

},{}],13:[function(require,module,exports){
"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Represents constants for Oauth/OIDC flow types supported.
 */
exports.FLOW_TYPE_IMPLICIT = 'IMPLICIT';
exports.FLOW_TYPE_PKCE = 'PKCE';
// exporting for browser JS apps
window['FLOW_TYPE_IMPLICIT'] = exports.FLOW_TYPE_IMPLICIT;
window['FLOW_TYPE_PKCE'] = exports.FLOW_TYPE_PKCE;
/**
 * Represents constants for browser storage types supported.
 */
exports.LOCAL_STORAGE = 'LOCAL_STORAGE';
exports.SESSION_STORAGE = 'SESSION_STORAGE';
// exporting for browser JS apps
window['LOCAL_STORAGE'] = exports.LOCAL_STORAGE;
window['SESSION_STORAGE'] = exports.SESSION_STORAGE;
/**
 * Represents session/localstorage key for saving the authorization response for the current
 * request.
 */
exports.AUTHORIZATION_RESPONSE_HANDLE_KEY = 'appauth_current_authorization_response';

},{}],14:[function(require,module,exports){
"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
/**
 * An class that abstracts away the ability to make an XMLHttpRequest.
 */
var Requestor = /** @class */ (function () {
    function Requestor() {
    }
    return Requestor;
}());
exports.Requestor = Requestor;
/**
 * Uses $.ajax to makes the Ajax requests.
 */
var JQueryRequestor = /** @class */ (function (_super) {
    __extends(JQueryRequestor, _super);
    function JQueryRequestor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JQueryRequestor.prototype.xhr = function (settings) {
        // NOTE: using jquery to make XHR's as whatwg-fetch requires
        // that I target ES6.
        var xhr = $.ajax(settings);
        return new Promise(function (resolve, reject) {
            xhr.then(function (data, textStatus, jqXhr) {
                resolve(data);
            }, function (jqXhr, textStatus, error) {
                reject(new errors_1.AppAuthError(error));
            });
        });
    };
    return JQueryRequestor;
}(Requestor));
exports.JQueryRequestor = JQueryRequestor;
/**
 * Should be used only in the context of testing. Just uses the underlying
 * Promise to mock the behavior of the Requestor.
 */
var TestRequestor = /** @class */ (function (_super) {
    __extends(TestRequestor, _super);
    function TestRequestor(promise) {
        var _this = _super.call(this) || this;
        _this.promise = promise;
        return _this;
    }
    TestRequestor.prototype.xhr = function (settings) {
        return this.promise; // unsafe cast
    };
    return TestRequestor;
}(Requestor));
exports.TestRequestor = TestRequestor;

},{"./errors":7}]},{},[1]);
