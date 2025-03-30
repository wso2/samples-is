/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { Hooks, useAuthContext } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { default as authConfig } from "../config.json";
import REACT_LOGO from "../images/react-logo.png";
import { DefaultLayout } from "../layouts/default";
import { useLocation } from "react-router-dom";
import { LogoutRequestDenied } from "../components/LogoutRequestDenied";
import { USER_DENIED_LOGOUT } from "../constants/errors";
import { TicketBookingForm } from "../components/TicketBookingForm";
import { BookingTypes } from "../models/ticket-booking";
import { AUTHORIZATION_DETAILS_KEY, BOOKING_TYPE_STORAGE_KEY, SESSION_DATA_KEY_PREFIX, TICKET_BOOKING_CREATION_TYPE } from "../constants/ticket-booking";
import CONCERT from "../images/concert.png";
import FILM from "../images/movie.png";

const BACKEND_URL = authConfig?.resourceServerURLs?.[0];

/**
 * Home page for the Sample.
 *
 * @param props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const HomePage: FunctionComponent = (): ReactElement => {

    const {
        state,
        signIn,
        signOut,
        on
    } = useAuthContext();

    const [ hasAuthenticationErrors, setHasAuthenticationErrors ] = useState<boolean>(false);
    const [ hasLogoutFailureError, setHasLogoutFailureError ] = useState<boolean>();

    const search = useLocation().search;
    const stateParam = new URLSearchParams(search).get('state');
    const errorDescParam = new URLSearchParams(search).get('error_description');
    const currentSelectedBookingType: string = sessionStorage?.getItem(BOOKING_TYPE_STORAGE_KEY);

    const [ signInRequestLoading, setSignInRequestLoading ] = useState<boolean>(false);

    /**
     * Key that stores the session data in the session storage.
     */
    const getSessionDataKey = (): string => {
        for (let key in sessionStorage) {
            if (key.startsWith(SESSION_DATA_KEY_PREFIX)) {
                return key;
            }
        }
    };

    useEffect(() => {
        if(stateParam && errorDescParam) {
            if(errorDescParam === "End User denied the logout request") {
                setHasLogoutFailureError(true);
            }
        }
    }, [stateParam, errorDescParam]);

    const handleLogin = useCallback((bookingType?: BookingTypes) => {
        setSignInRequestLoading(true);
        const additionalParams: Record<string, string> = {}
        if (bookingType) {
            additionalParams[AUTHORIZATION_DETAILS_KEY] = JSON.stringify([{
                type: TICKET_BOOKING_CREATION_TYPE,
                bookingType
            }]);
        }
        if (state.isAuthenticated) {
            sessionStorage.removeItem(getSessionDataKey());
            additionalParams.prompt = "none";
        }
        if (bookingType) {
            sessionStorage.setItem(BOOKING_TYPE_STORAGE_KEY, bookingType);
        } else {
            sessionStorage.removeItem(BOOKING_TYPE_STORAGE_KEY);
        }
        setHasLogoutFailureError(false);
        signIn(additionalParams).catch(() => setHasAuthenticationErrors(true));
    }, [ signIn ]);

   /**
     * handles the error occurs when the logout consent page is enabled
     * and the user clicks 'NO' at the logout consent page
     */
    useEffect(() => {
        on(Hooks.SignOut, () => {
            setHasLogoutFailureError(false);
        });

        on(Hooks.SignOutFailed, () => {
            if(!errorDescParam) {
                handleLogin();
            }
        })
    }, [ on, handleLogin, errorDescParam]);

    const handleLogout = () => {
        signOut();
    };

    // If `clientID` is not defined in `config.json`, show a UI warning.
    if (!authConfig?.clientID) {

        return (
            <div className="content">
                <h2>You need to update the Client ID to proceed.</h2>
                <p>Please open &quot;src/config.json&quot; file using an editor, and update
                    the <code>clientID</code> value with the registered application&apos;s client ID.</p>
                <p>Visit repo <a
                    href="https://github.com/wso2/samples-is/blob/master/rar-samples/ticket-booking-app/frontend/README.md"
                    target="_blank" rel="noreferrer noopener">README</a> for
                    more details.</p>
            </div>
        );
    }

    if (hasLogoutFailureError) {
        return (
            <LogoutRequestDenied
                errorMessage={USER_DENIED_LOGOUT}
                handleLogin={handleLogin}
                handleLogout={handleLogout}
            />
        );
    }

    return (
        <DefaultLayout
            isLoading={ state.isLoading || signInRequestLoading }
            hasErrors={ hasAuthenticationErrors }
        >
            {
                currentSelectedBookingType
                    ? (
                        <div className="content">
                            <TicketBookingForm serverUrl={ BACKEND_URL } bookingType={ currentSelectedBookingType }/>
                            <button
                                className="btn secondary"
                                onClick={ () => handleLogin() }
                            >
                                Home
                            </button>
                        </div>
                    )
                    : (
                        <div className="content">
                            <div className="home-image">
                                <img alt="react-logo" src={ REACT_LOGO } className="react-logo-image logo"/>
                            </div>
                            <h4 className={ "spa-app-description" }>
                                Sample demo showcasing how Rich Authorization Requests (RAR) can be used to handle complex 
                                authorization scenarios through the&nbsp;
                                <a href="https://github.com/wso2/samples-is/blob/master/rar-samples/ticket-booking-app/README.md" target="_blank" rel="noreferrer noopener">
                                    Ticket Booking application
                                </a>.
                            </h4>
                            <h2>Ticket Booking Application</h2>
                            <h4>Choose a booking type</h4>
                            <div className="booking-types-container">
                                <div 
                                    className="booking-type-card pointer"
                                    onClick={ () => handleLogin(BookingTypes.MOVIE) }
                                >
                                    <img alt="movie" src={ FILM }/>
                                    <p>Movie</p>
                                </div>
                                <div 
                                    className="booking-type-card pointer"
                                    onClick={ () => handleLogin(BookingTypes.CONCERT) }
                                >
                                    <img alt="movie" src={ CONCERT }/>
                                    <p>Concert</p>
                                </div>
                            </div>
                            {
                                state.isAuthenticated && (
                                    <button
                                        className="btn primary"
                                        onClick={ () => {
                                            handleLogout();
                                        } }
                                    >
                                        Logout
                                    </button>
                                )
                            }
                        </div>
                    )
            }
        </DefaultLayout>
    );
};
