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

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class IPRangeDataHolder {

    private static volatile IPRangeDataHolder dataHolder;
    private List<String> ipRangeList = null;
    private Map<String, SubnetUtils> subnetUtilsMap = null;

    private static final Log log = LogFactory.getLog(IPRangeDataHolder.class);

    // Private constructor to prevent instantiation.
    private IPRangeDataHolder() {

        ipRangeList = new ArrayList<>();
        subnetUtilsMap = new HashMap<>();
    }

    public static IPRangeDataHolder getInstance() {

        if (dataHolder == null) {
            synchronized (IPRangeDataHolder.class) {
                if (dataHolder == null) {
                    dataHolder = new IPRangeDataHolder();
                    // Read internal IP ranges from the config file 'internal_ip_addresses.txt' and populate to a list.
                    dataHolder.readIPListFromConfig();
                }
            }
        }
        return dataHolder;
    }

    public List<String> getIPRangeList() {
        return ipRangeList;
    }

    public SubnetUtils getSubnetUtils(String range) {

        return subnetUtilsMap.computeIfAbsent(range, SubnetUtils::new);
    }

    public Map<String, SubnetUtils> getSubnetUtilsMap() {
        return subnetUtilsMap;
    }

    /**
     * Read internal IP ranges from the config file 'internal_ip_addresses.json' and populate to a list.
     *
     * @return
     */
    private void readIPListFromConfig() {

        if (Files.exists(Paths.get(CustomStepHandlerConstants.IP_CONFIG_FILE_PATH))) {
            StringBuilder stringBuilder = new StringBuilder();
            try (BufferedReader in = new BufferedReader(new FileReader(CustomStepHandlerConstants
                    .IP_CONFIG_FILE_PATH))) {
                String str;
                while ((str = in.readLine()) != null) {
                    stringBuilder.append(str);
                }
                String[] ipRanges = StringUtils.split(stringBuilder.toString().trim().replaceAll("\\s", ""), ",");
                if (ipRanges != null) {
                    ipRangeList.addAll(Arrays.asList(ipRanges));
                }
            } catch (IOException e) {
                log.error("Error occurred while reading the file in the path : " + CustomStepHandlerConstants
                        .IP_CONFIG_FILE_PATH, e);
            }
        } else {
            if (log.isDebugEnabled()) {
                log.debug("Could not find config file in the path : " + CustomStepHandlerConstants
                        .IP_CONFIG_FILE_PATH + ". Hence adding the default values : '10.0.0.0/8', " +
                        "'172.16.0.0/12', '192.168.0.0/16'");
            }
            // Adding default values.
            ipRangeList = Arrays.asList("10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16");
        }

        if (ipRangeList != null) {
            for (String ipRange : ipRangeList) {
                SubnetUtils subnet = new SubnetUtils(ipRange);
                subnetUtilsMap.put(ipRange, subnet);
            }
        }
    }
}
