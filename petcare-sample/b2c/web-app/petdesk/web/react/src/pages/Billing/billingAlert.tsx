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

import React from "react";
import sessionCleanupUtil from "../../util/session-cleanup-util";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

export interface AddPetProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setInvokeLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BillingAlert(props: AddPetProps) {
    const { isOpen, setIsOpen, setInvokeLogin } = props;

    const handleOnSave = () => {
        sessionCleanupUtil();
        setInvokeLogin(true);
    };

    const handleClose = () => {
        sessionStorage.removeItem("billing");
        setIsOpen(false);
    };

    return (
        <React.Fragment>
          <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Authentication Required"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                We need to verify your identity for this sensitive action.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleOnSave} autoFocus>
                Continue
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      );

}


