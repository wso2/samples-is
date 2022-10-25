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

import React, { useState } from "react";
import { Button, ButtonToolbar, Loader, Modal, Stack } from "rsuite";
import { LOADING_DISPLAY_BLOCK, LOADING_DISPLAY_NONE } from "../../util/util/frontendUtil/frontendUtil";
import { orgSignout } from "../../util/util/routerUtil/routerUtil";

export default function SignOutModal(prop) {

    const { session, open, onClose } = prop;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);

    const signOut = async () => {

        setLoadingDisplay(LOADING_DISPLAY_BLOCK);

        orgSignout(session);
    };

    return (
        <Modal backdrop="static" role="alertdialog" open={ open } onClose={ onClose } size="xs">
            <Modal.Header>
                <Modal.Title>
                    <b>You are about to logout</b>
                    <br />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Stack direction="column" alignItems="flex-start" spacing={ 20 }>
                    <p>Are you sure you want to logout, from your account ?</p>
                    <Stack>
                        <ButtonToolbar>
                            <Button
                                size="lg"
                                appearance="primary"
                                type="submit"
                                onClick={ signOut }>
                                Submit
                            </Button>

                            <Button
                                size="lg"
                                appearance="ghost"
                                type="button"
                            >Cancel</Button>
                        </ButtonToolbar>
                    </Stack>
                </Stack>
            </Modal.Body>

            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="User is logging out" vertical />
            </div>
        </Modal>
    );
}
