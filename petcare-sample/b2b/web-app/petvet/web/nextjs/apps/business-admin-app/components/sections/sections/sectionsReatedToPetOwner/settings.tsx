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

import { Grid, Switch } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { getNotification } from "apps/business-admin-app/APICalls/Notifications/get-notification";
import { postNotification } from "apps/business-admin-app/APICalls/Notifications/post-notification";
import { Notifications } from "apps/business-admin-app/types/pets";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { Stack } from "rsuite";
import styles from "../../../../styles/doctor.module.css";

interface SettingsSectionProps {
    session: Session
}

/**
 * 
 * @param prop - session
 * 
 * @returns The idp interface section.
 */
export default function SettingsSection(props: SettingsSectionProps) {

    const { session } = props;
    const [ enabled, setEnabled ] = useState(false);
    const [ email, setEmail ] = useState("");

    const CustomSwitch = styled(Switch)(({ theme }) => ({
        "& .MuiSwitch-switchBase.Mui-checked": {
            color: "var(--primary-color)",
            "&:hover": {
                backgroundColor: alpha("var(--primary-color)", theme.palette.action.hoverOpacity)
            }
        },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
            backgroundColor: "var(--primary-color)"
        }
    }));

    const getSettings = () => {
        async function getNotifications() {
            const accessToken = session.accessToken;
            const response = await getNotification(accessToken, session.orgId, session.userId, session.user.emails[0]);

            if (response) {
                setEnabled(response.data.notifications.enabled);
                setEmail(response.data.notifications.emailAddress);
            }
        }
        getNotifications();
    };

    const toggleSwitch = () => {
        setEnabled(!enabled);
    };

    useEffect(() => {
        getSettings();
    }, [ session ]);

    const handleSave = () => {
        async function setNotification() {
            const accessToken = session.accessToken;
            const payload: Notifications = {
                notifications: {
                    enabled: enabled,
                    emailAddress: email
                }
            };
            const response = await postNotification(accessToken, session.orgId, session.user.id, payload);
        }
        setNotification();
    };


    return (
        <div
            className={ styles.tableMainPanelDivDoc }
        >
            <Stack
                direction="row"
                justifyContent="space-between">
                <Stack direction="column" alignItems="flex-start">
                    <h2>{ "Settings" }</h2>
                    <p>{ "Settings to enable notifications" }</p>
                </Stack>
            </Stack>
            <div className={ styles.notificationDiv }>
                <div className={ styles.notificationHeader }>
                    Notifications
                </div>
                <div className={ styles.settingsGrid }>
                    <Grid container spacing={ 2 }>
                        <Grid item xs={ 6 } style={ { textAlign: "right", fontSize: "2.5vh" } }>
                            <label>Enable</label>
                        </Grid>
                        <Grid item xs={ 6 } style={ { textAlign: "left", fontSize: "2.5vh" } }>
                            <CustomSwitch
                                checked={ enabled }
                                onChange={ toggleSwitch }
                                className="switch-style"
                            />
                        </Grid>
                        <Grid item xs={ 6 } style={ { textAlign: "right", fontSize: "2.5vh" } }>
                            <label>Email Address</label>
                        </Grid>
                        <Grid item xs={ 6 } style={ { textAlign: "left", fontSize: "2.5vh" } }>
                            <input
                                className={ styles.settingsEmailInputStyle }
                                id="email"
                                type="text"
                                placeholder={ email }
                                defaultValue={ session.user?.emails[0] }
                                onChange={ (e) => setEmail(e.target.value) }
                            />
                        </Grid>
                    </Grid>
                </div>
                <div className={ styles.container }>
                    <button 
                        className={ styles.settingsSaveBtn } 
                        onClick={ handleSave }>Save</button>
                </div>
            </div>
        </div>
    );
}
