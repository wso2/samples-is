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

import { Container, Grid } from "@mui/material";
import { getDoctors } from "apps/business-admin-app/APICalls/getDoctors/get-doctors";
import { getOrgInfo } from "apps/business-admin-app/APICalls/GetOrgDetails/get-org-info";
import { putOrgInfo } from "apps/business-admin-app/APICalls/UpdateOrgInfo/put-org-info";
import { Doctor, OrgInfo, UpdateOrgInfo } from "apps/business-admin-app/types/doctor";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import BookingCountChart from "./otherComponents/bookingCountChart";
import DoctorSpecialtyChart from "./otherComponents/doctorSpecialityChart";
import OrgProfileCard from "./otherComponents/orgProfileCard";

interface GetStartedSectionComponentForAdminProps {
    session: Session
}

/**
 * 
 * @param prop - session
 * 
 * @returns Get started section for Admin user.
 */
export default function GetStartedSectionComponentForAdmin(props: GetStartedSectionComponentForAdminProps) {

    const { session } = props;
    const [ doctorList, setDoctorList ] = useState<Doctor[] | null>(null);
    const typesToFilter: string[] = [ "cardiology", "neurology", "oncology", "nutrition" ];
    const [ filteredCount, setFilteredCount ] = useState<{ [key: string]: number }>({});
    const [ labels, setLabels ] = useState<string[]>([]); 
    const [ data, setdata ] = useState<number[]>([]);
    const [ edit, setEdit ] = useState(false);
    const [ orgInfo, setOrgInfo ] = useState<OrgInfo | null>(null);
    const [ regNo, setRegNo ] = useState("");
    const [ reload, setReload ] = useState(false);

    async function getDoctorList() {
        const accessToken = session.accessToken;

        getDoctors(accessToken)
            .then((res) => {
                if (res.data instanceof Array) {
                    setDoctorList(res.data);
                    setFilteredCount(filterAndCountDoctorsBySpecialty(res.data, typesToFilter));
                    const bookingCounts = getBookingCountsPerDay(res.data);

                    bookingCounts.forEach((count, date) => {
                        labels.push(date);
                        data.push(count);
                    });
                }
            })
            .catch((e) => {
                // eslint-disable-next-line no-console
                console.log(e);
            });
    }

    async function getOrgDetails() {
        const accessToken = session.accessToken;

        getOrgInfo(accessToken)
            .then((res) => {
                if (res.data) {
                    setOrgInfo(res.data);
                }
            })
            .catch((e) => {
                // eslint-disable-next-line no-console
                console.log(e);
            });
    }

    useEffect(() => {
        getDoctorList();
        getOrgDetails();
    }, [ session ]);

    useEffect(() => {
        setRegNo(orgInfo?.registrationNumber);
    }, [ orgInfo ]);

    const handleSave = async (payload: UpdateOrgInfo) => {
        const accessToken = session.accessToken;
        
        await putOrgInfo(accessToken, payload);
        getOrgDetails();
    };

    const handleCancel = async () => {
        getOrgDetails();
        setReload(true);
        setEdit(false);
        await sleep(20);
        setReload(false);
    };

    return (
        <Container maxWidth="lg" sx={ { mb: 4, mt: 4 } }>
            <Grid container spacing={ 4 }>
                <Grid item xs={ 12 }>
                    <OrgProfileCard
                        orgInfo={ orgInfo }
                        session={ session }
                        onSave={ handleSave }
                        onCancel={ handleCancel }
                    />
                </Grid>

                <Grid item xs={ 12 } md={ 6 }>
                    <DoctorSpecialtyChart
                        filteredCount={ filteredCount }
                        totalDoctors={ doctorList?.length || 0 }
                    />
                </Grid>

                <Grid item xs={ 12 } md={ 6 }>
                    <BookingCountChart labels={ labels } data={ data } />
                </Grid>
            </Grid>
        </Container>
    );
}

function filterAndCountDoctorsBySpecialty(doctors: Doctor[], types: string[]): { [key: string]: number } {
    const filteredCounts: { [key: string]: number } = {};
  
    types.forEach((type) => {
        const filteredBookings = doctors.filter((doctor) => doctor.specialty.toLowerCase() === type);

        filteredCounts[type] = filteredBookings.length;
    });
  
    return filteredCounts;
}

const getBookingCountsPerDay = (doctors: Doctor[]): Map<string, number> => {
    const bookingCountsPerDay = new Map<string, number>();
  
    doctors.forEach((doctor) => {
        doctor.availability.forEach((availability) => {
            availability.timeSlots.forEach((timeSlot) => {
                const bookingCount = timeSlot.availableBookingCount;
                const date = availability.date;
  
                if (bookingCountsPerDay.has(date)) {
                    const currentCount = bookingCountsPerDay.get(date);

                    bookingCountsPerDay.set(date, currentCount + bookingCount);
                } else {
                    bookingCountsPerDay.set(date, bookingCount);
                }
            });
        });
    });
  
    return bookingCountsPerDay;
};

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
