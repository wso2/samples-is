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
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getDoctorBookingsPerDay } from "apps/business-admin-app/APICalls/GebookingsPerDay/get-bookings-per-day";
import { getDoctorBookings } from "apps/business-admin-app/APICalls/GetDoctorBookings/get-doc-bookings";
import { getProfile } from "apps/business-admin-app/APICalls/GetProfileInfo/me";
import { Booking } from "apps/business-admin-app/types/booking";
import { Doctor } from "apps/business-admin-app/types/doctor";
import { format } from "date-fns";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Stack } from "rsuite";
import styles from "../../../../styles/doctor.module.css";
import BookingCard from "../sectionsRelatedToBookings/bookingCard";

interface DoctorBookingsSectionProps {
    session: Session
}

/**
 * 
 * @param prop - session
 * 
 * @returns The doctor bookings section.
 */
export default function DoctorBookingsSection(props: DoctorBookingsSectionProps) {

    const { session } = props;
    const [ isBookingOverviewOpen, setIsBookingOverviewOpen ] = useState(false);
    const [ bookingList, setBookingList ] = useState<Booking[] | null>(null);
    const [ bookingListPerDay, setBookingListPerDay ] = useState<Booking[] | null>(null);
    const [ booking, setBooking ] = useState<Booking | null>(null);
    const[ doctor, setDoctor ] = useState<Doctor | null>(null);
    const router = useRouter();
    const [ selectedDate, setSelectedDate ] = useState<Date | null>(new Date());
    const [ stringDate, setStringDate ] = useState("");

    
    async function getBookings() {
        const accessToken = session?.accessToken;

        getProfile(accessToken)
            .then(async (res) => {
                if (res.data) {
                    setDoctor(res.data);
                }
                const response = await getDoctorBookings(accessToken, res.data.id);

                if (response.data instanceof Array) {
                    setBookingList(response.data);
                }
            })
            .catch((e) => {
                // eslint-disable-next-line no-console
                console.log(e);
            });
    }

    const getFormattedDate = (date: Date): string => {
        const formattedDate = format(date, 'yyyy-MM-dd');

        return formattedDate;
    };

    useEffect(() =>{
        getBookings();
    }, [ session ]);

    useEffect(() =>{
        getBookingsPerDay(getFormattedDate(new Date()));
    }, [ doctor?.id ]);

    async function getBookingsPerDay(date: string) {
        const accessToken = session?.accessToken;

        getDoctorBookingsPerDay(accessToken, doctor?.id, date )
            .then(async (response) => {
                if (response.data instanceof Array) {
                    setBookingListPerDay(response.data);
                }
            })
            .catch((e) => {
                // eslint-disable-next-line no-console
                console.log(e);
            });
    }



    const handleClick = (booking: Booking) => {
        router.push({
            pathname: "/bookingDetails",
            query: { 
                appointmentNumber: booking.appointmentNumber,
                date: booking.date,
                doctorId: booking.doctorId,
                emailAddress: booking.emailAddress,
                id: booking.id,
                mobileNumber: booking.mobileNumber,
                orgId: session.orgId,
                petId: booking.petId, 
                petOwnerName: booking.petOwnerName,
                sessionEndTime: booking.sessionEndTime,
                sessionStartTime: booking.sessionStartTime,
                status: booking.status,
                token: session?.accessToken
            }
        });
    };

    const DatePickerComponent: React.FC = () => {
      
        const handleDateChange = (date: Date | null) => {
            setSelectedDate(date);
            const formattedDate = getFormattedDate(date);

            setStringDate(formattedDate);
            getBookingsPerDay(formattedDate);
        };
      
        return (
            <LocalizationProvider dateAdapter={ AdapterDateFns }>
                <DatePicker
                    label="Select a date"
                    value={ selectedDate }
                    onChange={ (date) => handleDateChange(date) }
                />
            </LocalizationProvider>
        );
    };

    return (
        <div
            className={ styles.tableMainPanelDivDoc }
        >
            <Stack
                direction="row"
                justifyContent="space-between">
                <Stack direction="column" alignItems="flex-start">
                    <h2>{ "Bookings" }</h2>
                    <p>{ "Available Bookings for the doctor" }</p>
                </Stack>
            </Stack>
            <div >
                <DatePickerComponent />
                <br/><br/>
                <Grid container spacing={ 2 }>
                    { bookingListPerDay && bookingListPerDay.map((booking) => ( 
                        <Grid
                            item
                            xs={ 4 }
                            sm={ 4 }
                            md={ 4 }
                            key={ booking.id }
                            onClick={ () => { 
                                setIsBookingOverviewOpen(true); 
                                setBooking(booking); 
                                handleClick(booking);} }>
                            <BookingCard booking={ booking } isBookingCardOpen={ isBookingOverviewOpen } />
                        </Grid>
                    )) }
                </Grid>
            </div>
        </div>
    );
}
  
