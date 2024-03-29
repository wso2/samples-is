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
import React, { Fragment, useEffect, useState } from "react";
import { Pet } from "../../types/pet";
import { Checkbox, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import PET_IMAGE from "../../images/thumbnail.png";
import UpdatePet from "./updatePet";
import { useAuthContext } from "@asgardeo/auth-react";
import { deletePet } from "../../components/DeletePet/delete-pet";
import { getThumbnail } from "../../components/GetThumbnail/get-thumbnail";

interface OverviewProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isUpdateViewOpen: boolean;
    setIsUpdateViewOpen: React.Dispatch<React.SetStateAction<boolean>>;
    pet: Pet;
    petThumbnail: any;
    setPetThumbnail: React.Dispatch<React.SetStateAction<File>>;
}

export default function PetOverview(props: OverviewProps) {
    const { isOpen, setIsOpen, isUpdateViewOpen, setIsUpdateViewOpen, pet, petThumbnail, setPetThumbnail } = props;
    const { getAccessToken } = useAuthContext();
    const [url, setUrl] = useState(null);

    const handleDelete = () => {
        async function deletePets() {
            const accessToken = await getAccessToken();
            const response = await deletePet(accessToken, pet.id);
            setIsOpen(false);
        }
        deletePets();
    }

    async function getThumbnails() {
        const accessToken = await getAccessToken();
        const response = await getThumbnail(accessToken, pet.id);
        if (response.data.size > 0) {
            const imageUrl = URL.createObjectURL(response.data);
            setUrl(imageUrl);
        }
    }

    useEffect(() => {
        setUrl(null);
        getThumbnails();
    }, [isOpen]);

    if (pet) {
        return (
            <>
                <Transition appear show={isOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="overview-div"
                        onClose={() => setIsOpen(false)}
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
                        <div>
                            <Dialog.Panel>
                                <Dialog.Title
                                    as="h3" className="overview-title-style">
                                    {"About " + pet.name}
                                </Dialog.Title>
                                <div className="div-grid">
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography className="typography-style">
                                                <p className="overview-font">Type</p>
                                            </Typography>
                                            <Typography className="typography-style">
                                                <p className="overview-font">Date of Birth</p>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography className="typography-style">
                                                <p className="overview-font">{pet.breed}</p>
                                            </Typography>
                                            <Typography className="typography-style">
                                                <p className="overview-font">{pet.dateOfBirth}</p>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </div>
                                <div className="vcc-div-style">
                                    <h4 className="bold">Vaccination Details</h4>
                                    {pet.vaccinations && pet.vaccinations.length > 0 ? (
                                    <div className="vaccine-info-box-sec">
                                        <div >
                                            <Table aria-label="simple table" style={{ width: "43vw" }}>
                                                <TableHead >
                                                    <TableRow >
                                                        <TableCell align="center" style={{ fontSize: "1.7vh", fontWeight: "bold" }}>Vaccine Name</TableCell>
                                                        <TableCell align="center" style={{ fontSize: "1.7vh", fontWeight: "bold" }}>Last vaccination Date</TableCell>
                                                        <TableCell align="center" style={{ fontSize: "1.7vh", fontWeight: "bold" }}>Next Vaccination Date</TableCell>
                                                        <TableCell align="center" style={{ fontSize: "1.7vh", fontWeight: "bold" }}>Enable Alerts</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {pet.vaccinations.map((vaccine) => (
                                                        <TableRow key={vaccine.name}>
                                                            <TableCell align="center" style={{ fontSize: "1.7vh", padding: 1 }}>{vaccine.name}</TableCell>
                                                            <TableCell align="center" style={{ fontSize: "1.7vh", padding: 1 }}>{vaccine.lastVaccinationDate}</TableCell>
                                                            <TableCell align="center" style={{ fontSize: "1.7vh", padding: 1 }}>{vaccine.nextVaccinationDate}</TableCell>
                                                            <TableCell align="center" style={{ fontSize: "1.7vh", padding: 1 }}><Checkbox color="primary" disabled={true} checked={vaccine.enableAlerts}/></TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="no-vacc-details">
                                        <label className="no-detail-label">No vaccination details available</label>
                                    </div>
                                )}
                                </div>
                                <div className="update-btn-div">
                                    <button className="update-button"
                                        onClick={() => { setIsUpdateViewOpen(true); setIsOpen(false); }}>
                                        Edit
                                    </button>
                                </div>
                                <div className="delete-btn-div">
                                    <button className="delete-button" onClick={handleDelete}>Delete</button>
                                </div>
                                <div className="pet-image-style">
                                    {url ? (<img
                                        style={{ width: "20vw", height: "20vw", borderRadius: "10%"}}
                                        src={url}
                                        alt="pet-image"
                                    />) : (
                                        <img
                                            style={{ width: "20vw", height: "20vw", borderRadius: "10%"}}
                                            src={PET_IMAGE}
                                            alt="pet-image"
                                        />
                                    )}
                                </div>
                            </Dialog.Panel>
                        </div>
                    </Dialog>
                </Transition>
                <div>
                    <UpdatePet isOpen={isUpdateViewOpen} setIsOpen={setIsUpdateViewOpen} pet={pet} imageUrl={url} setImageUrl={setUrl}/>
                </div>
            </>
        );
    }
}