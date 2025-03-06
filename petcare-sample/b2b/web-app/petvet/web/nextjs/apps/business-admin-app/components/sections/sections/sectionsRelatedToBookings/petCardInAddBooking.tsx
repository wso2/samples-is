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

import { getThumbnail } from "apps/business-admin-app/APICalls/GetThumbnail/get-thumbnail";
import axios, { AxiosError } from "axios";
import { Session } from "next-auth";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import PET_IMAGE from "../../../../../../libs/business-admin-app/ui/ui-assets/src/lib/images/thumbnail.png";
import styles from "../../../../styles/booking.module.css";


interface PetCardProps {
    session: Session
    petId: string;
    petName: string;
    breed: string;
    isUpdateViewOpen: boolean;
}

function PetCardInAddBooking(props: PetCardProps) {
    const { session, petId, petName, breed, isUpdateViewOpen } = props;
    const [ url, setUrl ] = useState(null);

    async function getThumbnails() {
        const accessToken = session.accessToken;

        getThumbnail(accessToken, session.orgId, session.userId, petId)
            .then((res) => {
                if (res.data.size > 0) {
                    const imageUrl = URL.createObjectURL(res.data);

                    setUrl(imageUrl);
                }
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError;

                    if (axiosError.response?.status === 404) {
                        // eslint-disable-next-line no-console
                        console.log("Resource not found");
                        // Handle the 404 error here
                    } else {
                        // eslint-disable-next-line no-console
                        console.log("An error occurred:", axiosError.message);
                        // Handle other types of errors
                    }
                } else {
                    // eslint-disable-next-line no-console
                    console.log("An error occurred:", error);
                    // Handle other types of errors
                }
            });
    }

    useEffect(() => {
        getThumbnails();
    }, [ session, isUpdateViewOpen ]);

    return petName ? (
        <button className={ styles.petInAddBooking }>
            <div className={ styles.petIcon }>
                { url? (
                    <Image 
                        style={ { borderRadius: "10%", height: "100%",  width: "100%" } }
                        src={ url }
                        alt="pet-thumbnail"
                        width={ 10 }
                        height={ 10 }
                    />
                ): (
                    <Image
                        style={ { borderRadius: "10%", height: "100%",  width: "100%" } }
                        src={ PET_IMAGE }
                        alt="pet-thumbnail"
                    />
                ) } 
            </div>
            <div className={ styles.petSummary }>
                <label className={ styles.petTitleInCard }>{ petName }</label>
                <br />
                <label className={ styles.petSummaryInCard }>{ breed }</label>
                <br />
            </div>
        </button>
    ) : null;

}

export default React.memo(PetCardInAddBooking);
