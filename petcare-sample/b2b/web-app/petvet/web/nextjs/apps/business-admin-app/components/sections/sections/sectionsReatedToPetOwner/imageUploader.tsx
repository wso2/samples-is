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
import { updateThumbnail } from "apps/business-admin-app/APICalls/UploadThumbnail/put-thumbnail";
import { Session } from "next-auth";
import { ChangeEvent, useRef, useState } from "react";
import styles from "../../../../styles/doctor.module.css";


interface FileUploadProps {
    session: Session
    petId: string;
    imageUrl: any;
    setImageUrl: React.Dispatch<React.SetStateAction<any>>;
}

function FileUploadSingle(props: FileUploadProps) {
    const { petId, imageUrl, setImageUrl, session } = props;
    const [ file, setFile ] = useState<File>();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = async () => {
        if (!file) {
            return;
        }

        async function updateThumbnails() {
            const accessToken = session.accessToken;
            const formData = new FormData();

            formData.append(
                "file",
                file
            );
            const response = await updateThumbnail(accessToken, petId, formData);

            if (response.status === 200) {
                const accessToken = await session.accessToken;
                const response = await getThumbnail(accessToken, session.orgId, session.user.id, petId);

                if (response.data.size > 0) {
                    const imageUrl = URL.createObjectURL(response.data);

                    setImageUrl(imageUrl);
                }
            }
        }
        updateThumbnails();     
    };

    const hiddenFileInput = useRef(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    return (
        <><div className={ styles.docUploadBtnDiv }>
            <button onClick={ handleClick } className={ styles.docUploadBtnStyleSec }>
                Choose a file
            </button>
            <input
                type="file"
                ref={ hiddenFileInput }
                style={ { display: "none" } }
                onChange={ handleFileChange } />
            <label className={ styles.fileNameLabel }>{ file && `${file.name} - ${file.type}` }</label>    
        </div>
        <div className={ styles.docUploadBtnDivSec }>
            <button
                className={ styles.docUploadBtnStyleSec }
                onClick={ () => {
                    handleUploadClick();
                } }>Upload</button>
        </div></>
    );
}

export default FileUploadSingle;
