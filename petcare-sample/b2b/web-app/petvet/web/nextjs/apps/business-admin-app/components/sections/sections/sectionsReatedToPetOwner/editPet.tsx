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
import { updatePet } from "apps/business-admin-app/APICalls/UpdatePet/update-pet";
import { Pet, VaccineInfo, updatePetInfo } from "apps/business-admin-app/types/pets";
import { Session } from "next-auth";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Button, Message, Modal } from "rsuite";
import FileUploadSingle from "./imageUploader";
import PET_IMAGE from "../../../../../../libs/business-admin-app/ui/ui-assets/src/lib/images/thumbnail.png";
import styles from "../../../../styles/doctor.module.css";


interface EditPetComponentProps {
    session: Session
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    pet: Pet;
    imageUrl: any;
    setImageUrl: React.Dispatch<React.SetStateAction<File>>;
    isImageNotFound: boolean;
}

/**
 * 
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 * 
 * @returns Modal to edit details of a pet.
 */
export default function EditPetComponent(props: EditPetComponentProps) {

    const { session, isOpen, setIsOpen, pet, imageUrl, setImageUrl, isImageNotFound } = props;
    const [ name, setName ] = useState("");
    const [ type, setType ] = useState("");
    const [ DoB, setDoB ] = useState("");
    const [ vaccineName, setVaccineName ] = useState("");
    const [ lastVaccinationDate, setLastVaccinationDate ] = useState("");
    const [ nextVaccinationDate, setNextVaccinationDate ] = useState("");
    const dateInputRef = useRef(null);
    const [ vaccineInfo, setVaccineInfo ] = useState<VaccineInfo[] | null>();
    const [ message, setMessage ] = useState(null);
    const [ lastDate, setLastDate ] = useState(null);
    const [ nextDate, setNextDate ] = useState(null);
    const [ isDisable, setIsDisable ] = useState(false);
    const [ isChecked, setIsChecked ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);


    useEffect(() => {
        setVaccineInfo(pet?.vaccinations);
        if (isImageNotFound) {
            setIsLoading(false);
        }

        if (imageUrl !== null) {
            // Start loading
            setIsLoading(true);
      
            // Simulate loading delay
            const delay = 1600;
            const timeout = setTimeout(() => {
            // Finish loading
                setIsLoading(false);
            }, delay);
      
            // Cleanup function
            return () => clearTimeout(timeout);
        }
    }, [ isOpen ]);


    const handleSave = () => {
        async function updatePets() {
            const accessToken = session.accessToken;
            const petName = (name) ? name : pet.name;
            const petBreed = (type) ? type : pet.breed;
            const petDoB = (DoB) ? DoB : pet.dateOfBirth;
            const payload: updatePetInfo = {
                breed: petBreed,
                dateOfBirth: petDoB,
                name: petName,
                vaccinations: vaccineInfo
            };
            const response = await updatePet(accessToken, pet.id, payload);
        }
        updatePets();
        setIsOpen(false);
    };


    const closeEditPetDialog = (): void => {
        setIsDisable(false);
        setVaccineInfo([]);
        setIsOpen(false);
        setImageUrl(null);
        setIsLoading(true);
    };

    const handleOnAdd = () => {
        if (vaccineName && lastVaccinationDate && nextVaccinationDate) {
            const info: VaccineInfo = {
                enableAlerts: false,
                lastVaccinationDate: lastVaccinationDate,
                name: vaccineName,
                nextVaccinationDate: nextVaccinationDate
            };

            setVaccineInfo(vaccineInfo => [ ...vaccineInfo, info ]);
            setMessage("");
            setLastDate("mm/dd/yyyy");
            setNextDate("mm/dd/yyyy");

        }
    };

    const handleRemoveVaccineDetail = (vaccine: VaccineInfo) => {
        setVaccineInfo(oldValues => {
            return oldValues.filter(value => value !== vaccine);
        });
    };

    function handleCheckboxChange(vaccine: VaccineInfo) {
        setIsChecked(!isChecked);
        vaccineInfo.map(item => {
            if (item.name === vaccine.name) {
                item.enableAlerts = !isChecked;
            }
        });
    }

    return (
        <><Modal
            backdrop="static"
            role="alertdialog"
            open={ isOpen }
            onClose={ closeEditPetDialog }
            size="sm"
            className={ styles.doctorOverviewMainDiv }>

            <Modal.Header>
                <ModelHeaderComponent title="Edit Pet Details" />
            </Modal.Header>

            <Modal.Body>
                <div className={ styles.addUserMainDiv }>
                    <div className={ styles.editPetMainDiv }>
                        <Grid container spacing={ 2 }>
                            <Grid item xs={ 6 }>
                                <Typography className="typography-style">
                                    <p className={ styles.docEditFont }>Name</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docEditFont }>Type</p>
                                </Typography>
                                <Typography className="typography-style">
                                    <p className={ styles.docEditFont }>Date of Birth</p>
                                </Typography>
                            </Grid>
                            <Grid item xs={ 6 }>
                                <input
                                    className={ styles.docEditInputStyle }
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    defaultValue={ pet?.name }
                                    onChange={ (e) =>
                                        setName(e.target.value)
                                    }
                                />
                                <input
                                    className={ styles.docEditInputStyle }
                                    id="type"
                                    type="text"
                                    placeholder="Type"
                                    defaultValue={ pet?.breed }
                                    onChange={ (e) =>
                                        setType(e.target.value)
                                    }
                                />
                                <input
                                    className={ styles.docEditInputStyle }
                                    id="DoB"
                                    type="text"
                                    placeholder="DoB"
                                    defaultValue={ pet?.dateOfBirth }
                                    onChange={ (e) =>
                                        setDoB(e.target.value)
                                    }
                                />
                                
                            </Grid>
                        </Grid>
                        
                    </div>
                    <br />
                    <div className={ styles.vaccinationHeaderInEdit }>
                        Vaccination Information
                    </div>
                    <br/>
                    <Message className={ styles.infoDivInPetEdit } showIcon type="info">
                        Type the vaccine name, last vaccination date and next vaccination date respectively.
                    </Message>
                    <div className={ styles.vccDivGridStyle }>
                        <Grid container spacing={ 1 }>
                            <input
                                className={ styles.vccUpdateInputStyleSec }
                                id="vaccine name"
                                type="text"
                                placeholder="vaccine name"
                                onChange={ (e) => {
                                    setVaccineName(e.target.value);
                                    setMessage(e.target.value);
                                } }
                                value={ message }
                            />
                            <input
                                className={ styles.vccUpdateInputStyleSec }
                                id="vaccine_1"
                                type="date"
                                ref={ dateInputRef }
                                placeholder="last vaccination date"
                                onChange={ (e) => {
                                    setLastVaccinationDate(e.target.value);
                                    setLastDate(e.target.value);
                                } }
                                value={ lastDate }

                            />
                            <input
                                className={ styles.vccUpdateInputStyleSec }
                                id="vaccine_1"
                                type="date"
                                ref={ dateInputRef }
                                placeholder="vaccine_1"
                                onChange={ (e) => {
                                    setNextVaccinationDate(e.target.value);
                                    setNextDate(e.target.value);
                                } }
                                value={ nextDate }
                            />
                            <button 
                                onClick={ handleOnAdd } 
                                disabled={ isDisable } 
                                className={ styles.plusButtonStyle }>+</button>
                        </Grid>
                    </div>
                    <div className={ styles.vaccineInfoBox }>
                        <div>
                            <Table aria-label="simple table" style={ { width: "40vw" } }>
                                <TableHead >
                                    <TableRow >
                                        <TableCell
                                            align="center" 
                                            style={ { fontSize: "1.7vh", fontWeight: "bold" , 
                                                padding: "1vh", height:"1vh" } }>Vaccine Name</TableCell>
                                        <TableCell
                                            align="center" 
                                            style={ { fontSize: "1.7vh", fontWeight: "bold" , 
                                                padding: "1vh", height:"1vh" } }>Last vaccination Date</TableCell>
                                        <TableCell
                                            align="center" 
                                            style={ { fontSize: "1.7vh", fontWeight: "bold" , 
                                                padding: "1vh", height:"1vh" } }>Next Vaccination Date</TableCell>
                                        <TableCell
                                            align="center" 
                                            style={ { fontSize: "1.7vh", fontWeight: "bold" , 
                                                padding: "1vh", height:"1vh" } }>Enable Alerts</TableCell>
                                        <TableCell
                                            align="center" 
                                            style={ { fontSize: "1.7vh", fontWeight: "bold" , 
                                                padding: "1vh", height:"1vh" } }>Delete Record</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    { vaccineInfo && vaccineInfo.length > 0 && vaccineInfo.map((vaccine) => (
                                        <TableRow key={ vaccine.name }>
                                            <TableCell
                                                align="center" 
                                                style={ { fontSize: "1.7vh", 
                                                    padding: "1vh" } }>{ vaccine.name }</TableCell>
                                            <TableCell
                                                align="center" 
                                                style={ { fontSize: "1.7vh", 
                                                    padding: "1vh" } }>{ vaccine.lastVaccinationDate }</TableCell>
                                            <TableCell
                                                align="center" 
                                                style={ { fontSize: "1.7vh", 
                                                    padding: "1vh" } }>{ vaccine.nextVaccinationDate }</TableCell>
                                            <TableCell
                                                align="center" 
                                                style={ { fontSize: "1.7vh", 
                                                    padding: "1vh" } }><label><input
                                                    type="checkbox"
                                                    checked={ vaccine.enableAlerts }
                                                    onChange={ (e) => { handleCheckboxChange(vaccine); } }
                                                /></label></TableCell>
                                            <TableCell
                                                align="center" 
                                                style={ { fontSize: 10, padding: 1 } }>
                                                <button
                                                    className={ styles.removeBtn } 
                                                    onClick={ () => handleRemoveVaccineDetail(vaccine) }>
                                                    x</button></TableCell>
                                        </TableRow>
                                    )) }
                                </TableBody>
                            </Table>
                            <br/>
                        </div>
                    </div>
                    <br /><br />
                    <div className={ styles.docImageStyle }>
                        { isLoading ? (
                            <TailSpin color="var(--primary-color)" height={ 100 } width={ 100 } />
                        ) : (
                            <div>
                                { imageUrl ? (
                                    <Image
                                        style={ { borderRadius: "10%", height: "100%", width: "100%" } }
                                        src={ imageUrl }
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
                    <div className={ styles.updateDocImageDiv }>
                        Update Pet Image
                    </div>
                    <FileUploadSingle  
                        session={ session }
                        petId={ pet?.id } 
                        imageUrl={ imageUrl } 
                        setImageUrl={ setImageUrl } />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={ handleSave } appearance="primary">
                    Save
                </Button>
                <Button onClick={ closeEditPetDialog } appearance="subtle">
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

