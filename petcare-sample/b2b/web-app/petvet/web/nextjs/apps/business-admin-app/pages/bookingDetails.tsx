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

import { Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Message, Stack } from "rsuite";
import PET_IMAGE from "../../../libs/business-admin-app/ui/ui-assets/src/lib/images/thumbnail.png";
import { getMedicalReport } from "../APICalls/GetMedicalReports/get-medical-reports";
import { getPet } from "../APICalls/GetPet/get-pet";
import { getThumbnail } from "../APICalls/GetThumbnail/get-thumbnail";
import { updateBooking } from "../APICalls/UpdateBooking/put-booking";
import dateConverter from "../components/sections/sections/sectionsRelatedToBookings/dateConverter";
import convertTo12HourTime from "../components/sections/sections/sectionsRelatedToBookings/timeConverter";
import AddMedicalReportComponent from "../components/sections/sections/sectionsRelatedToDoctor/addMedicalReport";
import MedicalReportOverview from "../components/sections/sections/sectionsRelatedToDoctor/medicalReportOverview";
import styles from "../styles/booking.module.css";
import { CompleteBooking } from "../types/booking";
import { MedicalReport, Pet } from "../types/pets";


/**
 * 
 * @returns Booking Details Page of a Doctor
 */
export default function BookingDetails() {

    const router = useRouter();
    const { token, 
        appointmentNumber, 
        date, 
        doctorId,
        emailAddress,
        id,
        mobileNumber,
        petId,
        petOwnerName,
        sessionEndTime,
        sessionStartTime,
        status,
        orgId
    } = router.query;
    const [ pet, setPet ] = useState<Pet | null>(null);
    const [ url, setUrl ] = useState("");
    const [ medicalReport, setMedicalReport ] = useState<MedicalReport | null>(null);
    const [ medicalReportList, setMedicalReportList ] = useState<MedicalReport[] | null>(null);
    const [ isAddMedicalReportOpen, setIsAddMedicalReportOpen ] = useState(false);
    const [ isMedicalReportOverviewOpen, setIsMedicalReportOverviewOpen ] = useState(false);
    const [ isMedicalReportEditOpen, setIsMedicalReportEditOpen ] = useState(false);
    const [ bookingStatus, setBookingStatus ] = useState("Confirmed");

    const handleGoBack = () => {
        router.back();
    };

    async function getPetInfo() {
        const accessToken = token;

        if(typeof accessToken === "string" && typeof petId === "string" ) {
            getPet(accessToken, petId)
                .then(async (res) => {
                    if (res.data) {
                        setPet(res.data);
                        const response = await getThumbnail(accessToken, res.data.id, "", "");

                        if (response.data.size > 0) {
                            const imageUrl = URL.createObjectURL(response.data);

                            setUrl(imageUrl);
                        }
                    }
                })
                .catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log(e);
                });

        }
    }

    async function getMedicalReportInfo() {
        const accessToken = token;

        if(typeof accessToken === "string" && typeof petId === "string" ) {
            getMedicalReport(accessToken, petId)
                .then(async (res) => {
                    if (res.data instanceof Array) {
                        setMedicalReportList(res.data);
                    }
                })
                .catch((e) => {
                    // eslint-disable-next-line no-console
                    console.log(e);
                });
        }
    }

    useEffect(() => {
        getPetInfo();
        getMedicalReportInfo();
    }, [ ]);

    useEffect(() => {
        getMedicalReportInfo();
    }, [ isMedicalReportEditOpen ]);

    useEffect(() => {
        getMedicalReportInfo();
    }, [ isAddMedicalReportOpen ]);

    const handleRowClick = (report: MedicalReport) => {
        setIsMedicalReportOverviewOpen(true);
        setMedicalReport(report);
    };

    const handleComplete = async () => {
        async function updateBookingInfo() {
            const accessToken = token?.toString();
            const payload: CompleteBooking = {
                date: date?.toString(),
                doctorId: doctorId?.toString(),
                email: emailAddress?.toString(),
                mobileNumber: mobileNumber?.toString(),
                petDoB: pet?.dateOfBirth,
                petId: petId?.toString(),
                petName: pet?.name,
                petOwnerName: petOwnerName?.toString(),
                petType: pet?.breed,
                sessionEndTime: sessionEndTime?.toString(),
                sessionStartTime: sessionStartTime?.toString(),
                status: "Completed"
            };
            const response = await updateBooking(accessToken, orgId?.toString(), id?.toString(), payload);
        }
        updateBookingInfo();
        setBookingStatus("Completed");
    };

    return (
        <><div
            className={ styles.bookingDetailsMainDiv }
        >
            <div className={ styles.bookingDetailHeader }>
                <Stack
                    direction="row"
                    justifyContent="space-between">
                    <Stack direction="column" alignItems="flex-start">
                        <h2>{ "Booking Details" }</h2>
                        <p>{ "Available Bookings for the doctor" }</p>
                    </Stack>
                    { (status !== "Completed" && bookingStatus !== "Completed") && (
                        <Button
                            appearance="primary"
                            size="lg"
                            onClick={ handleComplete }
                        >
                        Complete this booking
                        </Button>
                    ) }
                </Stack>
            </div>
            <button className={ styles.backBtn } onClick={ handleGoBack }>
                { "< Back" }
                { /* <DashboardIcon/> */ }
            </button>
            <div className={ styles.bookingInfoDiv }>
                <div className={ styles.bookingInfoDivHeader }>
                    Booking Details
                </div>
                <div className={ styles.bokingDetailGridItemInfo }>
                    <Grid container spacing={ 2 }>
                        <Grid item xs={ 6 } sm={ 6 } md={ 6 }>
                            <Typography>
                                <p className={ styles.bookingDetailFont }>Appointment No</p>
                            </Typography>
                            <Typography>
                                <p className={ styles.bookingDetailFont }>Date</p>
                            </Typography>
                            <Typography>
                                <p className={ styles.bookingDetailFont }>Mobile Number</p>
                            </Typography>
                            <Typography>
                                <p className={ styles.bookingDetailFont }>Email Address</p>
                            </Typography>
                            <Typography>
                                <p className={ styles.bookingDetailFont }>Session Start Time</p>
                            </Typography>
                            <Typography>
                                <p className={ styles.bookingDetailFont }>Session End Time</p>
                            </Typography>
                            <Typography>
                                <p className={ styles.bookingDetailFont }>Status</p>
                            </Typography>
                        </Grid>
                        <Grid item xs={ 6 } sm={ 6 } md={ 6 }>
                            <Typography>
                                <p className={ styles.bookingDetailFont }>
                                    { appointmentNumber === "" ? " - " : appointmentNumber }</p>
                            </Typography>
                            <Typography>
                                <p className={ styles.bookingDetailFont }>{ date === "" ? " - " : date }</p>
                            </Typography>
                            <Typography>
                                <p className={ styles.bookingDetailFont }>
                                    { mobileNumber === "" ? " - " : mobileNumber }</p>
                            </Typography>
                            <Typography>
                                <p className={ styles.bookingDetailFont }>
                                    { emailAddress === "" ? " - " : emailAddress }</p>
                            </Typography>
                            <Typography>
                                <p className={ styles.bookingDetailFont }>
                                    { sessionStartTime === "" ? " - " : 
                                        convertTo12HourTime(sessionStartTime?.toString()) }
                                </p>
                            </Typography>
                            <Typography>
                                <p className={ styles.bookingDetailFont }>
                                    { sessionEndTime === "" ? " - " : 
                                        convertTo12HourTime(sessionEndTime?.toString()) }</p>
                            </Typography>
                            <Typography>
                                <p
                                    className={ (bookingStatus === "Completed" || status === "Completed") ?
                                        styles.bookingDetailFontSec : styles.bookingDetailFont }>
                                    { (bookingStatus === "Completed" || status === "Completed")?
                                        "Completed":"Confirmed" }
                                </p>
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </div>
            <div className={ styles.petInfoDiv }>
                <div className={ styles.petInfoHeader }>
                    Pet Details
                </div>
                <div className={ styles.petImageInBookingDetails }>
                    { url ? (
                        <Image
                            style={ { borderRadius: "10%", height: "100%", width: "100%" } }
                            src={ url }
                            alt="pet-thumbnail"
                            width={ 10 }
                            height={ 10 } />
                    ) : (
                        <Image
                            style={ { borderRadius: "10%", height: "100%", width: "100%" } }
                            src={ PET_IMAGE }
                            alt="pet-thumbnail" />
                    ) }
                </div>
                <div className={ styles.petInfoBasicDetails }>
                    { pet && (
                        <Grid container spacing={ 2 }>
                            <Grid item xs={ 6 } sm={ 6 } md={ 6 } key={ "item.headers" }>
                                <Typography>
                                    <p className={ styles.bookingDetailFont }>Name</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingDetailFont }>Breed</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingDetailFont }>Date of Birth</p>
                                </Typography>
                            </Grid>
                            <Grid item xs={ 6 } sm={ 6 } md={ 6 } key={ "item.info" }>
                                <Typography>
                                    <p className={ styles.bookingDetailFont }>{ pet.name }</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingDetailFont }>{ pet.breed }</p>
                                </Typography>
                                <Typography>
                                    <p className={ styles.bookingDetailFont }>{ pet.dateOfBirth }</p>
                                </Typography>
                            </Grid>
                        </Grid>
                    ) }

                </div>
            </div>
            <div className={ styles.vaccInfoDivHeader }>
                Vaccination Details
            </div>
            <div className={ styles.vaccInfoDiv }>
                { pet && pet.vaccinations && pet.vaccinations.length > 0 ? (
                    <div className={ styles.vaccineInfoBoxInBookingDetail }>
                        <div>
                            <Table aria-label="simple table" style={ { width: "43vw" } }>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" style={ { fontSize: "1.7vh", fontWeight: "bold" } }>
                                            Vaccine Name</TableCell>
                                        <TableCell align="center" style={ { fontSize: "1.7vh", fontWeight: "bold" } }>
                                            Last vaccination Date</TableCell>
                                        <TableCell align="center" style={ { fontSize: "1.7vh", fontWeight: "bold" } }>
                                            Next Vaccination Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    { pet.vaccinations.map((vaccine) => (
                                        <TableRow key={ vaccine.name }>
                                            <TableCell align="center" style={ { fontSize: "1.7vh", padding: 1 } }>
                                                { vaccine.name }</TableCell>
                                            <TableCell align="center" style={ { fontSize: "1.7vh", padding: 1 } }>
                                                { vaccine.lastVaccinationDate }</TableCell>
                                            <TableCell align="center" style={ { fontSize: "1.7vh", padding: 1 } }>
                                                { vaccine.nextVaccinationDate }</TableCell>
                                        </TableRow>
                                    )) }
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ) : (
                    <div className={ styles.noVaccDetailsLabel }>
                        <label className={ styles.noDetailLabel }>
                            The vaccination details are currently unavailable.</label>
                    </div>
                ) }
            </div>
            <div className={ styles.medicalReportDivHeader }>
                Medical Reports
            </div>
            <div className={ styles.medicalReportInfoDivHeader }>
                <Message className={ styles.medicalReportInfolabel } showIcon type="info">
                        Click a table row to view the full medical report.
                </Message>
            </div>
            <div className={ styles.medicalReportDiv }>
                { medicalReportList && medicalReportList.length > 0 ? (
                    <div className={ styles.vaccineInfoBoxInBookingDetail }>
                        <div>
                            <Table aria-label="simple table" style={ { width: "43vw" } }>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" style={ { fontSize: "1.7vh", fontWeight: "bold" } }>
                                            Date</TableCell>
                                        <TableCell align="center" style={ { fontSize: "1.7vh", fontWeight: "bold" } }>
                                            Diagnosis</TableCell>
                                        <TableCell align="center" style={ { fontSize: "1.7vh", fontWeight: "bold" } }>
                                            Treatment</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    { medicalReportList.map((report) => (
                                        <TableRow
                                            key={ report.diagnosis } 
                                            onClick={ () => {handleRowClick(report);} }
                                            className={ styles.medicalReportRow }
                                        >
                                            <TableCell
                                                align="center"
                                                style={ { fontSize: "1.7vh", padding: 1 } }>
                                                { dateConverter(report.createdAt) }
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                style={ { fontSize: "1.7vh", padding: 1 } }>
                                                { report.diagnosis }
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                style={ { fontSize: "1.7vh", padding: 1 } }>
                                                { report.treatment }
                                            </TableCell>
                                        </TableRow>
                                    )) }
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ) : (
                    <div className={ styles.noMedicalReportsLabel }>
                        The medical reports are currently unavailable.
                    </div>
                ) }
            </div>
            <div className={ styles.addMedicalReportBtnDiv }>
                <button className={ styles.addReportBtn } onClick={ () => { setIsAddMedicalReportOpen(true); } }>
                    { "+ Add" }
                </button>
            </div>
        </div><div>
            <AddMedicalReportComponent 
                token={ token?.toString() }
                petId={ petId?.toString() }
                open={ isAddMedicalReportOpen }
                setIsOpen= { setIsAddMedicalReportOpen }
            />
        </div>
        <div>
            <MedicalReportOverview
                token={ token?.toString() }
                petId={ petId?.toString() }
                medicalReport={ medicalReport }
                setMedicalReport={ setMedicalReport }
                medicalReportList={ medicalReportList }
                setMedicalReportList={ setMedicalReportList }
                isOpen={ isMedicalReportOverviewOpen }
                setIsOpen={ setIsMedicalReportOverviewOpen }
                isEditOpen={ isMedicalReportEditOpen }
                setIsEditOpen={ setIsMedicalReportEditOpen }
            />
        </div>
        </>
    );
}

