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

const { withNx } = require("@nrwl/next/plugins/with-nx");
const withFonts = require("next-fonts");
const withLess = require("next-with-less");

const lessConfig = withLess({
    lessLoaderOptions: {
        lessOptions: {
            strictMath: true
        }
    }
});

module.exports = withFonts({
    webpack(config) {
        return config;
    }
});

const nextConfig = withNx({
    nx: {
        svgr: false

    },
    publicRuntimeConfig: {
        baseOrgUrl: process.env.BASE_ORG_URL,
        baseUrl: process.env.BASE_URL,
        channellingServiceUrl: process.env.CHANNELLING_SERVICE_URL,
        clientId: process.env.CLIENT_ID,
        hostedUrl: process.env.HOSTED_URL,
        personalizationServiceUrl: process.env.PERSONALIZATION_SERVICE_URL,
        petManagementServiceUrl: process.env.PET_MANAGEMENT_SERVICE_URL,
        sharedAppName: process.env.SHARED_APP_NAME
    },
    ...lessConfig
});

module.exports = nextConfig;

