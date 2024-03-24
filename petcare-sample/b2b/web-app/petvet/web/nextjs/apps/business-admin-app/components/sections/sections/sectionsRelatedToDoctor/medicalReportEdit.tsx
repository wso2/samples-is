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
import PageIcon from "@rsuite/icons/Page";
import TrashIcon from "@rsuite/icons/Trash";
import { deleteMedicalReport } from "apps/business-admin-app/APICalls/DeleteMedicalReport/deleteMedicalReport";
import { updateMedicalReport } from "apps/business-admin-app/APICalls/UpdateMedicalReport/put-medicalReport";
import { MedicalReport, Medicine, UpdateMedicalReport } from "apps/business-admin-app/types/pets";
import { useState } from "react";
import { Button, Modal } from "rsuite";
import styles from "../../../../styles/doctor.module.css";


interface MedicalReportEdit {
    token: string;
    petId: string;
    medicalReport: MedicalReport;
    setMedicalReport: React.Dispatch<React.SetStateAction<MedicalReport>>;
    medicineInfo: Medicine[];
    setMedicineInfo: React.Dispatch<React.SetStateAction<Medicine[]>>;
    medicalReportList: MedicalReport[];
    setMedicalReportList: React.Dispatch<React.SetStateAction<MedicalReport[]>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * 
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 * 
 * @returns Modal to show the overview of a medical report.
 */
export default function MedicalReportEdit(props: MedicalReportEdit) {

    const { token, petId, medicalReport, 
        setMedicalReport, medicalReportList, 
        setMedicalReportList, medicineInfo, setMedicineInfo, isOpen, setIsOpen } = props;
    const [ diagnosis, setDiagnosis ] = useState("");
    const [ treatment, setTreatment ] = useState("");
    const [ dosage, setDosage ] = useState("");
    const [ drugName, setDrugName ] = useState("");
    const [ duration, setDuration ] = useState("");

    const closeEditView = () => {
        setIsOpen(false);
    };

    const handleSave = () => {
        async function updateReport() {
            const accessToken = token;
            const diagnosisValue = (diagnosis) ? diagnosis : medicalReport.diagnosis;
            const treatmentValue = (treatment) ? treatment : medicalReport.treatment;
            const payload: UpdateMedicalReport = {
                diagnosis: diagnosisValue,
                treatment: treatmentValue,
                medications: medicineInfo
            };
            const response = await updateMedicalReport(accessToken, petId, medicalReport.reportId, payload);
        }
        updateReport();
        setIsOpen(false);
    };
    
    const handleDelete = (report: MedicalReport) => {
        setMedicalReport(null);
        setMedicalReportList(oldValues => {
            return oldValues.filter(value => value !== report);
        });
        async function deleteReport() {
            const accessToken = token;
            const response = await deleteMedicalReport(accessToken, petId, report.reportId);
        }
        deleteReport();
    };

    const handleOnAdd = () => {
        if (drugName && dosage && duration ) {
            const info: Medicine = {
                drugName: drugName,
                dosage: dosage,
                duration: duration            
            };

            setMedicineInfo(medicineInfo => [ ...medicineInfo, info ]);
            setDrugName("");
            setDosage("");
            setDuration("");
        }
    };

    const handleRemoveAvailabilityDetail = (medicine: Medicine) => {
        setMedicineInfo(oldValues => {
            return oldValues.filter(value => value !== medicine);
        });
    };


    return (
        <><Modal
            backdrop="static"
            role="alertdialog"
            open={ isOpen }
            onClose={ closeEditView }
            size="sm"
            className={ styles.doctorOverviewMainDiv }>

            <Modal.Header>
                <ModelHeaderComponent title="Edit Medical Report" />
            </Modal.Header>

            <Modal.Body>
                <div className={ styles.editMedicalReportMainDiv }>
                    <div className={ styles.basicInfoDiv }>
                        { medicalReport && (
                            <div className={ styles.medicalReportCard } >
                                <Grid container spacing={ 2 }>
                                    <Grid item xs={ 6 }>
                                        <Typography>
                                            <p className={ styles.docEditFont }>Diagnosis</p>
                                        </Typography>
                                        <Typography>
                                            <p className={ styles.docEditFont }>Treatment</p>
                                        </Typography>
                                        <Typography>
                                            <p className={ styles.docEditFont }>Created At</p>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={ 6 }>
                                        <input
                                            className={ styles.docEditInputStyle }
                                            id="Diagnosis"
                                            type="text"
                                            placeholder="Diagnosis"
                                            defaultValue={ medicalReport.diagnosis?medicalReport.diagnosis:" - " }
                                            onChange={ (e) =>
                                                setDiagnosis(e.target.value)
                                            }
                                        />
                                        <input
                                            className={ styles.docEditInputStyle }
                                            id="Treatment"
                                            type="text"
                                            placeholder="Treatment"
                                            defaultValue={ medicalReport.treatment?medicalReport.treatment:" - " }
                                            onChange={ (e) =>
                                                setTreatment(e.target.value)
                                            }
                                        />
                                        <input
                                            className={ styles.docEditInputStyle }
                                            id="CreatedAt"
                                            type="text"
                                            placeholder="CreatedAt"
                                            disabled={ true }
                                            defaultValue={ medicalReport.createdAt?
                                                convertToLocalDate(medicalReport.createdAt):" - " }
                                        />
                                    </Grid>
                                </Grid>
                                <div className={ styles.medicineInfoGrid }>
                                    <input
                                        className={ styles.medicineInputStyle }
                                        id="drug_name"
                                        type="text"
                                        placeholder="Drug Name"
                                        onChange={ (e) => {
                                            setDrugName(e.target.value);
                                        } }
                                        value={ drugName }
                                    />
                                    <input
                                        className={ styles.medicineInputStyle }
                                        id="dosage"
                                        type="text"
                                        placeholder="Dosage"
                                        onChange={ (e) => {
                                            setDosage(e.target.value);
                                        } }
                                        value={ dosage }
                                    />
                                    <input
                                        className={ styles.medicineInputStyle }
                                        id="duration"
                                        type="text"
                                        placeholder="Duration"
                                        onChange={ (e) => {
                                            setDuration(e.target.value);
                                        } }
                                        value={ duration }
                                    />
                                    <button
                                        className={ styles.medicinePlusButtonStyle } 
                                        onClick={ (e) => { e.preventDefault(); handleOnAdd(); } }>+</button>
                                </div>
                                <div className={ styles.medicationTable }>
                                    <Table aria-label="simple table" style={ { width: "40vw" } }>
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
                                                <TableCell
                                                    align="center"
                                                    style={ {
                                                        fontSize: "1.7vh", fontWeight: "bold",
                                                        color: "rgb(105, 105, 105)"
                                                    } }>Delete Record</TableCell>    
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            { medicineInfo.map((medicine) => (
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
                                                    <TableCell
                                                        align="center" 
                                                        style={ { fontSize: 10, padding: 1 } }>
                                                        <button
                                                            className={ styles.removeBtn }
                                                            onClick={ (e) => { e.preventDefault(); 
                                                                handleRemoveAvailabilityDetail(medicine); } }>
                                                        x</button></TableCell>    
                                                </TableRow>
                                            )) }
                                        </TableBody>
                                    </Table>
                                </div>
                                <div className={ styles.trashIcon }>
                                    <button
                                        className={ styles.trashButton }
                                        onClick={ () => 
                                        {handleDelete(medicalReport); } }>
                                        <TrashIcon style={ { width: "100%", height: "100%", color: "#f5563d" } }/>
                                    </button>
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
                <Button onClick={ handleSave } appearance="primary">
                    Save
                </Button>
                <Button onClick={ closeEditView } appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

function convertToLocalDate(isoDateString: string): string {
    const date = new Date(isoDateString);
    const localDateString = date.toLocaleDateString();

    return localDateString;
}

