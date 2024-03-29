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

import { useAuthContext } from '@asgardeo/auth-react';
import React from 'react';
import { ChangeEvent, useState } from 'react';
import { updateThumbnail } from '../../components/UploadThumbnail/put-thumbnail';
import { getThumbnail } from '../../components/GetThumbnail/get-thumbnail';

interface FileUploadProps {
    petId: string;
    imageUrl: any;
    setImageUrl: React.Dispatch<React.SetStateAction<any>>;
}

function FileUploadSingle(props: FileUploadProps) {
    const {petId, imageUrl, setImageUrl} = props;
    const [file, setFile] = useState<File>();
    const { getAccessToken } = useAuthContext();

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
            const accessToken = await getAccessToken();
            const formData = new FormData();
            formData.append(
                "file",
                file
            );
            const response = await updateThumbnail(accessToken, petId, formData);
            if (response.status === 200) {
                const accessToken = await getAccessToken();
                const response = await getThumbnail(accessToken, petId);
                if (response.data.size > 0) {
                    const imageUrl = URL.createObjectURL(response.data);
                    setImageUrl(imageUrl);
                }
            }
        }
        updateThumbnails();     
    };

    const hiddenFileInput = React.useRef(null);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };

    return (
        <><div className='upload-btn-div'>
            <button onClick={handleClick} className='upload-btn-style-sec'>
                Choose a file
            </button>
            <input type="file"
                ref={hiddenFileInput}
                style={{ display: 'none' }}
                onChange={handleFileChange} />
            <label className='file-name-label'>{file && `${file.name} - ${file.type}`}</label>    
        </div>
            {/* <div className='file-upload-name'>
                <label className='file-name-label'>{file && `${file.name} - ${file.type}`}</label>
            </div> */}
        <div className='upload-btn-div-sec'>
                <button className='upload-btn-style-sec' onClick={() => {
                    handleUploadClick();
                }}>Upload</button>
            </div></>
    );
}

export default FileUploadSingle;