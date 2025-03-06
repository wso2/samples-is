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
import { Doctor } from "apps/business-admin-app/types/doctor";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Stack } from "rsuite";
import DoctorCard from "./doctorCard";
import DoctorOverview from "./doctorOverview";
import styles from "../../../../styles/doctor.module.css";
import AddUserComponent from "../settingsSection/manageUserSection/otherComponents/addUserComponent";

interface ManageDoctorsSectionProps {
    session: Session
}

/**
 * 
 * @param prop - session
 * 
 * @returns The idp interface section.
 */
export default function ManageDoctorsSection(props: ManageDoctorsSectionProps) {

    const { session } = props;
    const [ doctorList, setDoctorList ] = useState<Doctor[] | null>(null);
    const [ isAddDoctorOpen, setIsAddDoctorOpen ] = useState(false);
    const [ isDoctorOverviewOpen, setIsDoctorOverviewOpen ] = useState(false);
    const [ doctor, setDoctor ] = useState<Doctor | null>(null);
    const [ isDoctorEditOpen, setIsDoctorEditOpen ] = useState(false);
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

    useEffect(() => {
        getDoctorList();
    }, [ session, isAddDoctorOpen, isDoctorEditOpen ]);

    useEffect(() => {
        router.replace(router.asPath);
    }, [ isDoctorEditOpen ]);

    const onAddDoctorClick = (): void => {
        setIsAddDoctorOpen(true);
    };

    const closeAddDoctorDialog = (): void => {
        setIsAddDoctorOpen(false);
    };

    const closeDoctorOverviewDialog = (): void => {
        setIsDoctorOverviewOpen(false);
    };

    return (
        <div
            className={ styles.tableMainPanelDivDoc }
        >
            <Stack
                direction="row"
                justifyContent="space-between">
                <Stack direction="column" alignItems="flex-start">
                    <h2>{ "Manage Doctors" }</h2>
                    <p>{ "Manage doctors in the organization" }</p>
                </Stack>
                <Button
                    className={ styles.buttonCircular }
                    onClick={ onAddDoctorClick }
                >
                        Add Doctor
                </Button>
            </Stack>

            {/* <AddDoctorComponent
                session={ session }
                open={ isAddDoctorOpen }
                onClose={ closeAddDoctorDialog } /> */}

            <AddUserComponent
                session={ session }
                open={ isAddDoctorOpen }
                onClose={ closeAddDoctorDialog }
                isDoctor={ true } />

            <div>
                <Grid container spacing={ 2 }>
                    { doctorList && doctorList.map((doctor) => (
                        <Grid
                            item
                            key={ doctor.id }
                            xs={ 4 }
                            sm={ 4 }
                            md={ 4 }
                            onClick={ () => { setIsDoctorOverviewOpen(true); setDoctor(doctor);} }>
                            <DoctorCard session={ session } doctor={ doctor } isDoctorEditOpen={ isDoctorEditOpen } />
                        </Grid>
                    )) }
                </Grid>
            </div>   
            <div>
                <DoctorOverview 
                    session={ session }
                    isOpen={ isDoctorOverviewOpen } 
                    setIsOpen={ setIsDoctorOverviewOpen }
                    doctor={ doctor }
                    isDoctorEditOpen={ isDoctorEditOpen }
                    setIsDoctorEditOpen={ setIsDoctorEditOpen }
                    onClose={ closeDoctorOverviewDialog }
                />
            </div> 

        </div>
    );
}
