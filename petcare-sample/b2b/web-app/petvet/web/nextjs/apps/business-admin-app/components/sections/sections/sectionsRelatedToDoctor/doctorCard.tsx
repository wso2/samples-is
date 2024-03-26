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

import { Card, CardContent } from "@mui/material";
import axios, { AxiosError } from "axios";
import { Session } from "next-auth";
import Image from "next/image";
import React, { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
// eslint-disable-next-line max-len
import female_doc_thumbnail from "../../../../../../libs/business-admin-app/ui/ui-assets/src/lib/images/female-doc-thumbnail.png";
// eslint-disable-next-line max-len
import male_doc_thumbnail from "../../../../../../libs/business-admin-app/ui/ui-assets/src/lib/images/male-doc-thumbnail.png";
import { getDocThumbnail } from "../../../../APICalls/GetDocThumbnail/get-doc-thumbnail";
import styles from "../../../../styles/doctor.module.css";
import { Doctor } from "../../../../types/doctor";

interface DoctorCardProps {
    session: Session;
    doctor: Doctor;
    isDoctorEditOpen: boolean;
}

function DoctorCard(props: DoctorCardProps) {
    const { doctor, isDoctorEditOpen, session } = props;
    const [ url, setUrl ] = React.useState("");
    const [ isLoading, setIsLoading ] = React.useState(true);

    async function getThumbnails() {
        const accessToken = session.accessToken;

        if (doctor) {
            getDocThumbnail(accessToken, doctor.id)
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
                        } else {
                        // eslint-disable-next-line no-console
                            console.log("An error occurred:", axiosError.message);
                        }
                    } else {
                    // eslint-disable-next-line no-console
                        console.log("An error occurred:", error);
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }

    useEffect(() => {
        setUrl(null);
        setIsLoading(true);
        getThumbnails();
    }, [ location.pathname === "/manage_doctors", isDoctorEditOpen ]);

    return (
        <>
            <Card className={ styles.doctorCard }>
                <CardContent>
                    { isLoading ? (
                        <div className={ styles.tailSpinDiv }>
                            <TailSpin color="var(--primary-color)" height={ 80 } width={ 80 } />
                        </div>
                    ) : (
                        <><div className={ styles.doctorIcon }>
                            { url ? (
                                <Image
                                    style={ { borderRadius: "10%", height: "100%", width: "100%" } }
                                    src={ url }
                                    alt="doc-thumbnail"
                                    width={ 10 }
                                    height={ 10 } />
                            ) : (
                                <Image
                                    style={ { borderRadius: "10%", height: "100%", width: "100%" } }
                                    src={ doctor.gender?.toLowerCase() === "male" ? 
                                        male_doc_thumbnail : male_doc_thumbnail }
                                    alt="doc-thumbnail" />

                            ) }
                        </div><div className={ styles.doctorSummary }>
                            <label className={ styles.docTitleInCard }>{ doctor.name }</label>
                            <br />
                            <label className={ styles.docSummaryInCard }>{ doctor.specialty }</label>
                            <br />
                        </div></>

                    ) }
                </CardContent>
            </Card>
        </>
    );

}

export default React.memo(DoctorCard);
