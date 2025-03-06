/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { ModelHeaderComponent } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { LOADING_DISPLAY_NONE } from "@pet-management-webapp/shared/util/util-front-end-util";
import { postBooking } from "apps/business-admin-app/APICalls/CreateBooking/post-booking";
import { BookingInfo } from "apps/business-admin-app/types/booking";
import { Availability, Doctor } from "apps/business-admin-app/types/doctor";
import { Pet } from "apps/business-admin-app/types/pets";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { Button, Loader, Modal, Radio, RadioGroup } from "rsuite";
import styled from "styled-components";
import PetCardInAddBooking from "./petCardInAddBooking";
import convertTo12HourTime from "./timeConverter";
import styles from "../../../../styles/booking.module.css";
import { IdentityProviderConfigureType } from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";

interface buttonProps {
    isDisabled: boolean;
}

const ButtonABC = styled.button<buttonProps>`
background-color: var(--primary-color);
color: #ffffff;
border: none;
width: 7vw;
height: 5vh;
border-radius: 5px;
font-size: 2vh;
color: ${props => props.isDisabled ? "#727372" : "#ffffff"};
background-color: ${props => props.isDisabled ? "#cacccb" : "var(--primary-color)"};
`;

const CancelButton = styled.button`
background-color: #cacccb;
color: #727372;
border: none;
width: 7vw;
height: 5vh;
border-radius: 5px;
font-size: 2vh;
`;

export interface AddBookingsProps {
    session: Session
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    doctor: Doctor;
    petList: Pet[];
}

export default function AddBookings(props: AddBookingsProps) {
    const { session, isOpen, setIsOpen, doctor, petList } = props;
    const [ availability, setAvailability ] = useState<Availability[] | null>(null);
    const [ availabilityInfo, setAvailabilityInfo ] = useState<Availability | null>(null);
    const [ pet, setPet ] = useState<Pet | null>(null);
    const [ activeStep, setActiveStep ] = React.useState(0);
    const [ mobileNumber, setMobileNumber ] = React.useState("");
    const [ petOwner, setPetOwner ] = React.useState("");
    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const steps = [ "Time Selection", "Pet Selection", "Users Info" ];
    const [ completed, setCompleted ] = React.useState<{
        [k: number]: boolean;
    }>({});

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };


    const handleClose = () => {
        setIsOpen(false);
        setActiveStep(0);
        setAvailabilityInfo(null);
        setPet(null);
    };

    useEffect(() => {
        setAvailability(doctor?.availability);
        
    }, [ isOpen ]);

    const handleOnTimeSlotClick = (value: number) => {
        setAvailabilityInfo(availability[value]);
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (availabilityInfo != null) {
                const newActiveStep =
                    isLastStep() && !allStepsCompleted()
                        ? // It's the last step, but not all steps have been completed,
                        // find the first step that has been completed
                        steps.findIndex((step, i) => !(i in completed))
                        : activeStep + 1;

                setActiveStep(newActiveStep);

            }
        } else if (activeStep === 1) {
            if (pet != null) {
                const newActiveStep =
                    isLastStep() && !allStepsCompleted()
                        ? // It's the last step, but not all steps have been completed,
                        // find the first step that has been completed
                        steps.findIndex((step, i) => !(i in completed))
                        : activeStep + 1;

                setActiveStep(newActiveStep);
            }
        }
    };

    const handleFinish = async () => {
        async function addBooking() {
            const accessToken = session.accessToken;
            const payload: BookingInfo = {
                date: availabilityInfo.date,
                doctorId: doctor.id,
                mobileNumber: mobileNumber,
                petDoB: pet.dateOfBirth,
                petId: pet.id,
                petName: pet.name,
                petOwnerName: petOwner,
                petType: pet.breed,
                sessionEndTime: availabilityInfo.timeSlots[0].endTime,
                sessionStartTime: availabilityInfo.timeSlots[0].startTime
            };

            postBooking(accessToken, payload);
        }
        addBooking();
        await timeout(150);
        setIsOpen(false);
        setActiveStep(0);
        setAvailabilityInfo(null);
        setPet(null);
    };

    const handleDialogClose = () => {
        setIsOpen(false);
    };

    return (
        <Modal 
            backdrop="static" 
            role="alertdialog" 
            open={ isOpen } 
            onClose={ handleDialogClose } 
            size="sm"
            className={ styles.doctorOverviewMainDiv }
        >

            <Modal.Header>
                <ModelHeaderComponent title="Channel a Doctor" />
            </Modal.Header>

            <Modal.Body style={ { overflow:"hidden" } }>
                <div className={ styles.channelDocMainDiv }>

                    <div className={ styles.addBookingFormDiv }>
                        { activeStep === 0 && (
                            <><div className={ styles.chooseTimeHeader }>
                                        Choose a time slot
                            </div><div className="timeslot-div">
                            
                                <RadioGroup onChange={ handleOnTimeSlotClick }>
                                    { availability && availability.map((availabilityInfo, index) => (
                                        <Radio key={ index } value={ index } >
                                            { availabilityInfo.date + " , " + 
                                                convertTo12HourTime(availabilityInfo.timeSlots[0].startTime) + " - " + 
                                                convertTo12HourTime(availabilityInfo.timeSlots[0].endTime) }
                                        </Radio>
                                    )) }
                                </RadioGroup>
                                { availability?.length === 0 && (
                                    <div className={ styles.docUnavailableDiv }>
                                                    Doctor is currently unavailable.
                                    </div>
                                ) }
                            </div></>
                        ) }
                        { activeStep === 1 && (
                            <>
                                <div className={ styles.chooseTimeHeader }>
                                            Choose your pet
                                </div>
                                <div className={ styles.petsDiv }>
                                    <Grid container spacing={ 2 }>
                                        { petList && petList.map((pet) => (
                                            <Grid
                                                item
                                                xs={ 6 }
                                                sm={ 6 }
                                                md={ 6 }
                                                key={ pet.id }
                                                onClick={ (e) => { e.preventDefault(); setPet(pet); } }>
                                                <PetCardInAddBooking
                                                    session={ session }
                                                    petId={ pet.id }
                                                    petName={ pet.name }
                                                    breed={ pet.breed }
                                                    isUpdateViewOpen={ false }
                                                />
                                            </Grid>
                                        )) }
                                    </Grid>
                                </div>
                            </>
                        ) }
                        { activeStep === 2 && (
                            <div className={ styles.timeslotDiv }>
                                <div className={ styles.alignLeft }>
                                    <div className={ styles.labelStyle  }>
                                        <label
                                            style={ { fontSize: "2.5vh", 
                                                fontWeight: "normal" } }>
                                            { "Mobile Number (Optional)" }
                                        </label>
                                    </div>
                                    <input
                                        className={ styles.inputStyle2 }
                                        id="Mobile Number"
                                        type="text"
                                        placeholder="Mobile Number"
                                        onChange={ (e) => setMobileNumber(e.target.value) }
                                    />
                                </div>
                            </div>
                        ) }
                    </div>
                    
                </div>
            </Modal.Body>
            <Modal.Footer>
                { activeStep === 0 && (
                    <><div className={ styles.nextBtnDiv }>
                        <Button 
                            appearance="primary"
                            disabled={ availabilityInfo === null ? true : false }
                            onClick={ handleNext }
                            style={ {
                                borderRadius: "5px",
                                height: "5vh",
                                padding: "2px",
                                width: "7vw"
                            } }
                        >
                            Next
                        </Button>
                    </div><div className={ styles. cancelBtnDiv }>
                        <Button 
                            appearance="ghost"
                            onClick={ handleClose }
                            style={ {
                                borderRadius: "5px",
                                height: "5vh",
                                padding: "2px",
                                width: "7vw"
                            } }
                        >
                            Cancel
                        </Button>
                    </div></>
                ) }
                { activeStep === 1 && (
                    <><div className={ styles.nextBtnDiv }>
                        <ButtonABC
                            isDisabled={ pet === null ? true : false }
                            onClick={ handleNext }>
                                        Next
                        </ButtonABC>
                    </div><div className={ styles. cancelBtnDiv }>
                        <CancelButton onClick={ handleClose }>
                                            Cancel
                        </CancelButton>
                    </div></>
                ) }
                { activeStep === 2 && (
                    <><div className={ styles.nextBtnDiv }>
                        <ButtonABC
                            isDisabled={ pet === null ? true : false }
                            onClick={ handleFinish }>
                                        Finish
                        </ButtonABC>
                    </div><div className={ styles. cancelBtnDiv }>
                        <CancelButton onClick={ handleClose }>
                                            Cancel
                        </CancelButton>
                    </div></>
                ) }

            </Modal.Footer>

            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="Booking is adding" vertical />
            </div>
        </Modal>
    );
}
