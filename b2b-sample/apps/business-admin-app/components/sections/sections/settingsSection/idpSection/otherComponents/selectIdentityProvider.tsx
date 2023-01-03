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

import { IdentityProviderTemplate } from "@b2bsample/business-admin-app/data-access/data-access-common-models-util";
import { ModelHeaderComponent } from "@b2bsample/shared/ui/ui-basic-components";
import { EMPTY_STRING, ENTERPRISE_ID, GOOGLE_ID } from "@b2bsample/shared/util/util-common";
import { Avatar, Modal } from "rsuite";
import config from "../../../../../../../../config.json";
import styles from "../../../../../../styles/idp.module.css";

interface SelectIdentityProviderProps {
    openModal: boolean,
    onClose: () => void,
    templates: IdentityProviderTemplate[],
    onTemplateSelected: (IdentityProviderTemplate) => void
}

/**
 * 
 * @param prop - openModal (function to open the modal), onClose (what will happen when modal closes), 
 *               templates (templates list), onTemplateSelected 
 *              (what will happen when a particular template is selected)
 * 
 * @returns A modal to select idp's
 */
export default function SelectIdentityProvider(prop: SelectIdentityProviderProps) {
    const { openModal, onClose, templates, onTemplateSelected } = prop;

    const resolveIconName = (template): string => {
        if (GOOGLE_ID === template.templateId) {

            return `${config.CommonConfig.ManagementAPIConfig.ImageBaseUrl}/libs/themes/default/assets` +
                "/images/identity-providers/google-idp-illustration.svg";
        }
        if (ENTERPRISE_ID === template.templateId) {

            return `${config.CommonConfig.ManagementAPIConfig.ImageBaseUrl}/libs/themes/default/assets` +
                "/images/identity-providers/enterprise-idp-illustration.svg";
        }

        return EMPTY_STRING;
    };

    return (
        <Modal
            open={ openModal }
            onClose={ onClose }
            onBackdropClick={ onClose }>
            <Modal.Header>
                <ModelHeaderComponent
                    title="Select Identity Provider"
                    subTitle="Choose one of the following identity providers" />
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div className={ styles.idp__template__list }>
                        { templates.map((template) => {

                            return (
                                <div
                                    key={ template.id }
                                    className={ styles.idp__template__card }
                                    onClick={ () => onTemplateSelected(template) }>
                                    <div>
                                        <h5>{ template.name }</h5>
                                        <small>{ template.description }</small>
                                    </div>
                                    <Avatar
                                        style={ { background: "rgba(255,0,0,0)" } }
                                        src={ resolveIconName(template) }
                                    />
                                </div>
                            );
                        }) }
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
