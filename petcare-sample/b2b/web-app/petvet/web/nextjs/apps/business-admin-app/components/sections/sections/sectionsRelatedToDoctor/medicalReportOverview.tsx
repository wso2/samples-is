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

import { Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from 
    "@mui/material";
import { ModelHeaderComponent } from "@pet-management-webapp/shared/ui/ui-basic-components";
import PageIcon from "@rsuite/icons/Page";
import { MedicalReport, Medicine } from "apps/business-admin-app/types/pets";
import { useState } from "react";
import { Button, Modal } from "rsuite";
import MedicalReportEdit from "./medicalReportEdit";
import styles from "../../../../styles/doctor.module.css";
import dateConverter from "../sectionsRelatedToBookings/dateConverter";


interface DoctorOverviewProps {
    token: string;
    petId: string;
    medicalReport: MedicalReport;
    setMedicalReport: React.Dispatch<React.SetStateAction<MedicalReport>>;
    medicalReportList: MedicalReport[];
    setMedicalReportList: React.Dispatch<React.SetStateAction<MedicalReport[]>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isEditOpen: boolean;
    setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * 
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 * 
 * @returns Modal to show the overview of a medical report.
 */
export default function MedicalReportOverview(props: DoctorOverviewProps) {

    const { token, petId, medicalReport, setMedicalReport, medicalReportList, 
        setMedicalReportList, isOpen, setIsOpen, isEditOpen, setIsEditOpen } = props;
    const [ medicineInfo, setMedicineInfo ] = useState<Medicine[] | null>([]);

    const closeOverview = () => {
        setIsOpen(false);
    };

    const handleEdit = () => {
        setIsEditOpen(true);
        setIsOpen(false);
        setMedicineInfo(medicalReport.medications);
    };

    return (
        <><Modal
            backdrop="static"
            role="alertdialog"
            open={ isOpen }
            onClose={ closeOverview }
            size="sm"
            className={ styles.doctorOverviewMainDiv }>

            <Modal.Header>
                <ModelHeaderComponent title="Medical Report Overview" />
            </Modal.Header>

            <Modal.Body>
                <div className={ styles.addUserMainDiv }>
                    <div className={ styles.basicInfoDiv }>
                        { medicalReport && (
                            <div className={ styles.medicalReportCard } >
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
                            </div>
                        ) }
                    </div>
                    <br />
                    <div className={ styles.docImageStyle }>
                        <PageIcon style={ { width: "100%", height: "100%", color: "var(--primary-color)" } } />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={ handleEdit }appearance="primary">
                    Edit
                </Button>
                <Button onClick={ closeOverview } appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
        <div>
            <MedicalReportEdit
                token={ token?.toString() }
                petId={ petId?.toString() }
                medicalReport={ medicalReport }
                setMedicalReport={ setMedicalReport }
                medicineInfo={ medicineInfo }
                setMedicineInfo={ setMedicineInfo }
                medicalReportList={ medicalReportList }
                setMedicalReportList={ setMedicalReportList }
                isOpen={ isEditOpen }
                setIsOpen={ setIsEditOpen }
            />
        </div>
        </>
    );
}

