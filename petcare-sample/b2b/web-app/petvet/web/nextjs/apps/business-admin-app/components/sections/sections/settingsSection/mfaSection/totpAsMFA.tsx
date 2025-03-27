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

import {
    Application, ApplicationList, checkIfAuthenticatorIsinAuthSequence
} from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import {
    controllerDecodeGetApplication, controllerDecodeListCurrentApplication
} from "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { TOTP, TOTP_OTP_AUTHENTICATOR, checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import ConfirmMFAAddRemoveModal from "./confirmMFAAddRemoveModal";
import MFAProviderCard from "./mfaProviderCard";
import { getImageForMFAProvider } from "./mfaProviderUtils";

interface TotpAsMFAProps {
    session: Session,
    id: string
}


export default function TotpAsMFA(props: TotpAsMFAProps) {

    const { session } = props;

    const [ allApplications, setAllApplications ] = useState<ApplicationList>(null);
    const [ applicationDetail, setApplicationDetail ] = useState<Application>(null);
    const [ idpIsinAuthSequence, setIdpIsinAuthSequence ] = useState<boolean>(null);
    const [ openModal, setOpenModal ] = useState<boolean>(false);

    const fetchApplications = useCallback(async () => {
        const res = (await controllerDecodeListCurrentApplication(session)) as ApplicationList;
        
        setAllApplications(res);
    }, [ session ]);

    const fetchApplicationDetail = useCallback(async () => {
        if (!checkIfJSONisEmpty(allApplications) && allApplications.totalResults !== 0) {
            
            const res = (await controllerDecodeGetApplication(
                session,
                allApplications.applications[0].id
            )) as Application;
            
            setApplicationDetail(res);
        }
    }, [ session, allApplications ]);

    useEffect(() => {
        fetchApplications();
    }, [ fetchApplications ]);

    useEffect(() => {
        fetchApplicationDetail();
    }, [ fetchApplicationDetail ]);

    useEffect(() => {
        if (!checkIfJSONisEmpty(applicationDetail)) {
            const check = checkIfAuthenticatorIsinAuthSequence(applicationDetail, TOTP_OTP_AUTHENTICATOR);

            setIdpIsinAuthSequence(check[0]);
        }
    }, [ applicationDetail ]);

    const handleModalOpen = (): void => setOpenModal(true);
    const handleModalClose = async (): Promise<void> => {
        setOpenModal(false);
      
        await fetchApplicationDetail();
    };

    return (
        <div style={ { padding: "24px" } }>
            <MFAProviderCard
                imageSrc={ getImageForMFAProvider(TOTP) }
                title="TOTP"
                description="Configure TOTP as multi-factor authentication."
                isActive={ idpIsinAuthSequence }
                onClick={ handleModalOpen }
            />
            <ConfirmMFAAddRemoveModal
                session={ session }
                openModal={ openModal }
                onModalClose={ handleModalClose }
                applicationDetail={ applicationDetail }
                idpIsinAuthSequence={ idpIsinAuthSequence }
                authenticator={ TOTP_OTP_AUTHENTICATOR } />
        </div>

    );
}
