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
import { getConfig } from "@pet-management-webapp/business-admin-app/util/util-application-config-util";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import "rsuite/dist/rsuite.min.css";
import "../styles/custom-theme.less";
import "../styles/globals.css";

function MyApp(prop) {

    const { Component, pageProps } = prop;

    return (
        <SessionProvider session={ pageProps ? pageProps.session : null }>
            <Head>
                <link rel="shortcut icon" href="./favicon.png" />
                <meta httpEquiv="cache-control" content="no-cache" />
                <meta httpEquiv="expires" content="0" />
                <meta httpEquiv="pragma" content="no-cache" />
                <title>{ getConfig().BusinessAdminAppConfig.ApplicationConfig.Branding.name }</title>
                <meta
                    name="description" 
                    content={ getConfig().BusinessAdminAppConfig.ApplicationConfig.Branding.name } />
            </Head>

            <Component { ...pageProps } />
        </SessionProvider>
    );
}

export default MyApp;
