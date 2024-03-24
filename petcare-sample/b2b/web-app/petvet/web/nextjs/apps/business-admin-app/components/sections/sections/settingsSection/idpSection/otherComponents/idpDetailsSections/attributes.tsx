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

import {
    IdentityProvider, IdentityProviderGroupMappings, LocalClaim
} from "@pet-management-webapp/business-admin-app/data-access/data-access-common-models-util";
import { 
    controllerDecodeGetIdentityProviderGroupMappings, 
    controllerDecodeGetLocalClaims, 
    controllerDecodePatchIdpClaims 
}
    from "@pet-management-webapp/business-admin-app/data-access/data-access-controller";
import { FormButtonToolbar, FormField } from "@pet-management-webapp/shared/ui/ui-basic-components";
import { checkIfJSONisEmpty } from "@pet-management-webapp/shared/util/util-common";
import { LOADING_DISPLAY_NONE }
    from "@pet-management-webapp/shared/util/util-front-end-util";
import AddOutlineIcon from "@rsuite/icons/AddOutline";
import CloseIcon from "@rsuite/icons/Close";
import { id } from "date-fns/locale";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { Input, Loader, SelectPicker } from "rsuite";
import FormSuite from "rsuite/Form";
import styles from "../../../../../../../styles/Settings.module.css";

interface GeneralProps {
    fetchData: () => Promise<void>
    session: Session,
    idpDetails: IdentityProvider
}

/**
 * 
 * @param prop - fetchData (function to fetch data after form is submitted), session, idpDetails
 * 
 * @returns The general section of an idp
 */
export default function Attributes(props: GeneralProps) {

    const { fetchData, session, idpDetails } = props;

    const [ loadingDisplay, setLoadingDisplay ] = useState(LOADING_DISPLAY_NONE);
    const [ initialValues, setInitialValues ] = useState<any>({ keyValuePairs: {}, subject_attribute: "" });
    const [ idpGroupMappings, setIdpGroupMappings ] = useState<IdentityProviderGroupMappings>(null);
    const [ localClaims, setLocalClaims ] = useState<LocalClaim[]>(null);

    const fetchGroupMappingData = useCallback(async () => {
        const res: IdentityProviderGroupMappings =
            await controllerDecodeGetIdentityProviderGroupMappings(session, idpDetails.id);
        const res1: LocalClaim[] =
            await controllerDecodeGetLocalClaims(session);
        
        setIdpGroupMappings(res);
        setLocalClaims(res1);
    }, [ session, id ]);

    useEffect(() => {
        fetchGroupMappingData();
    }, [ fetchGroupMappingData ]);


    const onUpdate = async (values: Record<string, string>, form): Promise<void> => {

        const newMappings: any[] = [];

        Object.keys(values.keyValuePairs).map((key, index) => {
            const localClaim = localClaims.find((claim) => claim.claimURI === values.keyValuePairs[key]);

            newMappings.push({
                idpClaim: key,
                localClaim: {
                    displayName: localClaim.displayName,
                    id: localClaim.id,
                    uri: localClaim.claimURI
                }
            });
        });

        const newIdpGroupMappings = {
            mappings: newMappings,
            provisioningClaims: idpGroupMappings.provisioningClaims,
            roleClaim: idpGroupMappings.roleClaim,
            userIdClaim: {
                uri: values.subject_attribute ? values.subject_attribute : ""
            }
        };

        controllerDecodePatchIdpClaims(session, idpDetails.id, newIdpGroupMappings)
            .then(() => {
                fetchData();
                fetchGroupMappingData();
            }).finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));

    };

    useEffect(() => {
        idpGroupMappings?.mappings.forEach((mapping) => {
            setInitialValues((prevData) => ({
                ...prevData,
                keyValuePairs: { ...prevData.keyValuePairs, [mapping.idpClaim]: mapping.localClaim.uri }
            }));
        });
        setInitialValues((prevData) => ({
            ...prevData,
            subject_attribute: idpGroupMappings?.userIdClaim.uri
        }));
    }, [ idpGroupMappings ]);

    return (
        <div className={ styles.addUserMainDiv }>
            <div>
                <Form
                    onSubmit={ onUpdate }
                    initialValues={ initialValues }
                    render={ ({ handleSubmit, form, submitting, pristine, errors }) => (
                        <FormSuite
                            layout="vertical"
                            className={ styles.addUserForm }
                            onSubmit={ () => { handleSubmit().then(form.restart); } }
                            fluid>
                            <Field name="keyValuePairs" label="External IdP Attributes">
                                { ({ input }) => (
                                    <>
                                        <b>External IdP Attributes</b>
                                        <AddOutlineIcon 
                                            onClick={ () =>
                                                input.onChange({
                                                    ...input.value,
                                                    [`key${Object.keys(input.value).length + 1}`]: ""
                                                })
                                            }
                                            style={ { marginLeft: "10px" } }
                                        />
                                        <div>
                                            { Object.keys(input.value).map((key, index) => {
                                                return (
                                                    <FormField key={ index } name={ `${index}` } label={ "" } >
                                                        <div 
                                                            style={ { 
                                                                alignItems: "center", 
                                                                display: "flex", 
                                                                marginBottom: "-20px" 
                                                            } }
                                                        >
                                                            <div style={ {  margin: "0px 5px", width: "45%" } }>
                                                                <Input
                                                                    value={ key }
                                                                    onChange={ (e) => {
                                                                        const updatedKeys = { ...input.value };
                                                                        
                                                                        delete updatedKeys[key];
                                                                        updatedKeys[e] = input.value[key] || "";
                                                                        input.onChange(updatedKeys);
                                                                    } }
                                                                />
                                                            </div>
                                                            <div style={ { margin: "10px", width: "45%" } }>
                                                                <SelectPicker
                                                                    value={ input.value[key] }
                                                                    onChange={ (value) => {
                                                                        const updatedValues = { ...input.value };
                                                                        
                                                                        updatedValues[key] = value;
                                                                        input.onChange(updatedValues);
                                                                    } }
                                                                    data={ localClaims.map((claim) => {
                                                                        return {
                                                                            label: claim.displayName as string,
                                                                            value: claim.claimURI as string
                                                                        };
                                                                    }) }
                                                                    cleanable={ false }
                                                                    block
                                                                />
                                                            </div>

                                                            <CloseIcon 
                                                                onClick={ () => {
                                                                    const updatedValues = { ...input.value };
                                                                    
                                                                    delete updatedValues[key];
                                                                    input.onChange({ ...updatedValues });
                                                                } }
                                                                style={ { marginLeft: "10px" } } />
                                                        </div>
                                                    </FormField>
                                                );
                                            }) }
                                        </div>
                                        <div style={ { marginTop: "40px" } }>
                                            <FormField
                                                name="subject_attribute"
                                                label="Subject Attribute"
                                                helperText={
                                                    "The attribute that identifies the " + 
                                                    "user at the enterprise identity provider."
                                                }
                                                needErrorMessage={ true }
                                            >
                                                <FormSuite.Control
                                                    name="subject_attribute"
                                                    accepter={ SelectPicker }
                                                    data={ [
                                                        {
                                                            label: "Default",
                                                            value: ""
                                                        },
                                                        ...Object.keys(input.value).map((key) => ({
                                                            label: key,
                                                            value: key
                                                        }))
                                                    ] }
                                                    style={ { display: "block", margin: "10px", width: "45%" } }
                                                    value={ input.value.subject_attribute }
                                                    onChange={ (value) => {
                                                        form.change("subject_attribute", value);
                                                    } }
                                                />
                                            </FormField>
                                        </div>
                                    </>
                                ) }
                            </Field>

                            <br />

                            <FormButtonToolbar
                                submitButtonText="Update"
                                submitButtonDisabled={ submitting || pristine || !checkIfJSONisEmpty(errors) }
                                needCancel={ false }
                            />
                        </FormSuite>
                    ) }
                />

            </div>

            <div style={ loadingDisplay }>
                <Loader size="lg" backdrop content="User is adding" vertical />
            </div>
        </div>
    );
}

