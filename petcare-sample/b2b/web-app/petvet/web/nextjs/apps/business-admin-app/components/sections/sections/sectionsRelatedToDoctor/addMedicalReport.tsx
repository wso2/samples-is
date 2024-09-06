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

import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { FormButtonToolbar, FormField, ModelHeaderComponent } 
    from "@pet-management-webapp/shared/ui/ui-basic-components";
import { errorTypeDialog, successTypeDialog } from "@pet-management-webapp/shared/ui/ui-components";
import { checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE, fieldValidate } 
    from "@pet-management-webapp/shared/util/util-front-end-util";
import { postMedicalReport } from "apps/business-admin-app/APICalls/CreateMedicalReport/post-medical-report";
import { Medicine, Pet, UpdateMedicalReport } from "apps/business-admin-app/types/pets";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { Form } from "react-final-form";
import { Loader, Modal, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../styles/doctor.module.css";


interface AddMedicalReportComponentProps {
    token: string;
    petId: string;
    open: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * 
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 * 
 * @returns Modal to add a pet.
 */
export default function AddMedicalReportComponent(props: AddMedicalReportComponentProps) {

    const { token, petId, open, setIsOpen } = props;
    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [ dosage, setDosage ] = useState("");
    const [ drugName, setDrugName ] = useState("");
    const [ duration, setDuration ] = useState("");
    const [ medicineList, setMedicineList ] = useState<Medicine[] | null>([]);

    const toaster = useToaster();

    const validate = (values: Record<string, unknown>): Record<string, string> => {
        let errors: Record<string, string> = {};

        errors = fieldValidate("Diagnosis", values.Diagnosis, errors);
        errors = fieldValidate("Treatment", values.Treatment, errors);

        return errors;
    };


    const onDataSubmit = (response: AxiosResponse<Pet>, form): void => {
        if (response) {
            successTypeDialog(toaster, "Changes Saved Successfully", "Report added successfully.");
            form.restart();
            setIsOpen(false);
        } else {
            errorTypeDialog(toaster, "Error Occured", "Error occured while adding the report. Try again.");
        }
    };

    const onSubmit = async (values: Record<string, string>, form): Promise<void> => {
        setLoadingDisplay(LOADING_DISPLAY_BLOCK);
        const payload: UpdateMedicalReport = {
            diagnosis: values.Diagnosis,
            medications: medicineList,
            treatment: values.Treatment
        };

        postMedicalReport(token, petId, payload)
            .then((response) => onDataSubmit(response, form))
            .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));

        setMedicineList([]);    
    };

    const handleOnAdd = () => {
        if (drugName && dosage && duration) {
            const info: Medicine = {
                drugName: drugName,
                dosage: dosage,
                duration: duration
            };

            setMedicineList(medicineList => [ ...medicineList, info ]);
            setDrugName("");
            setDosage("");
            setDuration("");
        }
    };

    const handleRemoveMedicineDetail = (medicine: Medicine) => {
        setMedicineList(oldValues => {
            return oldValues.filter(value => value !== medicine);
        });
    };

    const closeAddMedicalReportDialog = (): void => {
        setIsOpen(false);
        setMedicineList([]); 
    };

    return (
        <Modal backdrop="static" role="alertdialog" open={ open } onClose={ closeAddMedicalReportDialog } size="sm">

            <Modal.Header>
                <ModelHeaderComponent title="Add Medical Report" />
            </Modal.Header>

            <Modal.Body>
                <div className={ styles.addMedicalMainDiv }>

                    <Form
                        onSubmit={ onSubmit }
                        validate={ validate }
                        render={ ({ handleSubmit, form, submitting, pristine, errors }) => (
                            <FormSuite
                                layout="vertical"
                                onSubmit={ () => { handleSubmit().then(form.restart); } }
                                fluid>

                                <FormField
                                    name="Diagnosis"
                                    label="Diagnosis"
                                    helperText="Diagnosis"
                                    needErrorMessage={ true }
                                >
                                    <FormSuite.Control name="input" />
                                </FormField>

                                <FormField
                                    name="Treatment"
                                    label="Treatment"
                                    helperText="Treatment"
                                    needErrorMessage={ true }
                                >
                                    <FormSuite.Control name="input" />
                                </FormField>

                                <div className={ styles.medicineHeaderInReport }>
                                        Medications
                                </div>
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
                                { medicineList.length > 0 && (
                                    <div>
                                        <div>
                                            <Table aria-label="simple table" style={ { width: "43vw" } }>
                                                <TableHead >
                                                    <TableRow >
                                                        <TableCell
                                                            align="center" 
                                                            style={ { fontSize: "1.7vh", fontWeight: "bold", 
                                                                padding: "1vh", height: "1vh" } }>Drug Name</TableCell>
                                                        <TableCell
                                                            align="center" 
                                                            style={ { fontSize: "1.7vh", fontWeight: "bold", 
                                                                padding: "1vh", height: "1vh" } }>Dosage</TableCell>
                                                        <TableCell
                                                            align="center" 
                                                            style={ { fontSize: "1.7vh", fontWeight: "bold", 
                                                                padding: "1vh", height: "1vh" } }>Duration</TableCell>
                                                        <TableCell
                                                            align="center" 
                                                            style={ { fontSize: "1.7vh", fontWeight: "bold", 
                                                                padding: "1vh", height: "1vh" } }>
                                                                    Delete Record</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    { medicineList && 
                                                    medicineList.length > 0 && 
                                                    medicineList.map((medicine) => (
                                                        <TableRow key={ medicine.drugName }>
                                                            <TableCell
                                                                align="center" 
                                                                style={ { fontSize: "1.7vh", padding: "1vh" } }>
                                                                { medicine.drugName }</TableCell>
                                                            <TableCell
                                                                align="center" 
                                                                style={ { fontSize: "1.7vh", padding: "1vh" } }>
                                                                { medicine.dosage }</TableCell>
                                                            <TableCell
                                                                align="center" 
                                                                style={ { fontSize: "1.7vh", padding: "1vh" } }>
                                                                { medicine.duration }</TableCell>
                                                            <TableCell
                                                                align="center" 
                                                                style={ { fontSize: 10, padding: 1 } }>
                                                                <button
                                                                    className={ styles.removeBtn }
                                                                    onClick={ (e) => 
                                                                    { e.preventDefault(); 
                                                                        handleRemoveMedicineDetail(medicine); } }>
                                                                        x</button></TableCell>
                                                        </TableRow>
                                                    )) }
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                ) }

                                <br/>

                                <FormButtonToolbar
                                    submitButtonText="Submit"
                                    submitButtonDisabled={ submitting || pristine || !checkIfJSONisEmpty(errors) }
                                    onCancel={ closeAddMedicalReportDialog }
                                />

                            </FormSuite>
                        ) }
                    />

                </div>
            </Modal.Body>

            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="Report is adding" vertical />
            </div>
        </Modal>

    );
}

