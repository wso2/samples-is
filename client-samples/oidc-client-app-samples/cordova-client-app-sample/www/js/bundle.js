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
var token_request_1 = require("../token_request");
var token_request_handler_1 = require("../token_request_handler");

/**
 * The Test application.
 */
var App = /** @class */ (function () {
    function App() {
        var _this = this;
        
        this.notifier = new authorization_request_handler_1.AuthorizationNotifier();
        this.authorizationHandler = new redirect_based_handler_1.RedirectRequestHandler();
        this.authorizationHandler.application = _this;
        this.tokenHandler = new token_request_handler_1.BaseTokenRequestHandler();
        this.configuration = new authorization_service_configuration_1.AuthorizationServiceConfiguration(AuthorizationServiceConfigJson);
        // set notifier to deliver responses
        this.authorizationHandler.setAuthorizationNotifier(this.notifier);
        // set a listener to listen for authorization responses
        this.notifier.setAuthorizationListener(function (request, response, error) {
            logger_1.log('Authorization request complete ', request, response, error);
            if (response) {
                _this.request = request;
                _this.response = response;
                _this.code = response.code;
            }
        });
    }

    App.prototype.processAuthorizeResponse = function (url) {
        var _this = this;
        _this.authorizationHandler.processAuthorizeResponse(url, _this);
    }

    App.prototype.makeAuthorizationRequest = function () {
        // create a request
        var request = new authorization_request_1.AuthorizationRequest({
            client_id: AppConfigJson.clientId,
            redirect_uri: AppConfigJson.redirectUri,
            scope: AppConfigJson.scope,
            response_type: authorization_request_1.AuthorizationRequest.RESPONSE_TYPE_CODE,
            state: undefined,
            extras: {
                'access_type': 'offline'
            }
        });
        if (this.configuration) {
            this.authorizationHandler.performAuthorizationRequest(this.configuration, request);
        } else {
            logger_1.log('Fetch Authorization Service configuration, before you make the authorization request.');
        }
    };
    App.prototype.makeTokenRequest = function () {
        var _this = this;
        if (!this.configuration) {
            logger_1.log('Please fetch service configuration.');
            return;
        }
        var request = null;
        if (this.code) {
            var extras = undefined;
            if (this.request && this.request.internal) {
                extras = {};
                extras['code_verifier'] = this.request.internal['code_verifier'];
            }
            // use the code to make the token request.
            request = new token_request_1.TokenRequest({
                client_id: AppConfigJson.clientId,
                redirect_uri: AppConfigJson.redirectUri,
                grant_type: token_request_1.GRANT_TYPE_AUTHORIZATION_CODE,
                code: this.code,
                refresh_token: undefined,
                extras: extras
            });
        } else if (this.tokenResponse) {
            // use the token response to make a request for an access token
            request = new token_request_1.TokenRequest({
                client_id: AppConfigJson.clientId,
                redirect_uri: AppConfigJson.redirectUri,
                grant_type: token_request_1.GRANT_TYPE_REFRESH_TOKEN,
                code: undefined,
                refresh_token: this.tokenResponse.refreshToken,
                extras: undefined
            });
        }
        if (request) {
            this.tokenHandler.performTokenRequest(this.configuration, request)
                .then(function (response) {

                    if (response.accessToken) {
                        authCompletionCallback(response.idToken);
                    }

                    if (_this.tokenResponse) {
                        // copy over new fields
                        _this.tokenResponse.accessToken = response.accessToken;
                        _this.tokenResponse.issuedAt = response.issuedAt;
                        _this.tokenResponse.expiresIn = response.expiresIn;
                        _this.tokenResponse.tokenType = response.tokenType;
                        _this.tokenResponse.scope = response.scope;
                    } else {
                        _this.tokenResponse = response;
                    }
                    // unset code, so we can do refresh token exchanges subsequently
                    _this.code = undefined;
                    window.plugins.toast.showLongBottom("Obtained an access token " + response.accessToken);
                })
                .catch(function (error) {
                    logger_1.log("Something bad happened " + error);
                });
        }
    };
    App.prototype.checkForAuthorizationResponse = function () {
        this.authorizationHandler.completeAuthorizationRequestIfPossible();
    };
    return App;
}());
exports.App = App;
// export App
window['App'] = App;

}, {
    "../authorization_request": 2,
    "../authorization_request_handler": 3,
    "../authorization_service_configuration": 5,
    "../logger": 9,
    "../redirect_based_handler": 11,
    "../token_request": 13,
    "../token_request_handler": 14
}], 2: [function (require, module, exports) {
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
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var crypto_utils_1 = require("./crypto_utils");
    var logger_1 = require("./logger");
    /**
     * Generates a cryptographically random new state. Useful for CSRF protection.
     */
    var SIZE = 10; // 10 bytes
    var newState = function (crypto) {
        return crypto.generateRandom(SIZE);
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
        function AuthorizationRequest(request, crypto, usePkce) {
            if (crypto === void 0) {
                crypto = new crypto_utils_1.DefaultCrypto();
            }
            if (usePkce === void 0) {
                usePkce = true;
            }
            this.crypto = crypto;
            this.usePkce = usePkce;
            this.clientId = request.client_id;
            this.redirectUri = request.redirect_uri;
            this.scope = request.scope;
            this.responseType = request.response_type || AuthorizationRequest.RESPONSE_TYPE_CODE;
            this.state = request.state || newState(crypto);
            this.extras = request.extras;
            // read internal properties if available
            this.internal = request.internal;
        }
        AuthorizationRequest.prototype.setupCodeVerifier = function () {
            var _this = this;
            if (!this.usePkce) {
                return Promise.resolve();
            } else {
                var codeVerifier_1 = this.crypto.generateRandom(128);
                var challenge = this.crypto.deriveChallenge(codeVerifier_1).catch(function (error) {
                    logger_1.log('Unable to generate PKCE challenge. Not using PKCE', error);
                    return undefined;
                });
                return challenge.then(function (result) {
                    if (result) {
                        // keep track of the code used.
                        _this.internal = _this.internal || {};
                        _this.internal['code_verifier'] = codeVerifier_1;
                        _this.extras = _this.extras || {};
                        _this.extras['code_challenge'] = result;
                        // We always use S256. Plain is not good enough.
                        _this.extras['code_challenge_method'] = 'S256';
                    }
                });
            }
        };
        /**
         * Serializes the AuthorizationRequest to a JavaScript Object.
         */
        AuthorizationRequest.prototype.toJson = function () {
            var _this = this;
            // Always make sure that the code verifier is setup when toJson() is called.
            return this.setupCodeVerifier().then(function () {
                return {
                    response_type: _this.responseType,
                    client_id: _this.clientId,
                    redirect_uri: _this.redirectUri,
                    scope: _this.scope,
                    state: _this.state,
                    extras: _this.extras,
                    internal: _this.internal
                };
            });
        };
        AuthorizationRequest.RESPONSE_TYPE_TOKEN = 'token';
        AuthorizationRequest.RESPONSE_TYPE_CODE = 'code';
        return AuthorizationRequest;
    }());
    exports.AuthorizationRequest = AuthorizationRequest;

}, {
    "./crypto_utils": 6,
    "./logger": 9
}], 3: [function (require, module, exports) {
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
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
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
        function AuthorizationRequestHandler(utils, crypto) {
            this.utils = utils;
            this.crypto = crypto;
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
        };;
        return AuthorizationRequestHandler;
    }());
    exports.AuthorizationRequestHandler = AuthorizationRequestHandler;

}, {
    "./logger": 9
}], 4: [function (require, module, exports) {
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
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    /**
     * Represents the Authorization Response type.
     * For more information look at
     * https://tools.ietf.org/html/rfc6749#section-4.1.2
     */
    var AuthorizationResponse = /** @class */ (function () {
        function AuthorizationResponse(response) {
            this.code = response.code;
            this.state = response.state;
        }
        AuthorizationResponse.prototype.toJson = function () {
            return {
                code: this.code,
                state: this.state
            };
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
        function AuthorizationError(error) {
            this.error = error.error;
            this.errorDescription = error.error_description;
            this.errorUri = error.error_uri;
            this.state = error.state;
        }
        AuthorizationError.prototype.toJson = function () {
            return {
                error: this.error,
                error_description: this.errorDescription,
                error_uri: this.errorUri,
                state: this.state
            };
        };
        return AuthorizationError;
    }());
    exports.AuthorizationError = AuthorizationError;

}, {}], 5: [function (require, module, exports) {
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
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
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
        function AuthorizationServiceConfiguration(request) {
            this.authorizationEndpoint = request.authorization_endpoint;
            this.tokenEndpoint = request.token_endpoint;
            this.revocationEndpoint = request.revocation_endpoint;
            this.userInfoEndpoint = request.userinfo_endpoint;
            this.endSessionEndpoint = request.end_session_endpoint;
        }
        AuthorizationServiceConfiguration.prototype.toJson = function () {
            return {
                authorization_endpoint: this.authorizationEndpoint,
                token_endpoint: this.tokenEndpoint,
                revocation_endpoint: this.revocationEndpoint,
                end_session_endpoint: this.endSessionEndpoint,
                userinfo_endpoint: this.userInfoEndpoint
            };
        };
        AuthorizationServiceConfiguration.fetchFromIssuer = function (openIdIssuerUrl, requestor) {
            var fullUrl = openIdIssuerUrl + "/" + WELL_KNOWN_PATH + "/" + OPENID_CONFIGURATION;
            var requestorToUse = requestor || new xhr_1.JQueryRequestor();
            return requestorToUse
                .xhr({
                    url: fullUrl,
                    dataType: 'json'
                })
                .then(function (json) {
                    return new AuthorizationServiceConfiguration(json);
                });
        };
        return AuthorizationServiceConfiguration;
    }());
    exports.AuthorizationServiceConfiguration = AuthorizationServiceConfiguration;

}, {
    "./xhr": 16
}], 6: [function (require, module, exports) {
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
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var base64 = require("base64-js");
    var errors_1 = require("./errors");
    var HAS_CRYPTO = typeof window !== 'undefined' && !!window.crypto;
    var HAS_SUBTLE_CRYPTO = HAS_CRYPTO && !!window.crypto.subtle;
    var HAS_TEXT_ENCODER = typeof window !== 'undefined' && !!(TextEncoder);
    var CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    function bufferToString(buffer) {
        var state = [];
        for (var i = 0; i < buffer.byteLength; i += 1) {
            var index = buffer[i] % CHARSET.length;
            state.push(CHARSET[index]);
        }
        return state.join('');
    }
    exports.bufferToString = bufferToString;

    function urlSafe(buffer) {
        var encoded = base64.fromByteArray(new Uint8Array(buffer));
        return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }
    exports.urlSafe = urlSafe;
    /**
     * The default implementation of the `Crypto` interface.
     * This uses the capabilities of the browser.
     */
    var DefaultCrypto = /** @class */ (function () {
        function DefaultCrypto() {}
        DefaultCrypto.prototype.generateRandom = function (size) {
            var buffer = new Uint8Array(size);
            if (HAS_CRYPTO) {
                window.crypto.getRandomValues(buffer);
            } else {
                // fall back to Math.random() if nothing else is available
                for (var i = 0; i < size; i += 1) {
                    buffer[i] = Math.random();
                }
            }
            return bufferToString(buffer);
        };
        DefaultCrypto.prototype.deriveChallenge = function (code) {
            if (code.length < 43 || code.length > 128) {
                return Promise.reject(new errors_1.AppAuthError('Invalid code length.'));
            }
            if (!HAS_SUBTLE_CRYPTO) {
                return Promise.reject(new errors_1.AppAuthError('window.crypto.subtle is unavailable.'));
            }
            if (!HAS_TEXT_ENCODER) {
                return Promise.reject(new errors_1.AppAuthError('TextEncoder is unavailable.'));
            }
            var encoder = new TextEncoder();
            return new Promise(function (resolve, reject) {
                crypto.subtle.digest('SHA-256', encoder.encode(code)).then(function (buffer) {
                    return resolve(urlSafe(new Uint8Array(buffer)));
                }, function (error) {
                    return reject(error);
                });
            });
        };
        return DefaultCrypto;
    }());
    exports.DefaultCrypto = DefaultCrypto;

}, {
    "./errors": 7,
    "base64-js": 17
}], 7: [function (require, module, exports) {
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
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
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

}, {}], 8: [function (require, module, exports) {
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
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    /* Global flags that control the behavior of App Auth JS. */
    /* Logging turned on ? */
    exports.IS_LOG = true;
    /* Profiling turned on ? */
    exports.IS_PROFILE = false;

}, {}], 9: [function (require, module, exports) {
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
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
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
            } else {
                console.log(message);
            }
        }
    }
    exports.log = log;;
    // check to see if native support for profiling is available.
    var NATIVE_PROFILE_SUPPORT = typeof window !== 'undefined' && !!window.performance && !!console.profile;
    /**
     * A decorator that can profile a function.
     */
    function profile(target, propertyKey, descriptor) {
        if (flags_1.IS_PROFILE) {
            return performProfile(target, propertyKey, descriptor);
        } else {
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
        } else {
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

}, {
    "./flags": 8
}], 10: [function (require, module, exports) {
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
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var BasicQueryStringUtils = /** @class */ (function () {
        function BasicQueryStringUtils() {}
        BasicQueryStringUtils.prototype.parse = function (input, useHash) {
            if (useHash) {
                return this.parseQueryString(input.hash);
            } else {
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

}, {}], 11: [function (require, module, exports) {
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
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({
                        __proto__: []
                    }
                    instanceof Array && function (d, b) {
                        d.__proto__ = b;
                    }) ||
                function (d, b) {
                    for (var p in b)
                        if (b.hasOwnProperty(p)) d[p] = b[p];
                };
            return extendStatics(d, b);
        }
        return function (d, b) {
            extendStatics(d, b);

            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var authorization_request_1 = require("./authorization_request");
    var authorization_request_handler_1 = require("./authorization_request_handler");
    var authorization_response_1 = require("./authorization_response");
    var crypto_utils_1 = require("./crypto_utils");
    var logger_1 = require("./logger");
    var query_string_utils_1 = require("./query_string_utils");
    var storage_1 = require("./storage");
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
            storageBackend, utils, locationLike, crypto) {
            if (storageBackend === void 0) {
                storageBackend = new storage_1.LocalStorageBackend();
            }
            if (utils === void 0) {
                utils = new query_string_utils_1.BasicQueryStringUtils();
            }
            if (locationLike === void 0) {
                locationLike = window.location;
            }
            if (crypto === void 0) {
                crypto = new crypto_utils_1.DefaultCrypto();
            }
            var _this = _super.call(this, utils, crypto) || this;
            _this.storageBackend = storageBackend;
            _this.locationLike = locationLike;
            return _this;
        }

        RedirectRequestHandler.prototype.processAuthorizeResponse = function (url, app) {
            var _this = this;
            _this.application = app;
            var parser = document.createElement('a');
            parser.href = url;
            _this.locationLike = parser;
            _this.completeAuthorizationRequest();

        }

        RedirectRequestHandler.prototype.performAuthorizationRequest = function (configuration, request) {
            var _this = this;
            var handle = this.crypto.generateRandom(10);
            // before you make request, persist all request related data in local storage.
            var persisted = Promise.all([
                this.storageBackend.setItem(AUTHORIZATION_REQUEST_HANDLE_KEY, handle),
                // Calling toJson() adds in the code & challenge when possible
                request.toJson().then(function (result) {
                    return _this.storageBackend.setItem(authorizationRequestKey(handle), JSON.stringify(result));
                }),
                this.storageBackend.setItem(authorizationServiceConfigurationKey(handle), JSON.stringify(configuration.toJson())),
            ]);
            persisted.then(function () {
                // make the redirect request
                var url = _this.buildRequestUrl(configuration, request);
                logger_1.log('Making a request to ', request, url);
                // window.open(url);
                openBrowser(url);
                // cordova.InAppBrowser.open(encodeURI(url), '_blank', 'location=yes');

                // _this.locationLike.assign(url);
            });
        };
        /**
         * Attempts to introspect the contents of storage backend and completes the
         * request.
         */
        RedirectRequestHandler.prototype.completeAuthorizationRequest = function () {
            var _this = this;
            return this.storageBackend.getItem(AUTHORIZATION_REQUEST_HANDLE_KEY).then(function (handle) {
                if (handle) {
                    // we have a pending request.
                    // fetch authorization request, and check state
                    return _this.storageBackend
                        .getItem(authorizationRequestKey(handle))
                        // requires a corresponding instance of result
                        .then(function (result) {
                            return JSON.parse(result);
                        })
                        .then(function (json) {
                            return new authorization_request_1.AuthorizationRequest(json);
                        })
                        .then(function (request) {
                            // check redirect_uri and state
                            var currentUri = "" + _this.locationLike.origin + _this.locationLike.pathname;
                            var queryParams = _this.utils.parse(_this.locationLike, false /* don't use hash */ );
                            var state = queryParams['state'];
                            var code = queryParams['code'];
                            var error = queryParams['error'];
                            _this.application.code = code;
                            logger_1.log('Potential authorization request ', currentUri, queryParams, state, code, error);
                            var shouldNotify = state === request.state;
                            var authorizationResponse = null;
                            var authorizationError = null;
                            if (shouldNotify) {
                                if (error) {
                                    // get additional optional info.
                                    var errorUri = queryParams['error_uri'];
                                    var errorDescription = queryParams['error_description'];
                                    authorizationError = new authorization_response_1.AuthorizationError({
                                        error: error,
                                        error_description: errorDescription,
                                        error_uri: errorUri,
                                        state: state
                                    });
                                } else {
                                    authorizationResponse = new authorization_response_1.AuthorizationResponse({
                                        code: code,
                                        state: state
                                    });
                                    _this.application.response = authorizationResponse;
                                    _this.application.request = request;
                                    _this.application.makeTokenRequest();
                                }
                                // cleanup state
                                return Promise
                                    .all([
                                        _this.storageBackend.removeItem(AUTHORIZATION_REQUEST_HANDLE_KEY),
                                        _this.storageBackend.removeItem(authorizationRequestKey(handle)),
                                        _this.storageBackend.removeItem(authorizationServiceConfigurationKey(handle))
                                    ])
                                    .then(function () {
                                        logger_1.log('Delivering authorization response');
                                        return {
                                            request: request,
                                            response: authorizationResponse,
                                            error: authorizationError
                                        };
                                    });
                            } else {
                                logger_1.log('Mismatched request (state and request_uri) dont match.');
                                return Promise.resolve(null);
                            }
                        });
                } else {
                    return null;
                }
            });
        };
        return RedirectRequestHandler;
    }(authorization_request_handler_1.AuthorizationRequestHandler));
    exports.RedirectRequestHandler = RedirectRequestHandler;

}, {
    "./authorization_request": 2,
    "./authorization_request_handler": 3,
    "./authorization_response": 4,
    "./crypto_utils": 6,
    "./logger": 9,
    "./query_string_utils": 10,
    "./storage": 12
}], 12: [function (require, module, exports) {
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
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({
                        __proto__: []
                    }
                    instanceof Array && function (d, b) {
                        d.__proto__ = b;
                    }) ||
                function (d, b) {
                    for (var p in b)
                        if (b.hasOwnProperty(p)) d[p] = b[p];
                };
            return extendStatics(d, b);
        }
        return function (d, b) {
            extendStatics(d, b);

            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    /**
     * Asynchronous storage APIs. All methods return a `Promise`.
     * All methods take the `DOMString`
     * IDL type (as it is the lowest common denominator).
     */
    var StorageBackend = /** @class */ (function () {
        function StorageBackend() {}
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
                } else {
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

}, {}], 13: [function (require, module, exports) {
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
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.GRANT_TYPE_AUTHORIZATION_CODE = 'authorization_code';
    exports.GRANT_TYPE_REFRESH_TOKEN = 'refresh_token';
    /**
     * Represents an Access Token request.
     * For more information look at:
     * https://tools.ietf.org/html/rfc6749#section-4.1.3
     */
    var TokenRequest = /** @class */ (function () {
        function TokenRequest(request) {
            this.clientId = request.client_id;
            this.redirectUri = request.redirect_uri;
            this.grantType = request.grant_type;
            this.code = request.code;
            this.refreshToken = request.refresh_token;
            this.extras = request.extras;
        }
        /**
         * Serializes a TokenRequest to a JavaScript object.
         */
        TokenRequest.prototype.toJson = function () {
            return {
                grant_type: this.grantType,
                code: this.code,
                refresh_token: this.refreshToken,
                redirect_uri: this.redirectUri,
                client_id: this.clientId,
                extras: this.extras
            };
        };
        TokenRequest.prototype.toStringMap = function () {
            var map = {
                grant_type: this.grantType,
                client_id: this.clientId,
                redirect_uri: this.redirectUri
            };
            if (this.code) {
                map['code'] = this.code;
            }
            if (this.refreshToken) {
                map['refresh_token'] = this.refreshToken;
            }
            // copy over extras
            if (this.extras) {
                for (var extra in this.extras) {
                    if (this.extras.hasOwnProperty(extra) && !map.hasOwnProperty(extra)) {
                        // check before inserting to requestMap
                        map[extra] = this.extras[extra];
                    }
                }
            }
            return map;
        };
        return TokenRequest;
    }());
    exports.TokenRequest = TokenRequest;

}, {}], 14: [function (require, module, exports) {
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
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var errors_1 = require("./errors");
    var query_string_utils_1 = require("./query_string_utils");
    var token_response_1 = require("./token_response");
    var xhr_1 = require("./xhr");
    /**
     * The default token request handler.
     */
    var BaseTokenRequestHandler = /** @class */ (function () {
        function BaseTokenRequestHandler(requestor, utils) {
            if (requestor === void 0) {
                requestor = new xhr_1.JQueryRequestor();
            }
            if (utils === void 0) {
                utils = new query_string_utils_1.BasicQueryStringUtils();
            }
            this.requestor = requestor;
            this.utils = utils;
        }
        BaseTokenRequestHandler.prototype.isTokenResponse = function (response) {
            return response.error === undefined;
        };
        BaseTokenRequestHandler.prototype.performRevokeTokenRequest = function (configuration, request) {
            var revokeTokenResponse = this.requestor.xhr({
                url: configuration.revocationEndpoint,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: this.utils.stringify(request.toStringMap())
            });
            return revokeTokenResponse.then(function (response) {
                return true;
            });
        };
        BaseTokenRequestHandler.prototype.performTokenRequest = function (configuration, request) {
            var _this = this;
            var tokenResponse = this.requestor.xhr({
                url: configuration.tokenEndpoint,
                method: 'POST',
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: this.utils.stringify(request.toStringMap())
            });
            return tokenResponse.then(function (response) {
                if (_this.isTokenResponse(response)) {
                    return new token_response_1.TokenResponse(response);
                } else {
                    return Promise.reject(new errors_1.AppAuthError(response.error, new token_response_1.TokenError(response)));
                }
            });
        };
        return BaseTokenRequestHandler;
    }());
    exports.BaseTokenRequestHandler = BaseTokenRequestHandler;

}, {
    "./errors": 7,
    "./query_string_utils": 10,
    "./token_response": 15,
    "./xhr": 16
}], 15: [function (require, module, exports) {
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
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    // constants
    var AUTH_EXPIRY_BUFFER = 10 * 60; // 10 mins in seconds
    /**
     * Returns the instant of time in seconds.
     */
    exports.nowInSeconds = function () {
        return Math.round(new Date().getTime() / 1000);
    };
    /**
     * Represents the Token Response type.
     * For more information look at:
     * https://tools.ietf.org/html/rfc6749#section-5.1
     */
    var TokenResponse = /** @class */ (function () {
        function TokenResponse(response) {
            this.accessToken = response.access_token;
            this.tokenType = response.token_type || 'bearer';
            this.expiresIn = response.expires_in;
            this.refreshToken = response.refresh_token;
            this.scope = response.scope;
            this.idToken = response.id_token;
            this.issuedAt = response.issued_at || exports.nowInSeconds();
        }
        TokenResponse.prototype.toJson = function () {
            return {
                access_token: this.accessToken,
                id_token: this.idToken,
                refresh_token: this.refreshToken,
                scope: this.scope,
                token_type: this.tokenType,
                issued_at: this.issuedAt,
                expires_in: this.expiresIn
            };
        };
        TokenResponse.prototype.isValid = function (buffer) {
            if (buffer === void 0) {
                buffer = AUTH_EXPIRY_BUFFER;
            }
            if (this.expiresIn) {
                var now = exports.nowInSeconds();
                return now < this.issuedAt + this.expiresIn + buffer;
            } else {
                return true;
            }
        };
        return TokenResponse;
    }());
    exports.TokenResponse = TokenResponse;
    /**
     * Represents the Token Error type.
     * For more information look at:
     * https://tools.ietf.org/html/rfc6749#section-5.2
     */
    var TokenError = /** @class */ (function () {
        function TokenError(tokenError) {
            this.error = tokenError.error;
            this.errorDescription = tokenError.error_description;
            this.errorUri = tokenError.error_uri;
        }
        TokenError.prototype.toJson = function () {
            return {
                error: this.error,
                error_description: this.errorDescription,
                error_uri: this.errorUri
            };
        };
        return TokenError;
    }());
    exports.TokenError = TokenError;

}, {}], 16: [function (require, module, exports) {
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
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({
                        __proto__: []
                    }
                    instanceof Array && function (d, b) {
                        d.__proto__ = b;
                    }) ||
                function (d, b) {
                    for (var p in b)
                        if (b.hasOwnProperty(p)) d[p] = b[p];
                };
            return extendStatics(d, b);
        }
        return function (d, b) {
            extendStatics(d, b);

            function __() {
                this.constructor = d;
            }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var errors_1 = require("./errors");
    /**
     * An class that abstracts away the ability to make an XMLHttpRequest.
     */
    var Requestor = /** @class */ (function () {
        function Requestor() {}
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

}, {
    "./errors": 7
}], 17: [function (require, module, exports) {
    'use strict'

    exports.byteLength = byteLength
    exports.toByteArray = toByteArray
    exports.fromByteArray = fromByteArray

    var lookup = []
    var revLookup = []
    var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    for (var i = 0, len = code.length; i < len; ++i) {
        lookup[i] = code[i]
        revLookup[code.charCodeAt(i)] = i
    }

    // Support decoding URL-safe base64 strings, as Node.js does.
    // See: https://en.wikipedia.org/wiki/Base64#URL_applications
    revLookup['-'.charCodeAt(0)] = 62
    revLookup['_'.charCodeAt(0)] = 63

    function getLens(b64) {
        var len = b64.length

        if (len % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4')
        }

        // Trim off extra bytes after placeholder bytes are found
        // See: https://github.com/beatgammit/base64-js/issues/42
        var validLen = b64.indexOf('=')
        if (validLen === -1) validLen = len

        var placeHoldersLen = validLen === len ?
            0 :
            4 - (validLen % 4)

        return [validLen, placeHoldersLen]
    }

    // base64 is 4/3 + up to two characters of the original data
    function byteLength(b64) {
        var lens = getLens(b64)
        var validLen = lens[0]
        var placeHoldersLen = lens[1]
        return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
    }

    function _byteLength(b64, validLen, placeHoldersLen) {
        return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
    }

    function toByteArray(b64) {
        var tmp
        var lens = getLens(b64)
        var validLen = lens[0]
        var placeHoldersLen = lens[1]

        var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

        var curByte = 0

        // if there are placeholders, only get up to the last complete 4 chars
        var len = placeHoldersLen > 0 ?
            validLen - 4 :
            validLen

        for (var i = 0; i < len; i += 4) {
            tmp =
                (revLookup[b64.charCodeAt(i)] << 18) |
                (revLookup[b64.charCodeAt(i + 1)] << 12) |
                (revLookup[b64.charCodeAt(i + 2)] << 6) |
                revLookup[b64.charCodeAt(i + 3)]
            arr[curByte++] = (tmp >> 16) & 0xFF
            arr[curByte++] = (tmp >> 8) & 0xFF
            arr[curByte++] = tmp & 0xFF
        }

        if (placeHoldersLen === 2) {
            tmp =
                (revLookup[b64.charCodeAt(i)] << 2) |
                (revLookup[b64.charCodeAt(i + 1)] >> 4)
            arr[curByte++] = tmp & 0xFF
        }

        if (placeHoldersLen === 1) {
            tmp =
                (revLookup[b64.charCodeAt(i)] << 10) |
                (revLookup[b64.charCodeAt(i + 1)] << 4) |
                (revLookup[b64.charCodeAt(i + 2)] >> 2)
            arr[curByte++] = (tmp >> 8) & 0xFF
            arr[curByte++] = tmp & 0xFF
        }

        return arr
    }

    function tripletToBase64(num) {
        return lookup[num >> 18 & 0x3F] +
            lookup[num >> 12 & 0x3F] +
            lookup[num >> 6 & 0x3F] +
            lookup[num & 0x3F]
    }

    function encodeChunk(uint8, start, end) {
        var tmp
        var output = []
        for (var i = start; i < end; i += 3) {
            tmp =
                ((uint8[i] << 16) & 0xFF0000) +
                ((uint8[i + 1] << 8) & 0xFF00) +
                (uint8[i + 2] & 0xFF)
            output.push(tripletToBase64(tmp))
        }
        return output.join('')
    }

    function fromByteArray(uint8) {
        var tmp
        var len = uint8.length
        var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
        var parts = []
        var maxChunkLength = 16383 // must be multiple of 3

        // go through the array every three bytes, we'll deal with trailing stuff later
        for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
            parts.push(encodeChunk(
                uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
            ))
        }

        // pad the end with zeros, but make sure to not forget the extra bytes
        if (extraBytes === 1) {
            tmp = uint8[len - 1]
            parts.push(
                lookup[tmp >> 2] +
                lookup[(tmp << 4) & 0x3F] +
                '=='
            )
        } else if (extraBytes === 2) {
            tmp = (uint8[len - 2] << 8) + uint8[len - 1]
            parts.push(
                lookup[tmp >> 10] +
                lookup[(tmp >> 4) & 0x3F] +
                lookup[(tmp << 2) & 0x3F] +
                '='
            )
        }

        return parts.join('')
    }

}, {}]
}, {}, [1]);
