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

import React, { FunctionComponent, MouseEvent, ReactElement, useState } from "react";
import { BookingTypes } from "../models/ticket-booking";
import ConcertData from "../data/concerts.json";
import FilmData from "../data/films.json";
import { useAuthContext } from "@asgardeo/auth-react";
import { FALLBACK_ERROR_MESSAGE } from "../constants/errors";

export interface TicketBookingFormProps {
    /**
     * Current booking type.
     */
    bookingType: string;
    /**
     * Backend service URL.
     */
    serverUrl: string;
}

/**
 * Ticket booking form component.
 *
 * @param {TicketBookingFormProps} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const TicketBookingForm: FunctionComponent<TicketBookingFormProps> = (
    {
        bookingType,
        serverUrl
    }
): ReactElement => {
    let data: any = null;

    if (bookingType === BookingTypes.MOVIE) {
        data = FilmData
    } else {
        data = ConcertData;
    }

    const [ name, setName ] = useState<string>("");
    const [ ticketCount, setTicketCount ] = useState<number>(1);
    const [ location, setLocation ] = useState<string>(data.locations[0]);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ errorMsg, setErrorMsg ] = useState<string>("");
    const [ formSubmitted, setFormSubmitted ] = useState<boolean>(false);

    const {
        httpRequest
    } = useAuthContext();

    /**
     * Get the total amount for the booking.
     */
    const getTotalAmount = (): number => {
        const pricePerTicket: number = data.list.find((item: any) => item.name === name)?.price || 0;
        return pricePerTicket * ticketCount;
    }

    /**
     * Handle form submission.
     */
    const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!name) {
            alert("Please select a " + data.title);
            return;
        }

        setLoading(true);
        httpRequest({
            method: "POST",
            url: serverUrl,
            data: { name, ticketCount, location, totalAmount: getTotalAmount(), bookingType },
            headers: {
                "Content-Type": "application/json"
            }
        }).then(() => {
            setFormSubmitted(true);
            setLoading(false);
            setErrorMsg("");
        }).catch((error) => {
            setFormSubmitted(true);
            setLoading(false);
            setErrorMsg(error?.response?.data?.description || FALLBACK_ERROR_MESSAGE);
        });
    }

    return (
        <>
            {
                loading && (
                    <div className="content">Loading ...</div>
                )
            }
            {
                !loading && errorMsg && (
                    <div className="content">
                        <div className="ui visible negative message">
                            <div className="header"><b>Error!</b></div>
                            <p>{ errorMsg }</p>
                        </div>
                    </div>
                )
            }
            {
                !loading && !errorMsg && !formSubmitted && (
                    <div className="form-container">
                        <h2>Book Your { data.title }</h2>
                        <form>
                            <div className="form-group">
                                <label>Name:</label>
                                <select value={ name } onChange={ (e) => setName(e.target.value) }>
                                    <option disabled key="default" value="">Select a { data.title }</option>
                                    {
                                        data.list.map((item: any, index: number) => {
                                            return (
                                                <option key={ index } value={ item.name }>{ item.name }</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Number of Ticket:</label>
                                <input 
                                    type="number"
                                    min="1"
                                    value={ ticketCount }
                                    onChange={ (e) => setTicketCount(parseInt(e.target.value)) }
                                />
                            </div>
                            <div className="form-group">
                                <label>Location:</label>
                                <select value={ location } onChange={ (e) => setLocation(e.target.value) }>
                                    {
                                        data.locations.map((item: any, index: number) => {
                                            return (
                                                <option key={ index } value={ item }>{ item }</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                            <h1>Total Amount: { getTotalAmount().toFixed(2) } USD</h1>
                            <button
                                className="btn primary mt-0"
                                onClick={ handleSubmit }
                            >
                                Confirm
                            </button>
                        </form>
                    </div>
                )
            }
            {
                !loading && !errorMsg && formSubmitted && (
                    <div className="content">
                        <div className="ui visible success message">
                            <div className="header"><b>Success!</b></div>
                            <p>Booking for { name } is successful.</p>
                        </div>
                    </div>
                )
            }
        </>
    );
};
