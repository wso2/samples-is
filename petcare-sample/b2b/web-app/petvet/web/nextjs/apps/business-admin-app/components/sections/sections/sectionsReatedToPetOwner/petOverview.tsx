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

import { Checkbox, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } 
    from "@mui/material";
import { ModelHeaderComponent } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { deletePet } from "apps/business-admin-app/APICalls/DeletePet/delete-pet";
import { getMedicalReport } from "apps/business-admin-app/APICalls/GetMedicalReports/get-medical-reports";
import { getThumbnail } from "apps/business-admin-app/APICalls/GetThumbnail/get-thumbnail";
import { MedicalReport, Pet } from "apps/business-admin-app/types/pets";
import axios, { AxiosError } from "axios";
import { Session } from "next-auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Button, Modal } from "rsuite";
import EditPetComponent from "./editPet";
import PET_IMAGE from "../../../../../../libs/business-admin-app/ui/ui-assets/src/lib/images/thumbnail.png";
import styles from "../../../../styles/doctor.module.css";
import dateConverter from "../sectionsRelatedToBookings/dateConverter";


interface PetOverviewProps {
    session: Session
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isUpdateViewOpen: boolean;
    setIsUpdateViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
    pet: Pet;
}

/**
 * 
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 * 
 * @returns Modal to display overview of a pet.
 */
export default function PetOverview(props: PetOverviewProps) {

    const { session, isOpen, setIsOpen, isUpdateViewOpen, setIsUpdateViewOpen, pet } = props;
    const [ url, setUrl ] = useState(null);
    const [ medicalReportList, setMedicalReportList ] = useState<MedicalReport[] | null>(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ isImageNotFound, setIsImageNotFound ] = useState(false);

    async function getThumbnails() {
        const accessToken = session.accessToken;

        if (pet) {
            getThumbnail(accessToken, session.orgId, session.userId, pet?.id)
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
        setUrl(null);
        getThumbnails();
        getMedicalReportInfo();
        setIsLoading(true);
    }, [ isOpen ]);

    const handleEdit = () => {
        setIsOpen(false);
        setIsUpdateViewOpen(true);
    };

    const closePetOverviewDialog = (): void => {
        setIsOpen(false);
        setUrl(null);
        setIsLoading(true);
        setIsImageNotFound(false);
    };


    const handleDelete = () => {
        async function deletePets() {
            const accessToken = session.accessToken;
            const response = await deletePet(accessToken, session.orgId, session.user.id, pet.id);

            setIsOpen(false);
        }
        deletePets();
    };

    async function getMedicalReportInfo() {
        const accessToken = session.accessToken;

        getMedicalReport(accessToken, pet?.id)
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


    return (
        <><Modal
            backdrop="static"
            role="alertdialog"
            open={ isOpen }
            onClose={ closePetOverviewDialog }
            size="sm"
            className={ styles.doctorOverviewMainDiv }>

            <Modal.Header>
                <ModelHeaderComponent title="Pet Overview" />
            </Modal.Header>

            <Modal.Body>
                <div className={ styles.petOverviewMainDiv }>
                    <div className={ styles.basicInfoDiv }>
                        <Grid container spacing={ 2 }>
                            <Grid item xs={ 6 }>
                                <Typography className="typography-style">
                                    <p className={ styles.docOverviewFont }>Name</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docOverviewFont }>Type</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docOverviewFont }>Date of Birth</p>
                                </Typography>
                            </Grid>
                            <Grid item xs={ 6 }>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docOverviewFont }>{ pet?.name }</p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docOverviewFont }>{ pet?.breed }</p>
                                </Typography>
                                <Typography className="typography-style-doc-overview">
                                    <p className={ styles.docOverviewFont }>{ pet?.dateOfBirth }</p>
                                </Typography>
                            </Grid>
                        </Grid>
                        
                    </div>
                    <br />
                    <div className={ styles.petVaccInfoContainer }>
                        <div className={ styles.vaccinationHeaderInOverview }>
                        Vaccination Information
                        </div>
                        <br/>
                        <div className={ styles.vaccInfoDivInOverview }>
                            { pet?.vaccinations.length > 0 ? (
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
                                                Vaccine Name</TableCell>
                                                <TableCell
                                                    align="center"
                                                    style={ {
                                                        fontSize: "1.7vh", fontWeight: "bold",
                                                        color: "rgb(105, 105, 105)"
                                                    } }>
                                                Last vaccination Date
                                                </TableCell>
                                                <TableCell
                                                    align="center"
                                                    style={ {
                                                        fontSize: "1.7vh", fontWeight: "bold",
                                                        color: "rgb(105, 105, 105)"
                                                    } }>Next Vaccination Date</TableCell>
                                                <TableCell
                                                    align="center"
                                                    style={ {
                                                        fontSize: "1.7vh", fontWeight: "bold",
                                                        color: "rgb(105, 105, 105)"
                                                    } }>Enable Alerts</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            { pet.vaccinations.map((vaccine) => (
                                                <TableRow key={ vaccine.name }>
                                                    <TableCell
                                                        align="center"
                                                        style={ { fontSize: "1.7vh", padding: 1 } }>
                                                        { vaccine.name }</TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={ { fontSize: "1.7vh", padding: 1 } }>
                                                        { vaccine.lastVaccinationDate }</TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={ { fontSize: "1.7vh", padding: 1 } }>
                                                        { vaccine.nextVaccinationDate }</TableCell>
                                                    <TableCell
                                                        align="center"
                                                        style={ { fontSize: "1.7vh", padding: 1 } }>
                                                        <Checkbox
                                                            color="primary" 
                                                            disabled={ true }
                                                            checked={ vaccine.enableAlerts } /></TableCell>
                                                </TableRow>
                                            )) }
                                        </TableBody>
                                    </Table>
                                    <br/>
                                </div>
                            ) : (
                                <div className={ styles.noVaccinationInfoDiv }>
                                Vaccination Details are not provided.
                                </div>
                            ) }
                        
                        </div>
                        
                        <div className={ styles.medicalReportHeaderInOverview }>
                        Medical Reports
                        </div>
                        <br/>
                        <div className={ styles.vaccInfoDivInOverview }>
                            { medicalReportList?.length > 0 ? (
                                medicalReportList.map((medicalReport) => (
                                    <div key={ medicalReport.reportId } className={ styles.medicalReportCard }>
                                        <Grid container spacing={ 2 } >
                                            <Grid item xs={ 6 }>
                                                <Typography className="typography-style">
                                                    <p className={ styles.docOverviewFont }>Diagnosis</p>
                                                </Typography>
                                                <Typography className="typography-style">
                                                    <p className={ styles.docOverviewFont }>Treatment</p>
                                                </Typography>
                                                <Typography className="typography-style">
                                                    <p className={ styles.docOverviewFont }>Created At</p>
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={ 6 }>
                                                <Typography className="typography-style-doc-overview">
                                                    <p className={ styles.docOverviewFont }>
                                                        { medicalReport.diagnosis?medicalReport.diagnosis:" - " }</p>
                                                </Typography>
                                                <Typography className="typography-style-doc-overview">
                                                    <p className={ styles.docOverviewFont }>
                                                        { medicalReport.treatment?medicalReport.treatment:" - " }</p>
                                                </Typography>
                                                <Typography className="typography-style-doc-overview">
                                                    <p className={ styles.docOverviewFont }>
                                                        { medicalReport.createdAt?
                                                            dateConverter(medicalReport.createdAt):" - " }</p>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <div className={ styles.medicationTable }>
                                            <Table aria-label="simple table" style={ { width: "30vw" } }>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell
                                                            align="center"
                                                            style={ {
                                                                fontSize: "1.7vh", fontWeight: "bold",
                                                                color: "rgb(105, 105, 105)"
                                                            } }>
                                                Drug Name</TableCell>
                                                        <TableCell
                                                            align="center"
                                                            style={ {
                                                                fontSize: "1.7vh", fontWeight: "bold",
                                                                color: "rgb(105, 105, 105)"
                                                            } }>
                                                Dosage
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            style={ {
                                                                fontSize: "1.7vh", fontWeight: "bold",
                                                                color: "rgb(105, 105, 105)"
                                                            } }>Duration</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    { medicalReport.medications.map((medicine) => (
                                                        <TableRow key={ medicine.drugName }>
                                                            <TableCell
                                                                align="center"
                                                                style={ { fontSize: "1.7vh", padding: 1 } }>
                                                                { medicine.drugName }</TableCell>
                                                            <TableCell
                                                                align="center"
                                                                style={ { fontSize: "1.7vh", padding: 1 } }>
                                                                { medicine.dosage }</TableCell>
                                                            <TableCell
                                                                align="center"
                                                                style={ { fontSize: "1.7vh", padding: 1 } }>
                                                                { medicine.duration }</TableCell>
                                                        </TableRow>
                                                    )) }
                                                </TableBody>
                                            </Table>
                                        </div>
                                        <br/> 
                                    </div>
                                ))
                            ) : (
                                <div className={ styles.noVaccinationInfoDiv }>
                                    Medical Reports are not provided.
                                </div>
                            ) }
                        </div>
                    </div>
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
                                    alt="pet-thumbnail" 
                                    width={ 10 }
                                    height={ 10 }
                                />
                            ) : (
                                <Image
                                    style={ { borderRadius: "10%", height: "100%", width: "100%" } }
                                    src={ PET_IMAGE }
                                    alt="pet-thumbnail" />

                            ) }
                        </div> 
                    ) }
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={ handleEdit } appearance="primary">
                    Edit
                </Button>
                <Button
                    onClick={ handleDelete }
                    appearance="subtle"
                    style={ { backgroundColor: "lightcoral", color: "white" } }>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
        <div>
            <EditPetComponent 
                session={ session } 
                isOpen={ isUpdateViewOpen } 
                setIsOpen={ setIsUpdateViewOpen } 
                pet={ pet }
                imageUrl={ url } 
                setImageUrl={ setUrl }
                isImageNotFound = { isImageNotFound } />
        </div>
        </>
    );
}

