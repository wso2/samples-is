/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Pet, VaccineInfo, updatePetInfo } from "../../types/pet";
import { Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import FileUploadSingle from "./fileUploader";
import PET_IMAGE from "../../images/thumbnail.png";
import { useAuthContext } from "@asgardeo/auth-react";
import { updatePet } from "../../components/UpdatePet/update-pet";

interface UpdateProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    pet: Pet;
    imageUrl: any;
    setImageUrl: React.Dispatch<React.SetStateAction<File>>;
}

export default function UpdatePet(props: UpdateProps) {
    const { isOpen, setIsOpen, pet, imageUrl, setImageUrl } = props;
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [DoB, setDoB] = useState("");
    const [vaccineName, setVaccineName] = useState("");
    const [lastVaccinationDate, setLastVaccinationDate] = useState("");
    const [nextVaccinationDate, setNextVaccinationDate] = useState("");
    const dateInputRef = useRef(null);
    const [vaccineInfo, setVaccineInfo] = useState<VaccineInfo[] | null>([]);
    const [message, setMessage] = useState(null);
    const [lastDate, setLastDate] = useState(null);
    const [nextDate, setNextDate] = useState(null);
    const [isDisable, setIsDisable] = useState(false);
    //const [counter, setCounter] = useState(0);
    const { getAccessToken } = useAuthContext();
    const [isChecked, setIsChecked] = useState(false);


    const handleOnAdd = () => {
        if (vaccineName && lastVaccinationDate && nextVaccinationDate) {
            const info: VaccineInfo = {
                name: vaccineName,
                lastVaccinationDate: lastVaccinationDate,
                nextVaccinationDate: nextVaccinationDate,
                enableAlerts: false,
            };

            setVaccineInfo(vaccineInfo => [...vaccineInfo, info]);
            setMessage("");
            setLastDate("mm/dd/yyyy");
            setNextDate("mm/dd/yyyy");
            // setCounter(count => count + 1);
            // if (counter >= 3) {
            //     setIsDisable(true);
            // }

        }
    };

    const handleOnSave = () => {
        async function updatePets() {
            const accessToken = await getAccessToken();
            const petName = (name) ? name : pet.name;
            const petBreed = (type) ? type : pet.breed;
            const petDoB = (DoB) ? DoB : pet.dateOfBirth;
            const payload: updatePetInfo = {
                name: petName,
                breed: petBreed,
                dateOfBirth: petDoB,
                vaccinations: vaccineInfo,
            };
            const response = await updatePet(accessToken, pet.id, payload);
        }
        updatePets();
        setIsOpen(false);
    };

    const handleClose = () => {
        //setCounter(0);
        setIsDisable(false);
        setVaccineInfo([]);
        setIsOpen(false);
    }

    const handleCancel = () => {
        setIsOpen(false);
    }

    const handleRemoveVaccineDetail = (vaccine: VaccineInfo) => {
        setVaccineInfo(oldValues => {
            return oldValues.filter(value => value !== vaccine)
        })
        //setCounter(counter - 1);
    }

    useEffect(() => {
        if (pet.vaccinations) {
            setVaccineInfo(pet.vaccinations);
            //setCounter(counter + (pet.vaccinations.length));
        }
    }, [pet.vaccinations]);

    function handleCheckboxChange(vaccine: VaccineInfo) {
        setIsChecked(!isChecked);
        vaccineInfo.map(item => {
            if (item.name === vaccine.name) {
                item.enableAlerts = !isChecked;
            }
        });
    }


    if (pet) {
        return (
            <>
                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="overview-div"
                        onClose={() => handleClose()}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div />
                        </Transition.Child>
                        <div className="align-title">
                            <Dialog.Panel>
                                <Dialog.Title
                                    as="h3" className="overview-title-style">
                                    {"Update Details"}
                                </Dialog.Title>
                                <div className="div-grid-sec">
                                    <Grid container spacing={2}>
                                        <Grid item xs={5}>
                                            <Typography className="typography-style">
                                                <p className="update-view-font">Name</p>
                                            </Typography>
                                            <Typography className="typography-style">
                                                <p className="update-view-font">Type</p>
                                            </Typography>
                                            <Typography className="typography-style">
                                                <p className="update-view-font">Date of Birth</p>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={5}>
                                            <input
                                                className="update-input-style"
                                                id="name"
                                                type="text"
                                                placeholder="Name"
                                                defaultValue={pet.name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                            />
                                            <input
                                                className="update-input-style"
                                                id="type"
                                                type="text"
                                                placeholder="Type"
                                                defaultValue={pet.breed}
                                                onChange={(e) => setType(e.target.value)}
                                            />
                                            <input
                                                className="update-input-style"
                                                id="DoB"
                                                type="date"
                                                ref={dateInputRef}
                                                placeholder="DoB"
                                                defaultValue={pet.dateOfBirth}
                                                onChange={(e) => setDoB(e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className="vcc-div-style-sec">
                                    <h4 className="bold">Vaccination Details</h4>
                                    <div className="date-div-style">
                                        <label className="date-label-style">Last vaccination date</label>
                                    </div>
                                    <div className="date-div-style-2">
                                        <label className="date-label-style">Next vaccination date</label>
                                    </div>
                                    <div className="vcc-div-grid-style">
                                        <Grid container spacing={1}>
                                            <input
                                                className="vcc-update-input-style-sec"
                                                id="vaccine name"
                                                type="text"
                                                placeholder="vaccine name"
                                                onChange={(e) => {
                                                    setVaccineName(e.target.value);
                                                    setMessage(e.target.value);
                                                }}
                                                value={message}
                                            />
                                            <input
                                                className="vcc-update-input-style-sec"
                                                id="vaccine_1"
                                                type="date"
                                                ref={dateInputRef}
                                                placeholder="last vaccination date"
                                                onChange={(e) => {
                                                    setLastVaccinationDate(e.target.value);
                                                    setLastDate(e.target.value);
                                                }}
                                                value={lastDate}

                                            />
                                            <input
                                                className="vcc-update-input-style-sec"
                                                id="vaccine_1"
                                                type="date"
                                                ref={dateInputRef}
                                                placeholder="vaccine_1"
                                                onChange={(e) => {
                                                    setNextVaccinationDate(e.target.value);
                                                    setNextDate(e.target.value);
                                                }}
                                                value={nextDate}
                                            />
                                            <button onClick={handleOnAdd} disabled={isDisable} className="plus-button-style">+</button>
                                        </Grid>
                                    </div>
                                    <div className="vaccine-info-box">
                                        <div>
                                            <Table aria-label="simple table" style={{ width: "43vw" }}>
                                                <TableHead >
                                                    <TableRow >
                                                        <TableCell align="center" style={{ fontSize: "1.7vh", fontWeight: "bold" , padding: "1vh", height:"1vh"}}>Vaccine Name</TableCell>
                                                        <TableCell align="center" style={{ fontSize: "1.7vh", fontWeight: "bold" , padding: "1vh", height:"1vh"}}>Last vaccination Date</TableCell>
                                                        <TableCell align="center" style={{ fontSize: "1.7vh", fontWeight: "bold" , padding: "1vh", height:"1vh"}}>Next Vaccination Date</TableCell>
                                                        <TableCell align="center" style={{ fontSize: "1.7vh", fontWeight: "bold" , padding: "1vh", height:"1vh"}}>Enable Alerts</TableCell>
                                                        <TableCell align="center" style={{ fontSize: "1.7vh", fontWeight: "bold" , padding: "1vh", height:"1vh"}}>Delete Record</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {vaccineInfo && vaccineInfo.length > 0 && vaccineInfo.map((vaccine) => (
                                                        <TableRow key={vaccine.name}>
                                                            <TableCell align="center" style={{ fontSize: "1.7vh", padding: "1vh" }}>{vaccine.name}</TableCell>
                                                            <TableCell align="center" style={{ fontSize: "1.7vh", padding: "1vh" }}>{vaccine.lastVaccinationDate}</TableCell>
                                                            <TableCell align="center" style={{ fontSize: "1.7vh", padding: "1vh" }}>{vaccine.nextVaccinationDate}</TableCell>
                                                            <TableCell align="center" style={{ fontSize: "1.7vh", padding: "1vh" }}><label><input
                                                                type="checkbox"
                                                                checked={vaccine.enableAlerts}
                                                                onChange={(e) => { handleCheckboxChange(vaccine) }}
                                                            /></label></TableCell>
                                                            <TableCell align="center" style={{ fontSize: 10, padding: 1 }}><button className="remove-btn" onClick={() => handleRemoveVaccineDetail(vaccine)}>x</button></TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                                <div className="save-btn-div-sec">
                                    <button className="update-button"
                                        onClick={handleOnSave}>
                                        Save
                                    </button>
                                </div>
                                <div className="cancel-btn-div">
                                    <button
                                        className="cancel-button"
                                        onClick={handleCancel}>Cancel</button>
                                </div>
                                <div className="pet-image-style">
                                    {imageUrl ? (
                                    <img
                                        style={{ width: "20vw", height: "20vw", borderRadius: "10%"}}
                                        src={imageUrl}
                                        alt="pet-image"
                                    />) : (
                                        <img
                                            style={{ width: "20vw", height: "20vw", borderRadius: "10%"}}
                                            src={PET_IMAGE}
                                            alt="pet-image"
                                        />
                                    )}
                                </div>
                                <div className="update-image-div">
                                    <label className="update-image-label">Update Pet Image</label>
                                </div>
                                <div className="image-update-div">
                                    <FileUploadSingle petId={pet.id} imageUrl={imageUrl} setImageUrl={setImageUrl} />
                                </div>
                            </Dialog.Panel>
                        </div>
                    </Dialog >
                </Transition >
            </>
        );
    }
}