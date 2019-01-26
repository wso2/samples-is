/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.identity.handler.step.utils;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.net.util.SubnetUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * Util class for custom step handler.
 */
public class CustomStepHandlerUtil {

    private static final Log log = LogFactory.getLog(CustomStepHandlerUtil.class);

    // Private constructor to prevent instantiation.
    private CustomStepHandlerUtil() {
    }

    public static boolean isFireFox(HttpServletRequest request) {

        String userAgent = request.getHeader(CustomStepHandlerConstants.USER_AGENT_HEADER);
        return StringUtils.containsIgnoreCase(userAgent, (CustomStepHandlerConstants.FIREFOX_BROWSER_NAME));
    }

    /**
     * Check whether client IP address is from internal networks.
     *
     * @param ipAddress
     * @return
     */
    public static boolean isInternalIP(String ipAddress) {

        /*
         * read external config file and populate internal IP ranges.
         * check whether 'ipAddress' belongs to the internal ranges.
         */
        if (log.isDebugEnabled()) {
            log.debug("Checking if IP address is internal. IP address : " + ipAddress);
        }

        boolean isInternalIP = false;
        List<String> internalIpList = IPRangeDataHolder.getInstance().getIPRangeList();

        if (internalIpList != null) {
            isInternalIP = internalIpList.stream().anyMatch(s -> {
                SubnetUtils.SubnetInfo subnetInfo = IPRangeDataHolder.getInstance().getSubnetUtils(s).getInfo();
                boolean isIpInRange = subnetInfo.isInRange(ipAddress);
                if (isIpInRange) {
                    if (log.isDebugEnabled()) {
                        log.debug("client IP : " + ipAddress + " belongs to the internal network range : " + s);
                    }
                }
                return isIpInRange;
            });
        } else {
            if (log.isDebugEnabled()) {
                log.debug("internal IP list in config file is empty.");
            }
        }

        if (log.isDebugEnabled()) {
            log.debug("Is Client IP from internal network : " + isInternalIP);
        }

        return isInternalIP;
    }
}
