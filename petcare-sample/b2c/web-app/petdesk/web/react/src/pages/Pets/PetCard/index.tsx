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

import { Card, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import PET_IMAGE from "../../../images/thumbnail.png";
import { useAuthContext } from "@asgardeo/auth-react";
import { getThumbnail } from "../../../components/GetThumbnail/get-thumbnail";


interface PetCardProps {
    petId: string;
    petName: string;
    breed: string;
    petThumbnail: any;
    setPetThumbnail: React.Dispatch<React.SetStateAction<any>>;
    isAuthenticated: boolean;
    setIsHomeLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isUpdateViewOpen: boolean;
}

function PetCard(props: PetCardProps) {
    const { petId, petName, breed, petThumbnail, setPetThumbnail, isAuthenticated, setIsHomeLoading, isUpdateViewOpen } = props;
    const { getAccessToken } = useAuthContext();
    const [url, setUrl] = useState(null);

    async function getThumbnails() {
        const accessToken = await getAccessToken();
        const response = await getThumbnail(accessToken, petId);
        if (response.data.size > 0) {
            const imageUrl = URL.createObjectURL(response.data);
            setUrl(imageUrl);
        }
    }

    useEffect(() => {
        getThumbnails();
    }, [isAuthenticated, isUpdateViewOpen]);

    return petName ? (
        <Card className="card-style" style={{borderRadius: "5%"}} >
            <CardContent>
                <div className="card-pet-image-style">
                    { url? (<img
                        style={{ width: "20vw", height: "20vw", borderRadius: "10%" }}
                        src={url}
                        alt="pet-image"
                    />) :(
                        <img
                        style={{ width: "20vw", height: "20vw", borderRadius: "10%"}}
                        src={PET_IMAGE}
                        alt="pet-image"
                    />
                    )}
                </div>
                <label className="card-typo-style">{petName}</label>
                <label className="breed-style">{breed}</label>
            </CardContent>
        </Card>
    ) : null;

}

export default React.memo(PetCard);