/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { BasicUserInfo, useAuthContext } from "@asgardeo/auth-react";
import { Dialog, Transition } from "@headlessui/react";
import { Box, Grid, TextField } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { BillingInfo } from "../types/billing";
import { getUpgrade, postBilling, postUpgrade } from "../components/Billing/billing";
import { AddCard } from "@mui/icons-material";

interface BillingProps {
    user: BasicUserInfo;
    isUpgraded: boolean;
    setisUpgraded: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleBilling: () => Promise<AxiosResponse<BillingInfo, any>>;
}

export default function GetBilling(props: BillingProps) {
    const { user, isUpgraded, setisUpgraded, isOpen, setIsOpen, handleBilling } = props;
    const { getAccessToken } = useAuthContext();

    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [securityCode, setSecurityCode] = useState("");

    const handleOnSave = () => {
        async function setBilling() {
            if (cardName != "" && cardNumber != "" && expiryDate != "" && securityCode != "") {
                const accessToken = await getAccessToken();
                const payload: BillingInfo = {
                    cardName: cardName,
                    cardNumber: cardNumber,
                    expiryDate: expiryDate,
                    securityCode: securityCode
                };
                await postBilling(accessToken, payload);
                setIsOpen(false);
            }
        }
        setBilling();
    };

    const handleOnCancel = () => {
        setIsOpen(false);
    };

    async function setBillingInfo() {
        try {
            const handleLoginResponse = await handleBilling();
            setCardName(handleLoginResponse.data.cardName);
            setCardNumber(handleLoginResponse.data.cardNumber);
            setExpiryDate(handleLoginResponse.data.expiryDate);
            setSecurityCode(handleLoginResponse.data.securityCode);
            // Proceed with using handleLoginResponse if needed
            console.log('Billing handled successfully:', handleLoginResponse);
        } catch (error) {
            console.error('Error during billing process:', error);
            // Handle errors, possibly update UI or state accordingly
        }
        //remove the billing key from session storage
        sessionStorage.removeItem("billing");
    }
    const handleOnUpgrade = () => {
        async function setUpgrade() {
            if (cardName != "" && cardNumber != "" && expiryDate != "" && securityCode != "") {
                const accessToken = await getAccessToken();
                const payload: BillingInfo = {
                    cardName: cardName,
                    cardNumber: cardNumber,
                    expiryDate: expiryDate,
                    securityCode: securityCode
                };
                await postUpgrade(accessToken, user).then(async (result) => {
                    await postBilling(accessToken, payload);
                    setisUpgraded(true);
                }).catch((error) => {
                    console.log("Upgrade error: ", error);
                });
                setIsOpen(false);
            }
        }
        setUpgrade();
    };

    useEffect(() => {
        //if session strage has billing true, then open the billing dialog
        const billingExists = sessionStorage.getItem("billing") !== null;
        if (billingExists) {
            const billing = sessionStorage.getItem("billing");
            if (billing === "true") {
                setBillingInfo();
            }
        }
    });

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="billing-div"
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
                    <div className="settings-panel">
                        <Dialog.Panel>
                            <Dialog.Title
                                as="h4" className="settings-title-style">
                                <AddCard style={{ width: "4vh", height: "4vh"}}/> {"Payment Details"}
                            </Dialog.Title>
                            <div className="billing-form-div">
                                <div className="settings-grid">
                                    <Grid container spacing={1}>
                                        <Box
                                            component="form"
                                            sx={{
                                                '& > :not(style)': { m: 1, width: '25ch' },
                                            }}
                                            noValidate
                                            autoComplete="off"
                                        >
                                            <TextField
                                                id="cardNumber"
                                                label="Card Number"
                                                placeholder="0000 0000 0000 0000"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value)}
                                            />
                                        </Box>
                                        <Box
                                            component="form"
                                            sx={{
                                                '& > :not(style)': { m: 1, width: '25ch' },
                                            }}
                                            noValidate
                                            autoComplete="off"
                                        >
                                            <TextField
                                                id="cardName"
                                                label="Card Name"
                                                placeholder="Card Name"
                                                value={cardName}
                                                onChange={(e) => setCardName(e.target.value)}
                                            />
                                        </Box>
                                        <Box
                                            component="form"
                                            sx={{
                                                '& > :not(style)': { m: 1, width: '15ch' },
                                            }}
                                            noValidate
                                            autoComplete="off"
                                        >
                                            <TextField
                                                id="expiryDate"
                                                label="Expiry Date"
                                                placeholder="MM/YY"
                                                value={expiryDate}
                                                onChange={(e) => setExpiryDate(e.target.value)}
                                            />
                                        </Box>
                                        <Box
                                            component="form"
                                            sx={{
                                                '& > :not(style)': { m: 1, width: '10ch' },
                                            }}
                                            noValidate
                                            autoComplete="off"
                                        >
                                            <TextField
                                                id="securityCode"
                                                label="CVV"
                                                placeholder="000"
                                                value={securityCode}
                                                onChange={(e) => setSecurityCode(e.target.value)}
                                            />
                                        </Box>
                                    </Grid>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                {isUpgraded && <button className="billing-save-btn" onClick={() => handleOnSave()}>Save</button>}
                                {!isUpgraded && <button className="billing-upgrade-btn" onClick={() => handleOnUpgrade()}>Upgrade</button>}
                                <button className="cancel-btn" onClick={() => handleOnCancel()}>Cancel</button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>
        </>
    );

}
