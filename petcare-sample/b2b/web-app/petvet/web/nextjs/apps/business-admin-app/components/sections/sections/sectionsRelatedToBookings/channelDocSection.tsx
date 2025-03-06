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
import { getDoctors } from "apps/business-admin-app/APICalls/getDoctors/get-doctors";
import { getPets } from "apps/business-admin-app/APICalls/getPetList/get-pets";
import { Doctor } from "apps/business-admin-app/types/doctor";
import { Pet } from "apps/business-admin-app/types/pets";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Stack } from "rsuite";
import AddBookings from "./addBooking";
import styles from "../../../../styles/doctor.module.css";
import DoctorCard from "../sectionsRelatedToDoctor/doctorCard";

interface ChannelDoctorSectionProps {
    session: Session
}

/**
 * 
 * @param prop - session
 * 
 * @returns The idp interface section.
 */
export default function ChannelDoctorSection(props: ChannelDoctorSectionProps) {

    const { session } = props;
    const [ doctorList, setDoctorList ] = useState<Doctor[] | null>(null);
    const [ isAddDoctorOpen, setIsAddDoctorOpen ] = useState(false);
    const [ doctor, setDoctor ] = useState<Doctor | null>(null);
    const [ isDoctorEditOpen, setIsDoctorEditOpen ] = useState(false);
    const [ isAddBookingOpen, setIsAddBookingOpen ] = useState(false);
    const [ petList, setPetList ] = useState<Pet[] | null>(null);
    const router = useRouter();


    async function getDoctorList() {
        const accessToken = session.accessToken;

        getDoctors(accessToken)
            .then((res) => {
                if (res.data instanceof Array) {
                    setDoctorList(res.data);
                }
            })
            .catch((e) => {
                // eslint-disable-next-line no-console
                console.log(e);
            });
    }

    async function getPetList() {
        const accessToken = session.accessToken;

        getPets(accessToken)
            .then((res) => {
                if (res.data instanceof Array) {
                    setPetList(res.data);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    useEffect(() => {
        getDoctorList();
        getPetList();
    }, [ session, isAddDoctorOpen, isDoctorEditOpen ]);

    useEffect(() => {
        router.replace(router.asPath);
    }, [ isDoctorEditOpen ]);

    return (
        <div
            className={ styles.tableMainPanelDivDoc }
        >
            <Stack
                direction="row"
                justifyContent="space-between">
                <Stack direction="column" alignItems="flex-start">
                    <h2>{ "Channel Doctor" }</h2>
                    <p>{ "Choose a doctor to channel" }</p>
                </Stack>
            </Stack>
            <div>
                <Grid container spacing={ 2 }>
                    { doctorList && doctorList.map((doctor) => (
                        <Grid
                            item
                            xs={ 4 }
                            sm={ 4 }
                            md={ 4 }
                            key={ doctor.id }
                            onClick={ () => { setDoctor(doctor); setIsAddBookingOpen(true); } }>
                            <DoctorCard session={ session } doctor={ doctor } isDoctorEditOpen={ false } />
                        </Grid>
                    )) }
                </Grid>
            </div>
            <div>
                <AddBookings 
                    session={ session }
                    isOpen={ isAddBookingOpen } 
                    setIsOpen={ setIsAddBookingOpen } 
                    doctor={ doctor }
                    petList={ petList } />
            </div>
        </div>
    );
}
