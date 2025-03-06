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

import { List, ListItem, ListItemIcon, ListItemText, Menu, Typography } from "@mui/material";
import React from "react";
import GetSettings from "../pages/settings";
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { BasicUserInfo, useAuthContext } from "@asgardeo/auth-react";
import { getNotification } from "./Notifications/get-notification";
import GetBilling from "../pages/billing";
import { getBilling, getUpgrade } from "./Billing/billing";
import { AddCard } from "@mui/icons-material";
import { getConfig } from "../util/getConfig";

export default function MenuListComposition(props: {
    user: BasicUserInfo;
    signout: (callback?: (response: boolean) => void) => Promise<boolean>;
    setIsBillingWariningOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isUpgraded: boolean;
    setisUpgraded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const { isUpgraded, setisUpgraded, user, signout, setIsBillingWariningOpen } = props;
    const [userMenuOpen, setUserMenuOpen] = React.useState(false);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [billingOpen, setBillingOpen] = React.useState(false);
    const { getAccessToken } = useAuthContext();
    const [enabled, setEnabled] = React.useState(false);
    const [email, setEmail] = React.useState(user.email);

    const handleToggle = () => {
        setUserMenuOpen((prevOpen) => !prevOpen);
    };


    const handleLogout = () => {
        signout();
    };

    const handleClose = () => {
        setUserMenuOpen(false);
    };

    const getSettings = () => {
        async function getNotifications() {
            const accessToken = await getAccessToken();
            const response = await getNotification(accessToken);
            if (response) {
                setEnabled(response.data.notifications.enabled);
                setEmail(response.data.notifications.emailAddress);
            }
        }
        getNotifications();
    };

    const gotoMyAccount = () => {
        window.open(getConfig().myAccountAppURL, '_blank');
    };

    async function handleBilling() {
        const accessToken = await getAccessToken();
        return getBilling(accessToken)
        .then((res) => {
            setBillingOpen(true);
            return Promise.resolve(res);
        })
        .catch((e) => {
            setIsBillingWariningOpen(true);
            return Promise.reject(e);
        });    
    }

    return (
        <><div className="user-menu-div">
            <button className="menu-btn" onClick={handleToggle}>
                <label className="usename-label">
                    {user.displayName||user.username}
                </label>
                <i className="arrow-down"></i>
            </button>
            <Menu
                id="menu-appbar"
                anchorOrigin={{ vertical: 70, horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={userMenuOpen}
                onClose={handleClose}
                className="menu-style"
            >
                <List className="list-style">
                    <ListItem
                        button
                        className="nav-list-item"
                        component="nav"
                        disabled={!isUpgraded}
                        disableGutters
                        onClick={() => { setSettingsOpen(true); setUserMenuOpen(false); getSettings();}}
                        data-testid="header-user-profile-settings"
                    >
                        <ListItemIcon>
                            <MiscellaneousServicesIcon style={{ width: "3vh", height: "3vh" }}/>
                        </ListItemIcon>
                        <ListItemText
                            disableTypography
                            primary={<Typography variant="body2" style={{ color: 'black', fontSize: "16px", fontFamily: "montserrat" }}>Settings</Typography>}
                        />
                    </ListItem>
                    <ListItem
                        button
                        component="nav"
                        disableGutters
                        onClick={gotoMyAccount}
                        data-testid="header-user-profile-item-logout"
                    >
                        <ListItemIcon>
                            <AccountCircleIcon style={{ width: "3vh", height: "3vh" }}/>
                        </ListItemIcon>
                        <ListItemText
                            disableTypography
                            primary={<Typography variant="body2" style={{ color: 'black', fontSize: "16px", fontFamily: "montserrat"}}>MyAccount</Typography>}
                        />
                    </ListItem>
                    <ListItem
                        button
                        className="nav-list-item"
                        component="nav"
                        disableGutters
                        onClick={() => { setUserMenuOpen(false); sessionStorage.setItem("billing", "true");}}
                        data-testid="header-user-profile-settings"
                    >
                        <ListItemIcon>
                            <AddCard style={{ width: "3vh", height: "3vh" }}/>
                        </ListItemIcon>
                        <ListItemText
                            disableTypography
                            primary={<Typography variant="body2" style={{ color: 'black', fontSize: "16px", fontFamily: "montserrat" }}>Billing</Typography>}
                        />
                    </ListItem>
                    <ListItem
                        button
                        component="nav"
                        disableGutters
                        onClick={handleLogout}
                        data-testid="header-user-profile-item-logout"
                    >
                        <ListItemIcon>
                            <LogoutIcon style={{width: "3vh", height: "3vh"}}/>
                        </ListItemIcon>
                        <ListItemText
                            disableTypography
                            primary={<Typography variant="body2" style={{ color: 'black', fontSize: "16px", fontFamily: "montserrat"}}>Logout</Typography>}
                        />
                    </ListItem>
                </List>
            </Menu>
        </div>
            <div>
                <GetSettings isOpen={settingsOpen} setIsOpen={setSettingsOpen}
                    enabled={enabled} email={email} setEnabled={setEnabled} setEmail={setEmail} />
            </div>
            <div>
                <GetBilling isUpgraded={isUpgraded} setisUpgraded={setisUpgraded} user={user} handleBilling={handleBilling} isOpen={billingOpen} setIsOpen={setBillingOpen} />
            </div>
        </>
    );
}
