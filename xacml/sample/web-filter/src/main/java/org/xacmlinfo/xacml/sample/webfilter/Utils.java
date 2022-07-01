/*
*  Copyright (c) WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
*  WSO2 Inc. licenses this file to you under the Apache License,
*  Version 2.0 (the "License"); you may not use this file except
*  in compliance with the License.
*  You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

package org.xacmlinfo.xacml.sample.webfilter;

import org.xacmlinfo.xacml.pep.agent.PEPConfig;
import org.xacmlinfo.xacml.pep.agent.client.PEPClientConfig;

import java.io.*;
import java.util.Properties;

/**
 *
 */
public class Utils {


    /**
     * reads values from config property file
     * @return return properties
     */
    public static Properties loadConfigProperties() {

        Properties properties = new Properties();
        InputStream inputStream = null;
        try {
            File file = new File((new File(".")).getCanonicalPath() + File.separator +
                                                 "src" + File.separator + "main" + File.separator +
                                                 "resources" + File.separator + "config.properties");            
            if(file.exists()){
               inputStream = new FileInputStream(file);
            } else {
                System.err.println("File does not exist : " + "config.properties");
            }
        } catch (FileNotFoundException e) {
            System.err.println("File can not be found : " + "config.properties");
            e.printStackTrace();
        } catch (IOException e) {
            System.err.println("Can not create the canonical file path for given file : " + "config.properties");
            e.printStackTrace();
        }

        try {
            if(inputStream != null){
                properties.load(inputStream);
            }
        } catch (IOException e) {
            System.err.println("Error loading properties from config.properties file");
            e.printStackTrace();
        } finally {
            try {
                if(inputStream!= null){
                    inputStream.close();
                }
            } catch (IOException ignored) {
                System.err.println("Error while closing input stream");
            }
        }

        if(properties.isEmpty()){
            System.out.println("No configurations are loaded.  Using default configurations");    
        }
        return properties;
    }

    public static String createRequest(String userName, String resource, int amount, int totalAmount){


//        RequestDTO requestDTO = new RequestDTO();
//
//        AttributeDTO actionDTO = new AttributeDTO();
//        actionDTO.setAttributeId("urn:oasis:names:tc:xacml:1.0:action:action-id");
//        actionDTO.setAttributeValue(new String[]{"buy"});
//        requestDTO.setAttributeDTOs("urn:oasis:names:tc:xacml:3.0:attribute-category:action", new AttributeDTO[] {actionDTO});
//
//        AttributeDTO resourceDTO = new AttributeDTO();
//        resourceDTO.setAttributeId("urn:oasis:names:tc:xacml:1.0:resource:resource-id");
//        resourceDTO.setAttributeValue(new String[]{resource});
//        requestDTO.setAttributeDTOs("urn:oasis:names:tc:xacml:3.0:attribute-category:resource", new AttributeDTO[] {resourceDTO});
//
//        AttributeDTO subjectDTO = new AttributeDTO();
//        subjectDTO.setAttributeId("urn:oasis:names:tc:xacml:1.0:subject:subject-id");
//        subjectDTO.setAttributeValue(new String[]{userName});
//        requestDTO.setAttributeDTOs("urn:oasis:names:tc:xacml:1.0:subject-category:access-subject", new AttributeDTO[] {subjectDTO});
//
//        AttributeDTO customDTO1 = new AttributeDTO();
//        customDTO1.setAttributeId("http://kmarket.com/id/amount");
//        customDTO1.setDataType("http://www.w3.org/2001/XMLSchema#integer");
//        customDTO1.setAttributeValue(new String[]{Integer.toString(amount)});
//
//        AttributeDTO customDTO2 = new AttributeDTO();
//        customDTO2.setAttributeId("http://kmarket.com/id/totalAmount");
//        customDTO2.setDataType("http://www.w3.org/2001/XMLSchema#integer");
//        customDTO2.setAttributeValue(new String[]{Integer.toString(amount)});
//        requestDTO.setAttributeDTOs("http://kmarket.com/category", new AttributeDTO[] {customDTO1, customDTO2});
//        return  requestDTO;

        return "<Request xmlns=\"urn:oasis:names:tc:xacml:3.0:core:schema:wd-17\" CombinedDecision=\"false\" ReturnPolicyIdList=\"false\">\n" +
                "<Attributes Category=\"urn:oasis:names:tc:xacml:3.0:attribute-category:action\">\n" +
                "<Attribute AttributeId=\"urn:oasis:names:tc:xacml:1.0:action:action-id\" IncludeInResult=\"false\">\n" +
                "<AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">buy</AttributeValue>\n" +
                "</Attribute>\n" +
                "</Attributes>\n" +
                "<Attributes Category=\"urn:oasis:names:tc:xacml:1.0:subject-category:access-subject\">\n" +
                "<Attribute AttributeId=\"urn:oasis:names:tc:xacml:1.0:subject:subject-id\" IncludeInResult=\"false\">\n" +
                "<AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">" + userName +"</AttributeValue>\n" +
                "</Attribute>\n" +
                "</Attributes>\n" +
                "<Attributes Category=\"urn:oasis:names:tc:xacml:3.0:attribute-category:resource\">\n" +
                "<Attribute AttributeId=\"urn:oasis:names:tc:xacml:1.0:resource:resource-id\" IncludeInResult=\"false\">\n" +
                "<AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#string\">" + resource + "</AttributeValue>\n" +
                "</Attribute>\n" +
                "</Attributes>\n" +
                "<Attributes Category=\"http://kmarket.com/category\">\n" +
                "<Attribute AttributeId=\"http://kmarket.com/id/amount\" IncludeInResult=\"false\">\n" +
                "<AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#integer\">" + amount + "</AttributeValue>\n" +
                "</Attribute>\n" +
                "<Attribute AttributeId=\"http://kmarket.com/id/totalAmount\" IncludeInResult=\"false\">\n" +
                "<AttributeValue DataType=\"http://www.w3.org/2001/XMLSchema#integer\">" + totalAmount + "</AttributeValue>\n" +
                "</Attribute>\n" +
                "</Attributes>\n" +
                "</Request>";



    }

    public static PEPConfig buildPEPConfig(Properties properties){

        String serverHostName;
        String serverPort;
        String serverUserName;
        String serverPassword;

        PEPConfig pepConfig = new PEPConfig();
        PEPClientConfig clientConfig = new PEPClientConfig();

        String hostName = properties.getProperty(Constants.SERVER_HOST);
        if(hostName != null && hostName.trim().length() > 0){
            serverHostName = hostName;
        } else {
            serverHostName = "localhost";
        }

        String port = properties.getProperty(Constants.SERVER_PORT);
        if(port != null && port.trim().length() > 0){
            serverPort = port;
        } else {
            serverPort = "9443";
        }

        String password = properties.getProperty(Constants.SERVER_PASSWORD);
        if(password != null && password.trim().length() > 0){
            serverPassword = password;
        } else {
            serverPassword = "admin";
        }

        String userName  = properties.getProperty(Constants.SERVER_USER_NAME);
        if(userName != null && userName.trim().length() > 0){
            serverUserName = userName;
        } else {
            serverUserName = "admin";
        }

        String trustStore = properties.getProperty(Constants.TRUST_STORE_FILE);
        if(trustStore == null || trustStore.trim().length() == 0){
            try{
                trustStore =  (new File(".")).getCanonicalPath() + File.separator +
                        "src" + File.separator + "main" + File.separator +
                        "resources" + File.separator + "wso2carbon.jks";
            } catch (IOException e) {
                e.printStackTrace();
                //ignore
            }
        }

        String trustStorePassword = properties.getProperty(Constants.TRUST_STORE_PASSWORD);
        if(trustStorePassword == null || trustStorePassword.trim().length() == 0){
            trustStorePassword = "wso2carbon";
        }

        clientConfig.setServerHostName(serverHostName);
        clientConfig.setServerPort(serverPort);
        clientConfig.setServerUserName(serverUserName);
        clientConfig.setServerPassword(serverPassword);
        clientConfig.setTrustStoreFile(trustStore);
        clientConfig.setTrustStorePassword(trustStorePassword);

        pepConfig.setPepClientConfig(clientConfig);
        
        // TODO
        pepConfig.setClient(null);
        pepConfig.setPepType(null);
        
        return pepConfig;        
    }
}
