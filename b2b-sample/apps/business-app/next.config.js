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

const { withNx } = require('@nrwl/next/plugins/with-nx');
const withLess = require("next-with-less");

const lessConfig = withLess({
    lessLoaderOptions: {
        lessOptions: {
            strictMath: true,
        }
    }
});

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = withNx({
    nx: {
        // Set this to true if you would like to to use SVGR
        // See: https://github.com/gregberge/svgr
        svgr: false,

    },
    ...lessConfig
});

module.exports = nextConfig;
