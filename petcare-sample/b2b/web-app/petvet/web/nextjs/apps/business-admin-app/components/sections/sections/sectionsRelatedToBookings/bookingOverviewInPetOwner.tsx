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
import { Grid,Typography } from "@mui/material";
import { ModelHeaderComponent } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { Booking } from "apps/business-admin-app/types/booking";
import { Button, Modal } from "rsuite";
import dateConverter from "./dateConverter";
import styles from "../../../../styles/booking.module.css";


interface BookingOverviewInPetOwnerViewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    booking: Booking;
}

/**
 * 
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 * 
 * @returns Modal to display overview of a pet.
 */
export default function BookingOverviewInPetOwnerView(props: BookingOverviewInPetOwnerViewProps) {

    const { isOpen, setIsOpen, booking } = props;

    const closeBookingOverviewDialog = (): void => {
        setIsOpen(false);
    };

    return (
        <><Modal
            backdrop="static"
            role="alertdialog"
            open={ isOpen }
            onClose={ closeBookingOverviewDialog }
            size="sm"
            className={ styles.bookingOverviewMainDiv }>

            <Modal.Header>
                <ModelHeaderComponent title="Booking Overview" />
            </Modal.Header>

            <Modal.Body>
                <div className={ styles.addUserMainDiv }>
                    <div className={ styles.basicInfoDiv }>
                        <Grid container spacing={ 2 }>
                            <Grid item xs={ 6 }>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>Appointment Number</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>Date</p>
                                </Typography>
                                { booking?.mobileNumber && (
                                    <Typography>
                                        <p className={ styles.bookingOverviewFont }>Mobile Number</p>
                                    </Typography>
                                ) }
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>{ "Pet's Date of Birth" }</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>Pet Name</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>Pet Owner Name</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>Pet Type</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>Session Start Time</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>Session End Time</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>Status</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>Created At</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>Email Address</p>
                                </Typography>
                            </Grid>
                            <Grid item xs={ 6 }>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>{ booking?.appointmentNumber }</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>{ booking?.date }</p>
                                </Typography>
                                { booking?.mobileNumber && (
                                    <Typography>
                                        <p className={ styles.bookingOverviewFont }>{ booking?.mobileNumber }</p>
                                    </Typography>
                                ) }
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>{ booking?.petDoB }</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>{ booking?.petName }</p>
                                </Typography>
                                { booking?.petOwnerName === ""? (
                                    <Typography>
                                        <p className={ styles.bookingOverviewFont }>{ " - " }</p>
                                    </Typography>
                                    
                                ):(
                                    <Typography>
                                        <p className={ styles.bookingOverviewFont }>{ booking?.petOwnerName }</p>
                                    </Typography>
                                ) }
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>{ booking?.petType }</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>{ booking?.sessionStartTime }</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>{ booking?.sessionEndTime }</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>{ booking?.status }</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>
                                        { dateConverter(booking?.createdAt) }</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingOverviewFont }>{ booking?.emailAddress }</p>
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                    <div className={ styles.bookingIconInOverview }>
                        <CalendarMonthIcon style={ { width: "100%", height: "100%", color: "var(--primary-color)" } }/>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={ closeBookingOverviewDialog } appearance="subtle">
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

