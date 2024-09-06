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

import { Grid } from "@mui/material";
import { getPets } from "apps/business-admin-app/APICalls/getPetList/get-pets";
import { Pet } from "apps/business-admin-app/types/pets";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Stack } from "rsuite";
import AddPetComponent from "./addPet";
import PetCard from "./petCard";
import PetOverview from "./petOverview";
import styles from "../../../../styles/doctor.module.css";

interface PetsSectionProps {
    session: Session
}

/**
 * 
 * @param prop - session
 * 
 * @returns The idp interface section.
 */
export default function PetsSection(props: PetsSectionProps) {

    const { session } = props;
    const router = useRouter();
    const[ isAddPetOpen, setIsAddPetOpen ] = useState(false);
    const [ petList, setPetList ] = useState<Pet[] | null>(null);
    const [ isOverviewOpen, setIsOverviewOpen ] = useState(false);
    const [ isUpdateViewOpen, setIsUpdateViewOpen ] = useState(false);
    const [ pet, setPet ] = useState<Pet | null>(null);

    async function getPetList() {
        const accessToken = session.accessToken;

        getPets(accessToken)
            .then((res) => {
                if (res.data instanceof Array) {
                    setPetList(res.data);
                }
            })
            .catch((e) => {
                // eslint-disable-next-line no-console
                console.log(e);
            });
    }

    const onAddPetClick = (): void => {
        setIsAddPetOpen(true);
    };

    useEffect(() => {
        getPetList();
    }, [ session, isAddPetOpen ]);

    useEffect(() => {
        router.replace(router.asPath);
    }, [ isUpdateViewOpen ]);

    const closeAddPetDialog = (): void => {
        setIsAddPetOpen(false);
    };

    return (
        <div
            className={ styles.tableMainPanelDivDoc }
        >
            <Stack
                direction="row"
                justifyContent="space-between">
                <Stack direction="column" alignItems="flex-start">
                    <h2>{ "Manage Pets" }</h2>
                    <p>{ "Manage pets of the user" }</p>
                </Stack>
                <Button
                    appearance="primary"
                    size="lg"
                    onClick={ onAddPetClick }
                >
                        Add Pet
                </Button>
            </Stack>
            <div className="doctor-grid-div">
                <Grid container spacing={ 2 }>
                    { petList && petList.map((pet) => (
                        <Grid
                            item
                            xs={ 4 }
                            sm={ 4 }
                            md={ 4 }
                            key={ pet.id }
                            onClick={ () => { setIsOverviewOpen(true); setPet(pet); } }>
                            <PetCard
                                session={ session }
                                petId={ pet.id }
                                petName={ pet.name }
                                breed={ pet.breed }
                                isUpdateViewOpen={ isUpdateViewOpen }
                            />
                        </Grid>
                    )) }
                </Grid>
            </div>
            <div>
                <AddPetComponent session={ session } open={ isAddPetOpen } onClose={ closeAddPetDialog } />
            </div>
            <div>
                <PetOverview
                    session={ session }
                    isOpen={ isOverviewOpen }
                    setIsOpen={ setIsOverviewOpen }
                    isUpdateViewOpen={ isUpdateViewOpen }
                    setIsUpdateViewOpen={ setIsUpdateViewOpen }
                    pet={ pet }
                />
            </div>

        </div>
    );
}
