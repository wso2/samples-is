/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { Card, CardContent, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import { OrgInfo, UpdateOrgInfo } from "apps/business-admin-app/types/doctor";
import { useEffect, useState } from "react";

interface OrgProfileCardProps {
  orgInfo: OrgInfo | null;
  session: any;
  onSave: (payload: UpdateOrgInfo) => void;
  onCancel: () => void;
}

export default function OrgProfileCard({ orgInfo, session, onSave, onCancel }: OrgProfileCardProps) {
    const [ edit, setEdit ] = useState(false);
    const [ regNo, setRegNo ] = useState("");
    const [ orgAddress, setOrgAddress ] = useState("");
    const [ telephoneNo, setTelephoneNo ] = useState("");

    useEffect(() => {
        setRegNo(orgInfo?.registrationNumber || "");
        setOrgAddress(orgInfo?.address || "");
        setTelephoneNo(orgInfo?.telephoneNumber || "");
    }, [ orgInfo ]);

    const handleSave = () => {
        const payload: UpdateOrgInfo = {
            address: orgAddress,
            name: session.orgName,
            registrationNumber: regNo,
            telephoneNumber: telephoneNo
        };
        
        onSave(payload);
        setEdit(false);
    };

    const handleCancel = () => {
        onCancel();
        setEdit(false);
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Organization Profile</Typography>
                    { edit ? (
                        <Stack direction="row" spacing={ 1 }>
                            <IconButton onClick={ handleCancel }>
                                <CloseIcon color="primary" />
                            </IconButton>
                            <IconButton onClick={ handleSave }>
                                <CheckIcon color="primary" />
                            </IconButton>
                        </Stack>
                    ) : (
                        <IconButton onClick={ () => setEdit(true) }>
                            <EditIcon color="primary" />
                        </IconButton>
                    ) }
                </Stack>

                <Grid container spacing={ 2 } mt={ 1 }>
                    <Grid item xs={ 12 } sm={ 6 }>
                        <TextField
                            label="Organization Name"
                            fullWidth
                            value={ session.orgName }
                            InputProps={ { readOnly: !edit } }
                        />
                    </Grid>
                    <Grid item xs={ 12 } sm={ 6 }>
                        <TextField
                            label="Registration Number"
                            fullWidth
                            value={ regNo }
                            onChange={ (e) => setRegNo(e.target.value) }
                            InputProps={ { readOnly: !edit } }
                        />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <TextField
                            label="Address"
                            fullWidth
                            value={ orgAddress }
                            onChange={ (e) => setOrgAddress(e.target.value) }
                            InputProps={ { readOnly: !edit } }
                        />
                    </Grid>
                    <Grid item xs={ 12 } sm={ 6 }>
                        <TextField
                            label="Telephone Number"
                            fullWidth
                            value={ telephoneNo }
                            onChange={ (e) => setTelephoneNo(e.target.value) }
                            InputProps={ { readOnly: !edit } }
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
