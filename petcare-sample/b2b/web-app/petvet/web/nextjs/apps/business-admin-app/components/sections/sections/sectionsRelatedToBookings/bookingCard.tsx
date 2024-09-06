/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { Booking } from "apps/business-admin-app/types/booking";
import React from "react";
import convertTo12HourTime from "./timeConverter";
import styles from "../../../../styles/booking.module.css";

interface BookingCardProps {
    booking: Booking;
    isBookingCardOpen: boolean;
}

function BookingCard(props: BookingCardProps) {
    const { booking, isBookingCardOpen } = props;


    return (
        <>
            <Card className={ styles.bookingCard }>
                <CardContent>
                    <div className={ styles.bookingIcon }>
                        <CalendarMonthIcon style={ { width: "100%", height: "100%", color: "var(--primary-color)" } } />
                    </div>
                    <div className={ styles.bookingSummary }>
                        <Grid container spacing={ 2 }>
                            <Grid item xs={ 6 }>
                                <Typography className="typography-style">
                                    <p className={ styles.bookingOverviewFont }>Appt. No.</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.bookingOverviewFont }>Date</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.bookingOverviewFont }>Start Time</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.bookingOverviewFont }>Status</p>
                                </Typography>
                            </Grid>
                            <Grid item xs={ 6 }>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.bookingOverviewFont }>{ booking.appointmentNumber }</p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.bookingOverviewFont }>{ booking.date }</p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.bookingOverviewFont }>
                                        { convertTo12HourTime(booking.sessionStartTime) }</p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p
                                        className={ booking.status === "Completed"? 
                                            styles.bookingOverviewFontSec : styles.bookingOverviewFont }>
                                        { booking.status }</p>
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                </CardContent>
            </Card>
        </>
    );

}

export default React.memo(BookingCard);
