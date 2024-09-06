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

import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import FOOTER_LOGOS from "../images/footer.png";
import ContentLoader from "react-content-loader";
import { LoadContent } from "./content-loader";

/**
 * Decoded ID Token Response component Prop types interface.
 */
interface DefaultLayoutPropsInterface {

    /**
     * Are the Authentication requests loading.
     */
    isLoading?: boolean;
    /**
     * Are there authentication errors.
     */
    hasErrors?: boolean;
}

/**
 * Default layout containing Header and Footer with support for children nodes.
 *
 * @param {DefaultLayoutPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const DefaultLayout: FunctionComponent<PropsWithChildren<DefaultLayoutPropsInterface>> = (
    props: PropsWithChildren<DefaultLayoutPropsInterface>
): ReactElement => {

    const {
        children,
        isLoading,
        hasErrors
    } = props;

    return (
        <>
            {isLoading? (
                <LoadContent/>
            ) : (
                <div className="container">
                    {
                        hasErrors
                                ? <div className="content">An error occured while authenticating ...</div>
                                : children
                    }
                </div>
            )}
        </>
    );
};
