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
import { LogoComponent } from "@pet-management-webapp/business-admin-app/ui/ui-components";
import { IndexHomeComponent } from "@pet-management-webapp/shared/ui/ui-components";
import { NextRouter, useRouter } from "next/router";
import React, { useEffect } from "react";
import "rsuite/dist/rsuite.min.css";
import homeImage from "../../../libs/business-admin-app/ui/ui-assets/src/lib/images/businessAdminHome.png";
import { getPersonalization } from "../APICalls/GetPersonalization/get-personalization";
import personalize from "../components/sections/sections/settingsSection/personalizationSection/personalize";
import { Personalization } from "../types/personalization";

/**
 * 
 * @returns - First interface of the app
 */
export default function Home() { 

    const router: NextRouter = useRouter();

    const getOrgIdFromUrl = (): string => {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const searchParams = url.searchParams;
        const orgId = searchParams.get("orgId");
      
        return orgId;
    };

    const signinOnClick = (): void => {
        if (getOrgIdFromUrl()) {
            router.push("/signin?orgId=" + getOrgIdFromUrl());
        } else {
            router.push("/signin");
        }
    };

    useEffect(() => {
        if (getOrgIdFromUrl()) {
            getPersonalization(getOrgIdFromUrl())
                .then((response) => {
                    personalize(response.data);
                })
                .catch(async (err) => {
                    if (err.response.status === 404) {
                        const defaultPersonalization: Personalization = {
                            faviconUrl: "https://user-images.githubusercontent.com/1329596/" + 
                                "242288450-b511d3dd-5e02-434f-9924-3399990fa011.png",
                            logoAltText: "Pet Care App Logo",
                            logoUrl: "https://user-images.githubusercontent.com/" + 
                                "35829027/241967420-9358bd5c-636e-48a1-a2d8-27b2aa310ebf.png",
                            org: "",
                            primaryColor: "#4F40EE",
                            secondaryColor: "#E0E1E2"
                        };
        
                        personalize(defaultPersonalization);
                        
                    }
                });
        }
        
        
    }, [ ]);

    return (
        <IndexHomeComponent 
            image={ homeImage }
            tagText="Sign in to continue"
            signinOnClick={ signinOnClick }
            logoComponent = { <LogoComponent imageSize="medium"/> }
        />
    );
}
