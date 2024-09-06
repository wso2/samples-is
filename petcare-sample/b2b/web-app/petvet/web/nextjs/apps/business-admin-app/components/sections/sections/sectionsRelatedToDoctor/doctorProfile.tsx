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

import { Grid, Typography } from "@mui/material";
import { getDocThumbnail } from "apps/business-admin-app/APICalls/GetDocThumbnail/get-doc-thumbnail";
import { getProfile } from "apps/business-admin-app/APICalls/GetProfileInfo/me";
import { Availability, Doctor } from "apps/business-admin-app/types/doctor";
import { Session } from "next-auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Stack } from "rsuite";
import EditDoctorProfile from "./editDoctorProfile";
import female_doc_thumbnail 
    from "../../../../../../libs/business-admin-app/ui/ui-assets/src/lib/images/female-doc-thumbnail.png";
import male_doc_thumbnail 
    from "../../../../../../libs/business-admin-app/ui/ui-assets/src/lib/images/male-doc-thumbnail.png";
import styles from "../../../../styles/doctor.module.css";


interface DoctorProfileSectionProps {
    session: Session
}

/**
 * 
 * @param prop - session
 * 
 * @returns The idp interface section.
 */
export default function DoctorProfileSection(props: DoctorProfileSectionProps) {

    const { session } = props;
    const [ doctor, setDoctor ] = useState<Doctor | null>(null);
    const [ url, setUrl ] = useState("");
    const [ isEditProfileOpen, setIsEditProfileOpen ] = useState(false);
    const [ availabilityInfo, setAvailabilityInfo ] = useState<Availability[] | null>([]);
    const [ stringDate, setStringDate ] = useState("");

    async function getProfileInfo() {
        const accessToken = session.accessToken;

        getProfile(accessToken)
            .then(async (res) => {
                if (res.data) {
                    setDoctor(res.data);
                    const date = new Date(res.data.createdAt);
                    const stringDate = date.toLocaleString();

                    setStringDate(stringDate);
                }
                const response = await getDocThumbnail(accessToken, res.data.id);

                if (response.data.size > 0) {
                    const imageUrl = URL.createObjectURL(response.data);

                    setUrl(imageUrl);
                }
            })
            .catch((e) => {
                // eslint-disable-next-line no-console
                // TODO: handle error
            });
    }

    useEffect(() => {
        getProfileInfo();
    }, [ session, isEditProfileOpen ]);

    const onEditProfileClick = (): void => {
        setIsEditProfileOpen(true);
        if(doctor?.availability) {
            setAvailabilityInfo(doctor?.availability);
        } else {
            setAvailabilityInfo([]);
        }
    };
      
    return (
        <><div
            className={ styles.tableMainPanelDivDoc }
        >
            <Stack
                direction="row"
                justifyContent="space-between">
                <Stack direction="column" alignItems="flex-start">
                    <h2>{ "Profile" }</h2>
                    <p>{ "Profile Information of the doctor" }</p>
                </Stack>
                <Button
                    className={ styles.buttonCircular }
                    appearance="primary"
                    size="lg"
                    onClick={ onEditProfileClick }
                >
                    Edit Profile
                </Button>
            </Stack>
            { doctor && (
                <>
                    <div className={ styles.doctorProfilePic }>
                        { url ? (
                            <Image
                                style={ { borderRadius: "10%", height: "100%", width: "100%" } }
                                src={ url }
                                alt="doc-thumbnail"
                                width={ 10 }
                                height={ 10 } />
                        ) : (
                            <Image
                                style={ { borderRadius: "10%", height: "100%", width: "100%" } }
                                src={ doctor?.gender?.toLowerCase() === "male" ?
                                    male_doc_thumbnail : male_doc_thumbnail }
                                alt="doc-thumbnail" />

                        ) }
                    </div>
                    <div className={ styles.docProfileInfoDiv }>
                        <Grid container spacing={ 2 }>
                            <Grid item xs={ 6 }>
                                <Typography className="typography-style">
                                    <p className={ styles.docProfileFont }>Name</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docProfileFont }>Registration Number</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docProfileFont }>Specialty</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docProfileFont }>Email Address</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docProfileFont }>Gender</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docProfileFont }>Date of Birth</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docProfileFont }>Address</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docProfileFont }>Created At</p>
                                </Typography>
                            </Grid>
                            <Grid item xs={ 6 }>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docProfileFont }>{ doctor?.name }</p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docProfileFont }>{ doctor?.registrationNumber }</p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docProfileFont }>
                                        { doctor?.specialty? doctor.specialty : "N/A" }
                                    </p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docProfileFont }>{ doctor?.emailAddress }</p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docProfileFont }>
                                        { doctor?.gender? doctor.gender : "N/A" }
                                    </p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docProfileFont }>
                                        { doctor?.dateOfBirth? doctor.dateOfBirth : "N/A" }
                                    </p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docProfileFont }>
                                        { doctor?.address? doctor.address : "N/A" }
                                    </p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docProfileFont }>{ stringDate }</p>
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                </>
            ) }


        </div><div>
            <EditDoctorProfile
                session={ session }
                isOpen={ isEditProfileOpen }
                setIsOpen={ setIsEditProfileOpen }
                doctor={ doctor }
                availabilityInfo={ availabilityInfo }
                setAvailabilityInfo={ setAvailabilityInfo }
                url={ url }
                setUrl={ setUrl } />
        </div></>
    );
}
