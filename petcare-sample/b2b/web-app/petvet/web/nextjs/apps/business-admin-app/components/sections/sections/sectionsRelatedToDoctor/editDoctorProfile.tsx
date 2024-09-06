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
import { putDoctor } from "apps/business-admin-app/APICalls/UpdateDoctor/put-doc";
import { Availability, Doctor, DoctorInfo } from "apps/business-admin-app/types/doctor";
import { Session } from "next-auth";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button, Message, Modal } from "rsuite";
import FileUploadSingle from "./imageUploader";
// eslint-disable-next-line max-len
import female_doc_thumbnail from "../../../../../../libs/business-admin-app/ui/ui-assets/src/lib/images/female-doc-thumbnail.png";
// eslint-disable-next-line max-len
import male_doc_thumbnail from "../../../../../../libs/business-admin-app/ui/ui-assets/src/lib/images/male-doc-thumbnail.png";
import styles from "../../../../styles/doctor.module.css";
import convertTo12HourTime from "../sectionsRelatedToBookings/timeConverter";


interface EditDoctorProfileProps {
    session: Session
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    doctor: Doctor;
    availabilityInfo: Availability[];
    setAvailabilityInfo: React.Dispatch<React.SetStateAction<Availability[]>>;
    url: string;
    setUrl: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * 
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 * 
 * @returns Modal to edit a doctor profile.
 */
export default function EditDoctorProfile(props: EditDoctorProfileProps) {

    const { session, isOpen, setIsOpen, doctor, availabilityInfo, setAvailabilityInfo, url, setUrl } = props;
    const [ stringDate, setStringDate ] = useState("");
    const [ name, setName ] = useState("");
    const [ registrationNo, setRegistrationNo ] = useState("");
    const [ specialty, setSpecialty ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ gender, setGender ] = useState("");
    const [ DoB, setDoB ] = useState("");
    const dateInputRef = useRef(null);
    const [ address, setAddress ] = useState("");
    const [ availableDate, setAvailableDate ] = useState("");
    const [ startTime, setStartTime ] = useState("");
    const [ endTime, setEndTime ] = useState("");
    const [ bookingCount, setBookingCount ] = useState(0);

    const closeEditDoctorDialog = (): void => {
        setIsOpen(false);
    };

    useEffect(() => {
        if(doctor && doctor.createdAt != "") {
            const isoString = doctor.createdAt;
            const date = new Date(isoString);
            const stringDate = date.toLocaleString();

            setStringDate(stringDate);
        }
    }, [ isOpen ]);

    const handleOnAdd = () => {
        if (availableDate && startTime && endTime && bookingCount) {
            const info: Availability = {
                date: availableDate,
                timeSlots: [
                    {
                        availableBookingCount: bookingCount,
                        endTime: endTime,
                        startTime: startTime
                        
                    }
                ]
            };

            setAvailabilityInfo(availabilityInfo => [ ...availabilityInfo, info ]);
            setAvailableDate("");
            setStartTime("");
            setEndTime("");
            setBookingCount(0);
        }
    };

    const handleRemoveAvailabilityDetail = (availability: Availability) => {
        setAvailabilityInfo(oldValues => {
            return oldValues.filter(value => value !== availability);
        });
    };

    const handleSave = () => {
        async function updateDoctor() {
            const accessToken = session.accessToken;
            const docName = (name) ? name : doctor.name;
            const docAddress = (address) ? address : doctor.address;
            const docDoB = (DoB) ? DoB : doctor.dateOfBirth;
            const docEmail = (email) ? email : doctor.emailAddress;
            const docGender = (gender) ? gender : doctor.gender;
            const docRegistrationNo = (registrationNo) ? registrationNo : doctor.registrationNumber;
            const docSpecialty = (specialty) ? specialty : doctor.specialty;

            const payload: DoctorInfo = {
                address: docAddress,
                availability: availabilityInfo,
                dateOfBirth: docDoB,
                emailAddress: docEmail,
                gender: docGender,
                name: docName,
                registrationNumber: docRegistrationNo,
                specialty: docSpecialty
            };

            putDoctor(accessToken, doctor.id, payload);
        }
        updateDoctor();
        setAvailabilityInfo([]);
        setIsOpen(false);
    };

    return (
        <Modal
            backdrop="static"
            role="alertdialog"
            open={ isOpen }
            onClose={ closeEditDoctorDialog }
            size="sm"
            className={ styles.doctorOverviewMainDiv }>

            <Modal.Header >
                <ModelHeaderComponent title="Edit Profile"/>
            </Modal.Header>

            <Modal.Body>
                <div className={ styles.addUserMainDiv }>
                    <div className={ styles.basicInfoDiv }>
                        <Grid container spacing={ 2 }>
                            <Grid item xs={ 6 }>
                                <Typography className="typography-style">
                                    <p className={ styles.docEditFont }>Name</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docEditFont }>Registration Number</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docEditFont }>Specialty</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docEditFont }>Email Address</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docEditFont }>Gender</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docEditFont }>Date of Birth</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docEditFont }>Address</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docEditFont }>Created At</p>
                                </Typography>
                            </Grid>
                            <Grid item xs={ 6 }>
                                <input
                                    className={ styles.docEditInputStyle }
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    defaultValue={ doctor?.name }
                                    onChange={ (e) =>
                                        setName(e.target.value)
                                    }
                                />
                                <input
                                    className={ styles.docEditInputStyle }
                                    id="registration_number"
                                    type="text"
                                    placeholder="Registration Number"
                                    defaultValue={ doctor?.registrationNumber }
                                    onChange={ (e) =>
                                        setRegistrationNo(e.target.value)
                                    }
                                />
                                <input
                                    className={ styles.docEditInputStyle }
                                    id="specialty"
                                    type="text"
                                    placeholder="Specialty"
                                    defaultValue={ doctor?.specialty }
                                    onChange={ (e) =>
                                        setSpecialty(e.target.value)
                                    }
                                />
                                <input
                                    className={ styles.docEditInputStyle }
                                    id="email"
                                    type="email"
                                    placeholder="Email Address"
                                    defaultValue={ doctor?.emailAddress }
                                    onChange={ (e) =>
                                        setEmail(e.target.value)
                                    }
                                />
                                <input
                                    className={ styles.docEditInputStyle }
                                    id="gender"
                                    type="text"
                                    placeholder="Gender"
                                    defaultValue={ doctor?.gender }
                                    onChange={ (e) =>
                                        setGender(e.target.value)
                                    }
                                />
                                <input
                                    className={ styles.docEditInputStyle }
                                    id="DoB"
                                    type="date"
                                    ref={ dateInputRef }
                                    placeholder="DoB"
                                    defaultValue={ doctor?.dateOfBirth }
                                    onChange={ (e) => setDoB(e.target.value) }
                                />
                                <input
                                    className={ styles.docEditInputStyle }
                                    id="address"
                                    type="text"
                                    placeholder="Address"
                                    defaultValue={ doctor?.address }
                                    onChange={ (e) =>
                                        setAddress(e.target.value)
                                    }
                                />
                                <input
                                    className={ styles.docEditInputStyle }
                                    id="createdAt"
                                    type="text"
                                    placeholder="Created At"
                                    defaultValue={ stringDate }
                                    disabled={ true }
                                />
                            </Grid>
                        </Grid>

                    </div>
                    <br/>
                    <div className={ styles.availabilityHeaderInProfileEdit }>
                        Availability Information
                    </div>
                    <br /><br />
                    <Message className={ styles.infoDiv } showIcon type="info">
                        Choose an available date, start time, end time and booking count respectively.
                    </Message>
                    <div className={ styles.availabilityInfoGridInEditView }>
                        <input
                            className={ styles.availabilityInputStyle }
                            id="available_date"
                            type="date"
                            ref={ dateInputRef }
                            placeholder="Available Date"
                            onChange={ (e) => {
                                setAvailableDate(e.target.value);
                            } }
                            value={ availableDate }
                        />
                        <input
                            className={ styles.availabilityInputStyle }
                            id="start_time"
                            type="time"
                            ref={ dateInputRef }
                            placeholder="Start Time"
                            onChange={ (e) => {
                                setStartTime(e.target.value);
                            } }
                            value={ startTime }
                        />
                        <input
                            className={ styles.availabilityInputStyle }
                            id="end_time"
                            type="time"
                            ref={ dateInputRef }
                            placeholder="End Time"
                            onChange={ (e) => {
                                setEndTime(e.target.value);
                            } }
                            value={ endTime }
                        />

                        <input
                            className={ styles.availabilityInputStyle }
                            id="booking_count"
                            type="number"
                            placeholder="Booking Count"
                            onChange={ (e) => {
                                setBookingCount(e.target.valueAsNumber);
                            } }
                            value={ bookingCount }
                        />

                        <Button 
                            style={ {
                                border: "none",
                                borderRadius: "1vh",
                                color: "white",
                                fontSize: "2vh",
                                fontWeight: "bolder",
                                height: "5vh",
                                padding: "5px",
                                width: "5vh"
                            } }
                            appearance="primary"
                            onClick={ (e) => { e.preventDefault(); handleOnAdd(); } }>
                                +
                        </Button>

                    </div>
                    <br/>
                    { availabilityInfo?.length > 0 && (
                        <div className={ styles.availabilityInfoResultTableInEdit }>
                            <div>
                                <Table aria-label="simple table" style={ { width: "40vw" } }>
                                    <TableHead >
                                        <TableRow >
                                            <TableCell
                                                align="center" 
                                                style={ { fontSize: "1.7vh", fontWeight: "bold", 
                                                    padding: "1vh", height: "1vh" } }>Available Date</TableCell>
                                            <TableCell
                                                align="center" 
                                                style={ { fontSize: "1.7vh", fontWeight: "bold", 
                                                    padding: "1vh", height: "1vh" } }>Start Time</TableCell>
                                            <TableCell
                                                align="center" 
                                                style={ { fontSize: "1.7vh", fontWeight: "bold", 
                                                    padding: "1vh", height: "1vh" } }>End Time</TableCell>
                                            <TableCell
                                                align="center" 
                                                style={ { fontSize: "1.7vh", fontWeight: "bold", 
                                                    padding: "1vh", height: "1vh" } }>Booking Count</TableCell>
                                            <TableCell
                                                align="center" 
                                                style={ { fontSize: "1.7vh", fontWeight: "bold", 
                                                    padding: "1vh", height: "1vh" } }>Delete Record</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        { availabilityInfo && availabilityInfo.length > 0 
                                        && availabilityInfo.map((availability) => (
                                            <TableRow key={ availability.date }>
                                                <TableCell
                                                    align="center" 
                                                    style={ { fontSize: "1.7vh", padding: "1vh" } }>
                                                    { availability.date }</TableCell>
                                                <TableCell
                                                    align="center" 
                                                    style={ { fontSize: "1.7vh", padding: "1vh" } }>
                                                    { convertTo12HourTime(availability.timeSlots[0].startTime) }
                                                </TableCell>
                                                <TableCell
                                                    align="center" 
                                                    style={ { fontSize: "1.7vh", padding: "1vh" } }>
                                                    { convertTo12HourTime(availability.timeSlots[0].endTime) }
                                                </TableCell>
                                                <TableCell
                                                    align="center" 
                                                    style={ { fontSize: "1.7vh", padding: "1vh" } }>
                                                    { availability.timeSlots[0].availableBookingCount }</TableCell>
                                                <TableCell
                                                    align="center" 
                                                    style={ { fontSize: 10, padding: 1 } }>
                                                    <button
                                                        className={ styles.removeBtn }
                                                        onClick={ (e) => { e.preventDefault(); 
                                                            handleRemoveAvailabilityDetail(availability); } }>
                                                        x</button></TableCell>
                                            </TableRow>
                                        )) }
                                    </TableBody>
                                </Table>
                                <br/>
                            </div>
                        </div>
                    ) }
                    <br />
                    <div className={ styles.docImageStyle }>
                        { url? (
                            <Image 
                                style={ { borderRadius: "10%", height: "100%",  width: "100%" } }
                                src={ url }
                                alt="doc-thumbnail"
                                width={ 10 }
                                height={ 10 }
                            />
                        ): (
                            <Image
                                style={ { borderRadius: "10%", height: "100%",  width: "100%" } }
                                src={ 
                                    doctor?.gender?.toLowerCase() === "male" ? 
                                        male_doc_thumbnail : male_doc_thumbnail }
                                alt="doc-thumbnail"
                            />

                        ) } 
                    </div>
                    <div className={ styles.updateDocImageDiv }>
                        Update Doctor Image
                    </div>
                    <FileUploadSingle  
                        session={ session }
                        doctorId={ doctor?.id } 
                        imageUrl={ url } 
                        setImageUrl={ setUrl } />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={ handleSave } appearance="primary">
                  Save
                </Button>
                <Button  onClick={ closeEditDoctorDialog } appearance="subtle">
                  Cancel
                </Button>
            </Modal.Footer>
        </Modal>

    );
}

