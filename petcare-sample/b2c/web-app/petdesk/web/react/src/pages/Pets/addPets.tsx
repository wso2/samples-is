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

import React, { useEffect, useRef, useState } from "react";
import Model from "./model";
import FileUploadSingle from "./fileUploader";
import { updatePetInfo } from "../../types/pet";
import { useAuthContext } from "@asgardeo/auth-react";
import { postPet } from "../../components/CreatePet/post-pet";

export interface AddPetProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddPets(props: AddPetProps) {
    const { isOpen, setIsOpen } = props;
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [DoB, setDoB] = useState("");
    const { getAccessToken } = useAuthContext();
    const dateInputRef = useRef(null);
    let count = 0;

    useEffect(() => {
        setName("");
        setType("");
        setDoB("");
      }, [isOpen]);


    const handleOnSave = () => {
        count++;
        async function setPets() {
            if (name != "" && type != "" && DoB != "" && count == 1) {
                const accessToken = await getAccessToken();
                const payload: updatePetInfo = {
                    name: name,
                    breed: type,
                    dateOfBirth: DoB,
                    vaccinations: []
                };
                const response = await postPet(accessToken, payload);
                setIsOpen(false);
                if(!isOpen){
                    count=0;
                }
            }
        }
        setPets();
    };

    const innerFragment = (
        <div>
            <form>
                <div className="align-left">
                    <div className="label-style">
                        <label style={{fontSize: "3vh"}}>
                            Name
                        </label>
                    </div>
                    <input
                        className="input-style-2"
                        id="name"
                        type="text"
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="align-left">
                    <div className="label-style">
                        <label style={{fontSize: "3vh"}}>
                            Type
                        </label>
                    </div>
                    <input
                        className="input-style-2"
                        id="type"
                        type="text"
                        placeholder="Type"
                        onChange={(e) => setType(e.target.value)}
                    />
                </div>
                <div className="align-left">
                    <div className="label-style">
                        <label style={{fontSize: "3vh"}}>
                            Date of Birth
                        </label>
                    </div>
                    <input
                        className="input-style-2"
                        id="DoB"
                        type="date"
                        ref={dateInputRef}
                        placeholder="Date of Birth"
                        onChange={(e) => setDoB(e.target.value)}
                    />
                </div>
            </form>
        </div>
    )

    return (
        <Model
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Add Pet"
            // eslint-disable-next-line react/no-children-prop
            children={innerFragment}
            handleSave={handleOnSave}
            isDisabled={!(name && DoB && type)}
        />
    );

}