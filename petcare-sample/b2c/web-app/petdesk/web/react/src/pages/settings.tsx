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

import { useAuthContext } from "@asgardeo/auth-react";
import { Dialog, Transition } from "@headlessui/react";
import { Grid, Switch } from "@mui/material";
import { alpha, styled } from '@mui/material/styles';
import React, { Fragment } from "react";
import { Notification } from "../types/pet";
import { postNotification } from "../components/Notifications/post-notification";


interface SettingsProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    enabled: boolean;
    email: string;
    setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
}

export default function GetSettings(props: SettingsProps) {
    const { isOpen, setIsOpen, enabled, email, setEnabled, setEmail } = props;
    const { getAccessToken } = useAuthContext();

    const CustomSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: "#09b6d0",
          '&:hover': {
            backgroundColor: alpha("#09b6d0", theme.palette.action.hoverOpacity),
          },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: "#09b6d0",
        },
      }));

    const toggleSwitch = () => {
        setEnabled(!enabled);
    }

    const handleOnSave = () => {
        async function setNotification() {
            const accessToken = await getAccessToken();
            const payload: Notification = {
                notifications: {
                    enabled: enabled,
                    emailAddress: email
                }
            };
            const response = await postNotification(accessToken, payload);
        }
        setNotification();
        setIsOpen(false);
    };



    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="settings-div"
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
                                as="h3" className="settings-title-style">
                                {"Settings"}
                            </Dialog.Title>
                            <div className="notification-div">
                                <label className="notification-label">Notifications</label>
                                <div className="settings-grid">
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} style={{ textAlign: "right", fontSize: "2.7vh" }}>
                                            <label>Enable</label>
                                        </Grid>
                                        <Grid item xs={6} style={{ textAlign: "left", fontSize: "2.7vh" }}>
                                            <CustomSwitch
                                                checked={enabled}
                                                onChange={toggleSwitch}
                                                className="switch-style"
                                            />
                                        </Grid>
                                        <Grid item xs={6} style={{ textAlign: "right", fontSize: "2.7vh" }}>
                                            <label>Email Address</label>
                                        </Grid>
                                        <Grid item xs={6} style={{ textAlign: "left", fontSize: "2.7vh" }}>
                                            <input
                                                className="input-style"
                                                id="email"
                                                type="text"
                                                placeholder={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                            <button className="settings-save-btn" onClick={() => handleOnSave()}>Save</button>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>
        </>
    );

}