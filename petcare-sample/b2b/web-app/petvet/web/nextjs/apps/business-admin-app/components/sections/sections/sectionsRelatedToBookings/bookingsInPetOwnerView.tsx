/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { Grid } from "@mui/material";
import { getBookings } from "apps/business-admin-app/APICalls/GetUserBookings/get-bookings";
import { Booking } from "apps/business-admin-app/types/booking";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { Stack } from "rsuite";
import BookingCard from "./bookingCard";
import BookingOverviewInPetOwnerView from "./bookingOverviewInPetOwner";
import styles from "../../../../styles/doctor.module.css";

interface BookingsInPetOwnerSectionProps {
    session: Session
}

/**
 * 
 * @param prop - session
 * 
 * @returns The idp interface section.
 */
export default function BookingsInPetOwnerSection(props: BookingsInPetOwnerSectionProps) {

    const { session } = props;
    const [ bookingList, setBookingList ] = useState<Booking[] | null>(null);
    const [ isBookingCardOpen, setIsBookingCardOpen ] = useState(false);
    const [ booking, setBooking ] = useState<Booking | null>(null);


    async function getBookingsList() {
        const accessToken = session.accessToken;

        getBookings(accessToken)
            .then((res) => {
                if (res.data instanceof Array) {
                    setBookingList(res.data);
                }
            })
            .catch((e) => {
                // eslint-disable-next-line no-console
                console.log(e);
            });
    }


    useEffect(() => {
        getBookingsList();
    }, [ session ]);


    return (
        <div
            className={ styles.tableMainPanelDivDoc }
        >
            <Stack
                direction="row"
                justifyContent="space-between">
                <Stack direction="column" alignItems="flex-start">
                    <h2>{ "Available Bookings" }</h2>
                    <p>{ "Available bookings for your pet" }</p>
                </Stack>
            </Stack>
            <div className="booking-grid-div-in-channelling">
                <Grid container spacing={ 2 }>
                    { bookingList && bookingList.map((booking) => (
                        <Grid
                            item
                            xs={ 4 }
                            sm={ 4 }
                            md={ 4 }
                            key={ booking.id }
                            onClick={ () => { setBooking(booking); setIsBookingCardOpen(true); } }>
                            <BookingCard booking={ booking } isBookingCardOpen={ false } />
                        </Grid>
                    )) }
                </Grid>
            </div>
            <div>
                < BookingOverviewInPetOwnerView
                    isOpen={ isBookingCardOpen }
                    setIsOpen={ setIsBookingCardOpen }
                    booking={ booking } />
            </div>
            
        </div>
    );
}
