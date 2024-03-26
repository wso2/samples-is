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

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Grid } from "@mui/material";
import { getPets } from "apps/business-admin-app/APICalls/getPetList/get-pets";
import { getBookings } from "apps/business-admin-app/APICalls/GetUserBookings/get-bookings";
import { Booking } from "apps/business-admin-app/types/booking";
import { Pet } from "apps/business-admin-app/types/pets";
import Chart from "chart.js/auto";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Stack } from "rsuite";
import styles from "../../../../styles/Home.module.css";
import "chartjs-plugin-datalabels";
import BookingCard from "../sectionsRelatedToBookings/bookingCard";

interface GetStartedSectionComponentForPetOwnerProps {
    session: Session
}

/**
 * 
 * @param prop - session
 * 
 * @returns The idp interface section.
 */
export default function GetStartedSectionComponentForPetOwner(props: GetStartedSectionComponentForPetOwnerProps) {

    const { session } = props;
    const [ petList, setPetList ] = useState<Pet[] | null>(null);
    const typesToFilter: string[] = [ "dog", "cat", "rabbit" ];
    const [ filteredCount, setFilteredCount ] = useState<{ [key: string]: number }>({});
    const [ bookingList, setBookingList ] = useState<Booking[] | null>(null);
    const [ filteredBookings, setFilteredBookings ] = useState<Booking[] | null>(null);

    async function getPetList() {
        const accessToken = session.accessToken;

        getPets(accessToken)
            .then((res) => {
                if (res.data instanceof Array) {
                    setPetList(res.data);
                    setFilteredCount(filterAndCountPetsByType(res.data, typesToFilter));
                }
            })
            .catch((e) => {
                // eslint-disable-next-line no-console
                console.log(e);
            });
    }

    async function getBookingsList() {
        const accessToken = session.accessToken;

        getBookings(accessToken)
            .then((res) => {
                if (res.data instanceof Array) {
                    setBookingList(res.data);
                    setFilteredBookings(filterBookings(res.data));
                }
            })
            .catch((e) => {
                // eslint-disable-next-line no-console
                console.log(e);
            });
    }

    useEffect(() => {
        getPetList();
        getBookingsList();
    }, [ session ]);

    const DonutChart: React.FC = () => {
        const chartRef = useRef<HTMLCanvasElement>(null);
      
        useEffect(() => {
            if (chartRef.current) {
                const ctx = chartRef.current.getContext("2d");
      
                if (ctx) {
                    new Chart(ctx, {
                        type: "doughnut",
                        data: {
                            labels: [ "Dogs", "Cats", "Rabbits", "Others" ],
                            datasets: [
                                {
                                    data: [ filteredCount["dog"], 
                                        filteredCount["cat"], 
                                        filteredCount["rabbit"], 
                                        petList?.length-
                                    (filteredCount["dog"]+ filteredCount["cat"]+filteredCount["rabbit"]) ],
                                    backgroundColor: [ "#4e40ed", "#4e5ded", "#4e7eed", "#4e9bed" ]
                                }
                            ]
                        },
                        options: {
                            plugins: {
                                legend: {
                                    position: "right",
                                    align: "center"
                                }
                            }
                        }
                    });
                }
            }
        }, []);
      
        return <canvas ref={ chartRef } />;
    };
      

    return (
        <div
            className={ styles.tableMainPanelDivDoc }
        >
            <div className={ styles.welcomeMainDiv }>
                <AccountCircleIcon style={ { width: "8vh", height: "8vh" } }/>
                <div className={ styles. welcomeDiv }>
                    { "Welcome, " + session.user?.name.givenName + " " + session.user?.name.familyName + "!" }
                </div>
                <div className={ styles.tagLine }>
                    { "Your Pet's Health and Happiness Made Easy" }
                </div>

            </div>
            <Stack
                direction="row"
                justifyContent="space-between">
                <div className={ styles.chartDivForDoc }>
                    <div className={ styles.bookingSummaryHeader }>
                        Summary of pets
                    </div>
                    <div className={ styles.chartForBookingSummary }>
                        <div id="chartContainer">
                            <DonutChart />
                        </div>
                    </div>
                    <div className={ styles.totalBookingCountHeader }>
                        { petList? petList.length: 0 }
                    </div>
                    <div className={ styles.totalBookingHeader } >
                        Total Pets
                    </div>
                </div>
            </Stack>
            <Stack
                direction="row"
                justifyContent="space-between">
                <div className={ styles.upcomingBookingsDivForUser }>
                    <div className={ styles.dailyBookingSummaryHeader }>
                        Upcoming Bookings
                    </div>
                    { filteredBookings?.length>0 ? (
                        <div className={ styles.dashboardBookingDiv }>
                            <Grid container spacing={ 2 }>
                                { filteredBookings && filteredBookings.map((booking) => (
                                    <Grid
                                        item
                                        xs={ 4 }
                                        sm={ 4 }
                                        md={ 4 }
                                        key={ booking.id }
                                    >
                                        <BookingCard booking={ booking } isBookingCardOpen={ false } />
                                    </Grid>
                                )) }
                            </Grid>
                        </div>
                    ):(
                        <div className={ styles.noUpcomingBookingsDiv }>
                            { "0 Upcoming bookings" }
                            
                        </div>
                    ) }
                </div>
            </Stack>
        </div>
    );
}

function filterAndCountPetsByType(pets: Pet[], types: string[]): { [key: string]: number } {
    const filteredCounts: { [key: string]: number } = {};
  
    types.forEach((type) => {
        const filteredPets = pets.filter((pet) => pet.breed.toLowerCase() === type);

        filteredCounts[type] = filteredPets.length;
    });
  
    return filteredCounts;
}

function filterBookings(bookings: Booking[]): Booking[] {
    const today = new Date();
    let filteredBookings: Booking[] = [];
  
    filteredBookings = bookings.filter((booking) => {
        const providedDate = new Date(booking.date);

        return providedDate > today;
    });
  
    return filteredBookings;
}

