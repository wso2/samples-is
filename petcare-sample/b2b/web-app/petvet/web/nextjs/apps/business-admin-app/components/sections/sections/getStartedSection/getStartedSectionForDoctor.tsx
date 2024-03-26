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
import { getDoctorBookingsPerDay } from "apps/business-admin-app/APICalls/GebookingsPerDay/get-bookings-per-day";
import { getDoctorBookings } from "apps/business-admin-app/APICalls/GetDoctorBookings/get-doc-bookings";
import { getProfile } from "apps/business-admin-app/APICalls/GetProfileInfo/me";
import { Booking, BookingResult } from "apps/business-admin-app/types/booking";
import { Doctor } from "apps/business-admin-app/types/doctor";
import Chart from "chart.js/auto";
import { format, parse } from "date-fns";
import { Session } from "next-auth";
import { useEffect, useRef, useState } from "react";
import { Stack } from "rsuite";
import styles from "../../../../styles/Home.module.css";

interface GetStartedSectionComponentForDoctorProps {
    session: Session
}

/**
 * 
 * @param prop - session
 * 
 * @returns The idp interface section.
 */
export default function GetStartedSectionComponentForDoctor(props: GetStartedSectionComponentForDoctorProps) {

    const { session } = props;
    const [ doctor, setDoctor ] = useState<Doctor | null>(null);
    const [ bookingList, setBookingList ] = useState<Booking[] | null>(null);
    const typesToFilter: string[] = [ "confirmed", "completed" ];
    const [ filteredCount, setFilteredCount ] = useState<{ [key: string]: number }>({});
    const [ yesterday, setYesterday ] = useState("");
    const [ today, setToday ] = useState("");
    const [ tommorrow, setTommorrow ] = useState("");
    const [ todayBookingCount, setTodayBookingCount ] = useState(0);
    const [ tommorrowBookingCount, setTommorrowBookingCount ] = useState(0);
    const [ yesterdayBookingCount, setYesterdayBookingCount ] = useState(0);

    async function getBookings(): Promise<void> {
        const accessToken = session?.accessToken;

        getProfile(accessToken)
            .then(async (res) => {
                if (res.data) {
                    setDoctor(res.data);
                }
                const response = await getDoctorBookings(accessToken, res.data.id);

                if (response.data instanceof Array) {
                    setBookingList(response.data);
                    setFilteredCount(filterAndCountBookingsByStatus(response.data, typesToFilter));
                }
            })
            .catch((e) => {
                // eslint-disable-next-line no-console
                console.log(e);
            });
    }

    const getFormattedDate = (date: Date): string => {
        const localDateString = date.toLocaleDateString();
        const parsedDate = parse(localDateString, "M/d/yyyy", new Date());
        const formattedDate = format(parsedDate, "yyyy-MM-dd");

        return formattedDate;
    };

    async function getBookingsPerDayForGraph(date: string): Promise<BookingResult[]> {
        try {
            const accessToken = session?.accessToken;
            const doctorId = doctor?.id;
      
            const response = await getDoctorBookingsPerDay(accessToken, doctorId, date);
      
            if (response.data instanceof Array) {
                return response.data as BookingResult[];
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        }
      
        return [];
    }
      

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getBookings();
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log(error);
            }
        };
        
        fetchData();
    }, [ session ]);


    useEffect(() => {

        const fetchData = async () => {
            try {
                const currentDate = new Date();
                const tomorrowDate = new Date();
                const yesterdayDate = new Date();
        
                yesterdayDate.setDate(currentDate.getDate() - 1);
                tomorrowDate.setDate(currentDate.getDate() + 1);

                setYesterday(getFormattedDate((yesterdayDate)));
                setToday(getFormattedDate((currentDate)));
                setTommorrow(getFormattedDate((tomorrowDate)));


                const todayBookingList = 
                await getBookingsPerDayForGraph(getFormattedDate(currentDate));
                const tommorrowBookingList = 
                await getBookingsPerDayForGraph(getFormattedDate(tomorrowDate));
                const yesterdayBookingList = 
                await getBookingsPerDayForGraph(getFormattedDate(yesterdayDate));

                setTodayBookingCount(todayBookingList.length);
                setTommorrowBookingCount(tommorrowBookingList.length);
                setYesterdayBookingCount(yesterdayBookingList.length);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.log(error);
            }
        };
        
        fetchData();
        
    }, [ doctor?.id ]);

    const DonutChart: React.FC = () => {
        const chartRef = useRef<HTMLCanvasElement>(null);
      
        useEffect(() => {
            if (chartRef.current) {
                const ctx = chartRef.current.getContext("2d");
      
                if (ctx) {
                    new Chart(ctx, {
                        type: "doughnut",
                        data: {
                            labels: [ "Confirmed", "Completed" ],
                            datasets: [
                                {
                                    data: [ filteredCount["confirmed"], filteredCount["completed"] ],
                                    backgroundColor: [ "#4e40ed", "#4e7eed" ]
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

    const BarChart: React.FC = () => {
        const chartRef = useRef<HTMLCanvasElement>(null);
      
        useEffect(() => {
            if (chartRef.current) {
                const ctx = chartRef.current.getContext("2d");
      
                if (ctx) {
                    new Chart(ctx, {
                        type: "bar",
                        data: {
                            labels: [ yesterday, today, tommorrow ],
                            datasets: [
                                {
                                    label: "Booking Count",
                                    data: [ yesterdayBookingCount, todayBookingCount, tommorrowBookingCount ],
                                    backgroundColor: 
                                    [ "#4e5ded" ]
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        precision: 0 
                                    }
                                }
                            }
                        }
                    });
                }
            }
        }, [ todayBookingCount,tommorrowBookingCount, yesterdayBookingCount ]);
      
        return <canvas ref={ chartRef }></canvas>;
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
                    { "Simplify Your Practice, Focus on Exceptional Pet Care" }
                </div>
            </div>
            <Stack
                direction="row"
                justifyContent="space-between">
                <div className={ styles.chartDivForDoc }>
                    <div className={ styles.bookingSummaryHeader }>
                        Booking Summary
                    </div>
                    <div className={ styles.chartForBookingSummary }>
                        <div id="chartContainer">
                            <DonutChart />
                        </div>
                    </div>
                    <div className={ styles.totalBookingCountHeader }>
                        { bookingList? bookingList.length: 0 }
                    </div>
                    <div className={ styles.totalBookingHeader } >
                        Total Bookings
                    </div>
                </div>
            </Stack>
            <Stack
                direction="row"
                justifyContent="space-between">
                <div className={ styles.dailyChartDivForDoc }>
                    <div className={ styles.dailyBookingSummaryHeader }>
                        Bookings Summary
                    </div>
                    <div id="barChartContainer" className={ styles.dailiBookingsChart }>
                        <BarChart />
                    </div>
                </div>
            </Stack>
        </div>
    );
}

function filterAndCountBookingsByStatus(bookings: Booking[], types: string[]): { [key: string]: number } {
    const filteredCounts: { [key: string]: number } = {};
  
    types.forEach((type) => {
        const filteredBookings = bookings.filter((booking) => booking.status.toLowerCase() === type);

        filteredCounts[type] = filteredBookings.length;
    });
  
    return filteredCounts;
}
