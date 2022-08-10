/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com).
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import url from "url";
import {
    AsgardeoAuthClient,
    AuthClientConfig,
    BasicUserInfo,
    CustomGrantConfig,
    DataLayer,
    DecodedIDTokenPayload,
    GetAuthURLConfig,
    OIDCEndpoints,
    TokenResponse
} from "@asgardeo/auth-js";
import { AsgardeoAuthException } from "@asgardeo/auth-js/src/exception";
import React, { FunctionComponent, useContext, useEffect, useState } from "react";
import { Linking } from "react-native";
import { ReactNativeCryptoUtils } from "./crypto-utils";
import { AuthContextInterface, AuthStateInterface, AuthUrl, AuthResponseErrorCode } from "./models";
import { LocalStorage } from "./store";

const initialState: AuthStateInterface = {
    accessToken: "",
    expiresIn: "",
    idToken: "",
    isAuthenticated: false,
    refreshToken: "",
    scope: "",
    tokenType: "",
    authResponseError: {}
};

// Instantiate the auth client object.
const store = new LocalStorage();
const cryptoUtils = new ReactNativeCryptoUtils();
const AuthClient = new AsgardeoAuthClient(store, cryptoUtils);

// Authentication Context to hold global states in react components.
const AuthContext = React.createContext<AuthContextInterface>(null);

const AuthProvider: FunctionComponent = (
    props: { children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | JSX.Element }
) => {
    const [ state, setState ] = useState(initialState);

    /**
     * This hook will register the url listener.
     */
    useEffect(() => {
        const subscription = Linking.addEventListener("url", handleAuthRedirect);

        return () => {
            // Linking.removeEventListener("url", handleAuthRedirect);
            subscription.remove();
        };
    }, []);

    /**
     *
     * This method initializes the SDK with the config data.
     *
     * @param {AuthClientConfig} config - Authentication config object.
     * @return {Promise<void>}
     *
     * @example
     * ```
     * initialize(config);
     * ```
     */
    const initialize = async (config: AuthClientConfig): Promise<void> => {

        await AuthClient.initialize(config);
    };

    /**
     * This method returns the `DataLayer` object that allows you to access authentication data.
     *
     * @return {Promise<DataLayer<any>>} - The `DataLayer` object.
     *
     * @example
     * ```
     * const data = await getDataLayer();
     * ```
     */
    const getDataLayer = async (): Promise<DataLayer<any>> => {

        return await AuthClient.getDataLayer();
    };

    /**
     * This is an async method that returns a Promise which resolves with the authorization URL.
     *
     * @param {GetAuthURLConfig} config - Auth url config (optional).
     * @return {Promise<string>} - A promise that resolves with the authorization URL.
     *
     * @example
     * ```
     * auth.getAuthorizationURL(config).then((url) => {
     *     this.props.navigation.navigate("SignIn", {url:url,config:Config})
     * }).catch((error) => {
     *     console.error(error);
     * });
     * ```
     */
    const getAuthorizationURL = async (config?: GetAuthURLConfig): Promise<string> => {

        return await AuthClient.getAuthorizationURL(config);
    };

    /**
     * This function obtains the authorization url and perform the signin redirection.
     *
     * @return {Promise<void>}
     *
     * @example
     * ```
     * signIn()
     * ```
     */
    const signIn = async (config?: GetAuthURLConfig): Promise<void> => {
        await AuthClient.getAuthorizationURL(config)
            .then((url) => {
                console.log(url);
                Linking.openURL(url);
            })
            .catch((error) => {
                console.log(error);
                throw new AsgardeoAuthException(
                    "AUTHENTICATE-SI-IV01",
                    "Failed to retrieve authorization url",
                    error
                );
            });
    };

    /**
     * This is an method that sends a request to obtain the access token and returns a Promise
     * that resolves with the token and other relevant data.
     *
     * @param {AuthUrl} authUrl - The authorization url.
     *
     * @return {Promise<TokenResponse>} - A Promise that resolves with the token response.
     *
     * @example
     * ```
     * requestAccessTokenDetails(authUrl).then((token) => {
     *     console.log("ReAccessToken", token);
     *     setAuthState({...token});
     * }).catch((error) => {
     *     console.log(error);
     * });
     * ```
     */
    const requestAccessTokenDetails = async (authUrl: AuthUrl): Promise<TokenResponse> => {

        const urlObject = url.parse(authUrl.url);
        const dataList = urlObject.query.split("&");
        const code = dataList[ 0 ].split("=")[ 1 ];
        const state = dataList[ 1 ].split("=")[ 1 ];
        const sessionState = dataList[ 2 ].split("=")[ 1 ];

        const authState = await AuthClient.requestAccessToken(code, sessionState, state);

        /**
         * TODO: Remove this waiting once https://github.com/asgardeo/asgardeo-auth-js-sdk/issues/164 is fixed.
         */
        await getAccessToken();

        setState({ ...authState, isAuthenticated: true });

        return authState;
    };

    /**
     * This method refreshes the access token and returns a Promise that resolves with the new access
     * token and other relevant data.
     *
     * @return {Promise<TokenResponse>} - A Promise that resolves with the token response.
     *
     * @example
     * ```
     * refreshAccessToken().then((response) => {
     *     console.log(response);
     * }).catch((error) => {
     *     console.error(error);
     * });
     * ```
     */
    const refreshAccessToken = async (): Promise<TokenResponse> => {

        setState({ ...state, isAuthenticated: false });
        const authState = await AuthClient.refreshAccessToken();

        setState({ ...authState, isAuthenticated: true });

        return authState;
    };

    /**
     * This method returns the sign-out URL.
     *
     * **This doesn't clear the authentication data.**
     *
     * @return {Promise<string>} - A Promise that resolves with the sign-out URL.
     *
     * @example
     * ```
     * const signOutUrl = await getSignOutURL();
     * ```
     */
    const getSignOutURL = async (): Promise<string> => {

        return await AuthClient.getSignOutURL();
    };

    /**
     * This method clears all authentication data and returns the sign-out URL.
     *
     * @return  {Promise<void>}
     *
     * @example
     * ```
     * signOut();
     * ```
     */
    const signOut = async (): Promise<void> => {

        await AuthClient.getSignOutURL()
            .then((signOutUrl) => {
                Linking.openURL(signOutUrl);
            })
            .catch((error) => {
                throw new AsgardeoAuthException(
                    "AUTHENTICATE-SO-IV01",
                    "Failed to retrieve signout url",
                    error
                );
            });
    };

    /**
     * This method returns OIDC service endpoints that are fetched from the `.well-known` endpoint.
     *
     * @return {Promise<OIDCEndpoints>} - A Promise that resolves with an object containing the OIDC service endpoints.
     *
     * @example
     * ```
     * const endpoints = await getOIDCServiceEndpoints();
     * ```
     */
    const getOIDCServiceEndpoints = async (): Promise<OIDCEndpoints> => {

        return await AuthClient.getOIDCServiceEndpoints();
    };

    /**
     * This method decodes the payload of the ID token and returns it.
     *
     * @return {Promise<DecodedIDTokenPayload>} - A Promise that resolves with the decoded ID token payload.
     *
     * @example
     * ```
     * const decodedIdToken = await getDecodedIDToken();
     * ```
     *
     */
    const getDecodedIDToken = async (): Promise<DecodedIDTokenPayload> => {

        return await AuthClient.getDecodedIDToken();
    };

    /**
     * This method returns the basic user information obtained from the ID token.
     *
     * @return {Promise<BasicUserInfo>} - A Promise that resolves with an object containing the basic user information.
     *
     * @example
     * ```
     * const userInfo = await getBasicUserInfo();
     * ```
     */
    const getBasicUserInfo = async (): Promise<BasicUserInfo> => {

        return await AuthClient.getBasicUserInfo();
    };

    /**
     * This method revokes the access token.
     *
     * **This method also clears the authentication data.**
     *
     * @return {Promise<any>} - A Promise that returns the response of the revoke-access-token request.
     *
     * @example
     * ```
     * revokeAccessToken().then((response)=>{
     *     console.log(response);
     * }).catch((error)=>{
     *     console.error(error);
     * });
     * ```
     */
    const revokeAccessToken = async (): Promise<any> => {

        await AuthClient.revokeAccessToken()
            .then((response) => {
                setState(initialState);

                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    };

    /**
     * This method returns the access token.
     *
     * @return {Promise<string>} - A Promise that resolves with the access token.
     *
     * @example
     * ```
     * const accessToken = await getAccessToken();
     * ```
     */
    const getAccessToken = async (): Promise<string> => {

        return await AuthClient.getAccessToken();
    };

    /**
     * This method returns the id token.
     *
     * @return {Promise<string>} - A Promise that resolves with the id token.
     *
     * @example
     * ```
     * const idToken = await getIDToken();
     * ```
     */
    const getIDToken = async (): Promise<string> => {

        return await AuthClient.getIDToken();
    };

    /**
     * This method returns if the user is authenticated or not.
     *
     * @return {Promise<boolean>} - A Promise that resolves with `true` if the user is authenticated, `false` otherwise.
     *
     * @example
     * ```
     * await isAuthenticated();
     * ```
     */
    const isAuthenticated = async (): Promise<boolean> => {

        return await AuthClient.isAuthenticated();
    };

    /**
     * This method returns the PKCE code generated during the generation of the authentication URL.
     *
     * @return {Promise<string>} - A Promise that resolves with the PKCE code.
     *
     * @example
     * ```
     * const pkce = await getPKCECode();
     * ```
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const getPKCECode = async (state: string): Promise<string> => {

        return await AuthClient.getPKCECode(state);
    };

    /**
     * This method sets the PKCE code to the data store.
     *
     * @param {string} pkce - The PKCE code.
     * @return  {Promise<void>}
     *
     * @example
     * ```
     * await setPKCECode("pkce_code")
     * ```
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setPKCECode = async (pkce: string, state: string): Promise<void> => {

        return await AuthClient.setPKCECode(pkce, state);
    };

    /**
     * This method returns if the sign-out is successful or not.
     *
     * @param {string} signOutRedirectUrl - The URL to which the user has been redirected to after signing-out.
     *
     * @return {boolean} - `true` if successful, `false` otherwise.
     *
     * @example
     * ```
     * const hasSignOut = isSignOutSuccessful("signOutRedirectURL");
     * ```
     */
    const isSignOutSuccessful = (signOutRedirectURL: string): boolean => {

        return AsgardeoAuthClient.isSignOutSuccessful(signOutRedirectURL);
    };

    /**
     * This method updates the configuration that was passed into the constructor when instantiating this class.
     *
     * @param {Partial<AuthClientConfig>} config - A config object to update the SDK configurations with.
     *
     * @example
     * ```
     * const config = {
     *     clientID: "client ID",
     *     serverOrigin: "https://localhost:9443"
     * }
     *
     * await updateConfig(config);
     */
    const updateConfig = async (config: Partial<AuthClientConfig>): Promise<void> => {

        return await AuthClient.updateConfig(config);
    };


    /**
     * This method sends a custom-grant request and returns a Promise that resolves with the response
     * depending on the config passed.
     *
     * @param {CustomGrantConfig} config - A config object containing the custom grant configurations.
     *
     * @return {Promise<any>} - A Promise that resolves with the response depending on your configurations.
     *
     * @example
     * ```
     * const config = {
     *   attachToken: false,
     *   data: {
     *       client_id: "{{clientID}}",
     *       grant_type: "account_switch",
     *       scope: "{{scope}}",
     *       token: "{{token}}",
     *   },
     *   id: "account-switch",
     *   returnResponse: true,
     *   returnsSession: true,
     *   signInRequired: true
     * }
     *
     * requestCustomGrant(config).then((response) => {
     *     console.log(response);
     * }).catch((error) => {
     *     console.error(error);
     * });
     * ```
     */
    const requestCustomGrant = async (config: CustomGrantConfig): Promise<any> => {

        return await AuthClient.requestCustomGrant(config);
    };

    /**
     * This function will handle authentication/ signout redirections.
     *
     * @param {AuthUrl} authUrl - redirection url.
     * @return  {Promise<void>}
     */
    const handleAuthRedirect = async (authUrl: AuthUrl): Promise<void> => {
        try {
            if (url.parse(authUrl?.url)?.query.indexOf("code=") > -1) {
                await requestAccessTokenDetails(authUrl);
            } else if (url.parse(authUrl?.url)?.query.indexOf("state=sign_out") > -1) {
                const dataList = url.parse(authUrl?.url)?.query.split("&");
                const authState = dataList[0].split("=")[1];

                if (authState === "sign_out_success") {
                    try {
                        await AuthClient.getDataLayer().removeOIDCProviderMetaData();
                        await AuthClient.getDataLayer().removeTemporaryData();
                        await AuthClient.getDataLayer().removeSessionData();
                        setState(initialState);
                    } catch (error) {
                        throw new AsgardeoAuthException(
                            "AUTHENTICATE-HAR-IV01",
                            "Error in signout",
                            error
                        );
                    }
                }
            } else if (url.parse(authUrl?.url)?.query.indexOf("error_description=") > -1) {
                const dataList = url.parse(authUrl?.url)?.query.split("&");
                const errorDescription = dataList[0].split("=")[1];
                const errorCode = dataList[2].split("=")[1];
                const errorMessage = errorDescription.split("+").join(" ");
                
                const error = { errorCode: errorCode as unknown as AuthResponseErrorCode, errorMessage };
                setState({ ...state, authResponseError: error });
            } else {
                    // TODO: Add logs when a logger is available.
                    // Tracked here https://github.com/asgardeo/asgardeo-auth-js-sdk/issues/151.
                }
            } catch (error) {
                // TODO: Add logs when a logger is available.
                // Tracked here https://github.com/asgardeo/asgardeo-auth-js-sdk/issues/151.
            }
    };

    /**
     * This method clear the authentication response errors from state
     */
    const clearAuthResponseError = () : void => {
        setState({ ...state, authResponseError: {} });
    };

    return (
        <AuthContext.Provider
            value={ {
                getAccessToken,
                getAuthorizationURL,
                getBasicUserInfo,
                getDataLayer,
                getDecodedIDToken,
                getIDToken,
                getOIDCServiceEndpoints,
                getSignOutURL,
                initialize,
                isAuthenticated,
                isSignOutSuccessful,
                refreshAccessToken,
                requestCustomGrant,
                revokeAccessToken,
                signIn,
                signOut,
                state,
                updateConfig,
                clearAuthResponseError
            } }
        >
            { props.children }
        </AuthContext.Provider>
    );
};

const useAuthContext = (): AuthContextInterface => {
    return useContext(AuthContext);
};

export { AuthClient, AuthProvider, useAuthContext };
