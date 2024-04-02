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

import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import "./pets.css";

interface ModalProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    children: JSX.Element;
    handleSave: () => void;
    isDisabled: boolean;
  }

export default function Model(props: ModalProps) {
    const { isOpen, setIsOpen, title, children, handleSave, isDisabled } =
    props;

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="center-outline-blue"
                    onClose={() => setIsOpen(false)}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div />
                    </Transition.Child>
                    <div className="align-title">
                        <Dialog.Panel>
                            <Dialog.Title
                                as="h3" className="add-pet-div">
                                {title}
                            </Dialog.Title>
                            <div className="child-div">{children}</div>
                            <div className="save-btn-div">
                                <button  className="save-btn-style" disabled={isDisabled} onClick={() => handleSave()}>
                                    Save
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}