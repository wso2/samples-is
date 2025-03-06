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

import { Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } 
    from "@mui/material";
import { ModelHeaderComponent } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { getDocThumbnail } from "apps/business-admin-app/APICalls/GetDocThumbnail/get-doc-thumbnail";
import { Availability, Doctor } from "apps/business-admin-app/types/doctor";
import axios, { AxiosError } from "axios";
import { Session } from "next-auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Button, Modal } from "rsuite";
import EditDoctor from "./editDoctor";
import female_doc_thumbnail 
    from "../../../../../../libs/business-admin-app/ui/ui-assets/src/lib/images/female-doc-thumbnail.png";
import male_doc_thumbnail 
    from "../../../../../../libs/business-admin-app/ui/ui-assets/src/lib/images/male-doc-thumbnail.png";
import styles from "../../../../styles/doctor.module.css";
import convertTo12HourTime from "../sectionsRelatedToBookings/timeConverter";


interface DoctorOverviewProps {
    session: Session
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    doctor: Doctor;
    isDoctorEditOpen: boolean;
    setIsDoctorEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onClose: () => void
}

/**
 * 
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 * 
 * @returns Modal to add a doctor.
 */
export default function DoctorOverview(props: DoctorOverviewProps) {

    const { session, isOpen, setIsOpen, doctor, isDoctorEditOpen, setIsDoctorEditOpen, onClose } = props;
    const [ stringDate, setStringDate ] = useState("");
    const [ url, setUrl ] = useState("");
    const [ availabilityInfo, setAvailabilityInfo ] = useState<Availability[] | null>([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ isImageNotFound, setIsImageNotFound ] = useState(false);

    async function getThumbnails() {
        const accessToken = session.accessToken;

        if (doctor) {
            getDocThumbnail(accessToken, doctor.id)
                .then((res) => {
                    if (res.data.size > 0) {
                        const imageUrl = URL.createObjectURL(res.data);

                        setIsImageNotFound(false);
                        setUrl(imageUrl);
                    }
                })
                .catch((error) => {
                    if (axios.isAxiosError(error)) {
                        const axiosError = error as AxiosError;

                        if (axiosError.response?.status === 404) {
                        // eslint-disable-next-line no-console
                            console.log("Resource not found");
                            setIsImageNotFound(true);
                        } else {
                        // eslint-disable-next-line no-console
                            console.log("An error occurred:", axiosError.message);
                        }
                    } else {
                    // eslint-disable-next-line no-console
                        console.log("An error occurred:", error);
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }


    }

    useEffect(() => {
        setUrl ("");
        setIsLoading(true);
        getThumbnails();
        if(doctor && doctor.createdAt != "") {
            const isoString = doctor.createdAt;
            const date = new Date(isoString);
            const stringDate = date.toLocaleString();

            setStringDate(stringDate);
        }
    }, [ isOpen ]);

    const handleEdit = () => {
        setIsOpen(false);
        setIsDoctorEditOpen(true);
        if (doctor.availability.length > 0) {
            setAvailabilityInfo(doctor.availability);
        }
    };

   

    return (
        <><Modal
            backdrop="static"
            role="alertdialog"
            open={ isOpen }
            onClose={ onClose }
            size="sm"
            className={ styles.doctorOverviewMainDiv }>

            <Modal.Header>
                <ModelHeaderComponent title="Doctor Overview" />
            </Modal.Header>

            <Modal.Body>
                <div className={ styles.addUserMainDiv }>
                    <div className={ styles.basicInfoDiv }>
                        <Grid container spacing={ 2 }>
                            <Grid item xs={ 6 }>
                                <Typography className="typography-style">
                                    <p className={ styles.docOverviewFont }>Name</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docOverviewFont }>Registration Number</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docOverviewFont }>Specialty</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docOverviewFont }>Email Address</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docOverviewFont }>Gender</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docOverviewFont }>Date of Birth</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docOverviewFont }>Address</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docOverviewFont }>Created At</p>
                                </Typography>
                            </Grid>
                            <Grid item xs={ 6 }>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docOverviewFont }>{ doctor?.name }</p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docOverviewFont }>{ doctor?.registrationNumber }</p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docOverviewFont }>
                                        { doctor?.specialty ? doctor.specialty : "N/A" }
                                    </p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docOverviewFont }>{ doctor?.emailAddress }</p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docOverviewFont }>
                                        { doctor?.gender ? doctor.gender : "N/A" }
                                    </p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docOverviewFont }>
                                        { doctor?.dateOfBirth ? doctor.dateOfBirth : "N/A" }
                                    </p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docOverviewFont }>
                                        { doctor?.address ? doctor.address : "N/A" }
                                    </p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docOverviewFont }>{ stringDate }</p>
                                </Typography>
                            </Grid>
                        </Grid>
                    </div>
                    <br />
                    <div className={ styles.availabilityHeaderInOverview }>
                        Availability Information
                    </div>
                    <br/>
                    <div className={ styles.availabilityInfoDivInOverview }>
                        { doctor?.availability.length > 0 ? (
                            <div>
                                <Table aria-label="simple table" style={ { width: "40vw" } }>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                align="center"
                                                style={ {
                                                    fontSize: "1.7vh", fontWeight: "bold",
                                                    color: "rgb(105, 105, 105)"
                                                } }>
                                                Date</TableCell>
                                            <TableCell
                                                align="center"
                                                style={ {
                                                    fontSize: "1.7vh", fontWeight: "bold",
                                                    color: "rgb(105, 105, 105)"
                                                } }>
                                                Start Time
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                style={ {
                                                    fontSize: "1.7vh", fontWeight: "bold",
                                                    color: "rgb(105, 105, 105)"
                                                } }>End Time</TableCell>
                                            <TableCell
                                                align="center"
                                                style={ {
                                                    fontSize: "1.7vh", fontWeight: "bold",
                                                    color: "rgb(105, 105, 105)"
                                                } }>Booking Count</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        { doctor.availability.map((availability) => (
                                            <TableRow key={ availability.date }>
                                                <TableCell
                                                    align="center"
                                                    style={ { fontSize: "1.7vh", padding: 1 } }>
                                                    { availability.date }</TableCell>
                                                <TableCell
                                                    align="center"
                                                    style={ { fontSize: "1.7vh", padding: 1 } }>
                                                    { convertTo12HourTime(availability.timeSlots[0].startTime) }
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    style={ { fontSize: "1.7vh", padding: 1 } }>
                                                    { convertTo12HourTime(availability.timeSlots[0].endTime) }
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    style={ { fontSize: "1.7vh", padding: 1 } }>
                                                    { availability.timeSlots[0].availableBookingCount }</TableCell>
                                            </TableRow>
                                        )) }
                                    </TableBody>
                                </Table>
                                <br/>
                            </div>
                        ) : (
                            <div className={ styles.noAvailabilityInfoDiv }>
                                Your availability information is not provided.
                            </div>
                        ) }
                    </div>
                    <br /><br />
                    { isLoading ? (
                        <div className={ styles.docImageStyle }>
                            <TailSpin color="var(--primary-color)" height={ 100 } width={ 100 } />
                        </div>
                    ) : (
                        <div className={ styles.docImageStyle }>
                            { url ? (
                                <Image
                                    style={ { borderRadius: "10%", height: "100%", width: "100%" } }
                                    src={ url }
                                    alt="doc-thumbnail" 
                                    width={ 10 }
                                    height={ 10 }
                                />
                            ) : (
                                <Image
                                    style={ { borderRadius: "10%", height: "100%", width: "100%" } }
                                    src={ doctor?.gender?.toLowerCase() === "male" ?
                                        male_doc_thumbnail : male_doc_thumbnail }
                                    alt="doc-thumbnail" />

                            ) }
                        </div> 
                    ) }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={ handleEdit } appearance="primary">
                    Edit
                </Button>
                <Button onClick={ onClose } appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
        <div>
            <EditDoctor
                session={ session }
                isOpen={ isDoctorEditOpen }
                setIsOpen={ setIsDoctorEditOpen }
                doctor={ doctor }
                availabilityInfo={ availabilityInfo }
                setAvailabilityInfo={ setAvailabilityInfo }
                url={ url }
                setUrl={ setUrl }
                isImageNotFound = { isImageNotFound } />
        </div>
        </>
    );
}

