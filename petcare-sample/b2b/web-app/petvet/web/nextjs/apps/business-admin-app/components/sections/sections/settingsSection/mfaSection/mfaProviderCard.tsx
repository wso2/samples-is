/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AccordianItemHeaderComponent } from "@pet-management-webapp/shared/ui/ui-components";
import { Button, FlexboxGrid, Panel } from "rsuite";

interface MFAProviderCardProps {
  imageSrc: string;
  title: string;
  description: string;
  isActive: boolean | null;
  onClick: () => void;
}

export default function MFAProviderCard({
    imageSrc,
    title,
    description,
    isActive,
    onClick
}: MFAProviderCardProps) {
    return (
        <Panel
            shaded
            bordered
            bodyFill
            style={ { borderRadius: "12px", marginBottom: "24px", padding: "24px" } }
        >
            <FlexboxGrid align="middle" justify="space-between">
                <FlexboxGrid.Item colspan={ 18 }>
                    <AccordianItemHeaderComponent
                        imageSrc={ imageSrc }
                        title={ title }
                        description={ description }
                    />
                </FlexboxGrid.Item>

                { isActive !== null && (
                    <FlexboxGrid.Item colspan={ 6 } style={ { textAlign: "right" } }>
                        <Button
                            appearance={ isActive ? "ghost" : "primary" }
                            style={ {
                                borderRadius: "24px",
                                fontSize: "16px",
                                fontWeight: 500,
                                height: "44px",
                                padding: "0 16px",
                                width: "180px"
                            } }
                            onClick={ onClick }
                        >
                            { isActive ? "Remove from Login Flow" : "Add to Login Flow" }
                        </Button>
                    </FlexboxGrid.Item>
                ) }
            </FlexboxGrid>
        </Panel>
    );
}
