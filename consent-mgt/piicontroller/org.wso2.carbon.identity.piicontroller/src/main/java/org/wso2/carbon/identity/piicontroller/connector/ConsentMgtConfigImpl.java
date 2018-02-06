/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations und
 */
package org.wso2.carbon.identity.piicontroller.connector;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.consent.mgt.core.connector.PIIController;
import org.wso2.carbon.consent.mgt.core.model.Address;
import org.wso2.carbon.consent.mgt.core.model.PiiController;
import org.wso2.carbon.consent.mgt.core.util.ConsentConfigParser;
import org.wso2.carbon.identity.application.common.model.Property;
import org.wso2.carbon.identity.governance.IdentityGovernanceException;
import org.wso2.carbon.identity.governance.IdentityGovernanceService;
import org.wso2.carbon.identity.governance.common.IdentityConnectorConfig;
import org.wso2.carbon.identity.piicontroller.ConsentConstants;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PIIControllerElements.countryElement;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PIIControllerElements.localityElement;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PIIControllerElements.piiControllerContactElement;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PIIControllerElements.piiControllerEmailElement;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PIIControllerElements.piiControllerNameElement;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PIIControllerElements.piiControllerOnBehalfElement;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PIIControllerElements.piiControllerPhoneElement;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PIIControllerElements.piiControllerPublicKeyElement;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PIIControllerElements.piiControllerUrlElement;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PIIControllerElements.postCodeElement;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PIIControllerElements.postOfficeBoxNumberElement;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PIIControllerElements.regionElement;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PIIControllerElements.streetAddressElement;

/**
 * This class used to define default/customize values of PII controller details.
 */
public class ConsentMgtConfigImpl implements IdentityConnectorConfig, PIIController {

    private static Log log = LogFactory.getLog(ConsentMgtConfigImpl.class);
    private static final String DISPLAY_NAME_PII_CONTROLLER = "Name";
    private static final String DISPLAY_NAME_CONTACT = "Contact Name";
    private static final String DISPLAY_NAME_EMAIL = "Email Address";
    private static final String DISPLAY_NAME_PHONE = "Phone Number";
    private static final String DISPLAY_NAME_ON_BEHALF = "Nn Behalf";
    private static final String DISPLAY_NAME_PII_CONTROLLER_URL = "Url";
    private static final String DISPLAY_NAME_ADDRESS_COUNTRY = "Country";
    private static final String DISPLAY_NAME_ADDRESS_LOCALITY = "Locality";
    private static final String DISPLAY_NAME_ADDRESS_REGION = "Region";
    private static final String DISPLAY_NAME_POST_OFFICE_BOX_NUMBER = "Post Office Box Number";
    private static final String DISPLAY_NAME_POSTAL_CODE = "Postal Code";
    private static final String DISPLAY_NAME_STREET_ADDRESS = "Street Address";
    private static final String DISPLAY_NAME_PUBLIC_KEY = "Public Key";

    private static final String DISPLAY_DESCRIPTION_PII_CONTROLLER = "Name of the first PII Controller who collects " +
            "the data";
    private static final String DISPLAY_DESCRIPTION_CONTACT = "Contact name of the PII Controller";
    private static final String DISPLAY_DESCRIPTION_EMAIL = "Contact email address of the PII Controller";
    private static final String DISPLAY_DESCRIPTION_PHONE = "Contact phone number of the PII Controller";
    private static final String DISPLAY_DESCRIPTION_ON_BEHALF = "A PII Processor acting on behalf of a PII Controller" +
            " or PII Processor";
    private static final String DISPLAY_DESCRIPTION_PII_CONTROLLER_URL = "A URL for contacting the PII Controller";
    private static final String DISPLAY_DESCRIPTION_ADDRESS_COUNTRY = "Country of the PII Controller";
    private static final String DISPLAY_DESCRIPTION_ADDRESS_LOCALITY = "Locality of the PII Controller";
    private static final String DISPLAY_DESCRIPTION_ADDRESS_REGION = "Region of the PII Controller";
    private static final String DISPLAY_DESCRIPTION_POST_OFFICE_BOX_NUMBER = "Post Office Box Number of the" +
            " PII Controller";
    private static final String DISPLAY_DESCRIPTION_POSTAL_CODE = "Postal Code of the PII Controller";
    private static final String DISPLAY_DESCRIPTION_STREET_ADDRESS = "Street Address of the PII Controller";
    private static final String DISPLAY_DESCRIPTION_PUBLIC_KEY = "Public key of the PII Controller";
    private static final String EMPTY = "";
    private IdentityGovernanceService identityGovernanceService;

    public ConsentMgtConfigImpl(IdentityGovernanceService identityGovernanceService) {

        this.identityGovernanceService = identityGovernanceService;
    }

    @Override
    public String getName() {

        return ConsentConstants.PII_CONTROLLER_CONNECTOR_NAME;
    }

    @Override
    public String getFriendlyName() {

        return ConsentConstants.PII_CONTROLLER_CONNECTOR_FAMILY_NAME;
    }

    @Override
    public String getCategory() {

        return ConsentConstants.PII_CONTROLLER_CONNECTOR_CATEGORY;
    }

    @Override
    public String getSubCategory() {

        return ConsentConstants.PII_CONTROLLER_CONNECTOR_SUB_CATEGORY;
    }

    @Override
    public int getOrder() {

        return 4;
    }

    @Override
    public Map<String, String> getPropertyNameMapping() {

        return populateData(DISPLAY_NAME_CONTACT, DISPLAY_NAME_PII_CONTROLLER, DISPLAY_NAME_EMAIL, DISPLAY_NAME_PHONE,
                DISPLAY_NAME_ON_BEHALF, DISPLAY_NAME_PII_CONTROLLER_URL, DISPLAY_NAME_ADDRESS_COUNTRY,
                DISPLAY_NAME_ADDRESS_LOCALITY, DISPLAY_NAME_ADDRESS_REGION, DISPLAY_NAME_POST_OFFICE_BOX_NUMBER,
                DISPLAY_NAME_POSTAL_CODE, DISPLAY_NAME_STREET_ADDRESS, DISPLAY_NAME_PUBLIC_KEY);
    }

    @Override
    public Map<String, String> getPropertyDescriptionMapping() {

        return populateData(DISPLAY_DESCRIPTION_CONTACT, DISPLAY_DESCRIPTION_PII_CONTROLLER, DISPLAY_DESCRIPTION_EMAIL,
                DISPLAY_DESCRIPTION_PHONE, DISPLAY_DESCRIPTION_ON_BEHALF, DISPLAY_DESCRIPTION_PII_CONTROLLER_URL,
                DISPLAY_DESCRIPTION_ADDRESS_COUNTRY, DISPLAY_DESCRIPTION_ADDRESS_LOCALITY,
                DISPLAY_DESCRIPTION_ADDRESS_REGION, DISPLAY_DESCRIPTION_POST_OFFICE_BOX_NUMBER,
                DISPLAY_DESCRIPTION_POSTAL_CODE, DISPLAY_DESCRIPTION_STREET_ADDRESS, DISPLAY_DESCRIPTION_PUBLIC_KEY);
    }

    @Override
    public String[] getPropertyNames() {

        List<String> properties = new ArrayList<>();
        properties.add(ConsentConstants.PII_CONTROLLER);
        properties.add(ConsentConstants.CONTACT);
        properties.add(ConsentConstants.EMAIL);
        properties.add(ConsentConstants.PHONE);
        properties.add(ConsentConstants.ON_BEHALF);
        properties.add(ConsentConstants.PII_CONTROLLER_URL);
        properties.add(ConsentConstants.ADDRESS_COUNTRY);
        properties.add(ConsentConstants.ADDRESS_LOCALITY);
        properties.add(ConsentConstants.ADDRESS_REGION);
        properties.add(ConsentConstants.POST_OFFICE_BOX_NUMBER);
        properties.add(ConsentConstants.POSTAL_CODE);
        properties.add(ConsentConstants.STREET_ADDRESS);
        properties.add(ConsentConstants.PUBLIC_KEY);
        return properties.toArray(new String[properties.size()]);
    }

    @Override
    public Properties getDefaultPropertyValues(String tenantDomain) throws IdentityGovernanceException {

        Map<String, String> defaultProperties = new HashMap<>();

        defaultProperties.put(ConsentConstants.PII_CONTROLLER, getConfiguration(piiControllerNameElement));
        defaultProperties.put(ConsentConstants.CONTACT, getConfiguration(piiControllerContactElement));
        defaultProperties.put(ConsentConstants.EMAIL, getConfiguration(piiControllerEmailElement));
        defaultProperties.put(ConsentConstants.PHONE, getConfiguration(piiControllerPhoneElement));
        defaultProperties.put(ConsentConstants.ON_BEHALF, getConfiguration(piiControllerOnBehalfElement));
        defaultProperties.put(ConsentConstants.PII_CONTROLLER_URL, getConfiguration(piiControllerUrlElement));
        defaultProperties.put(ConsentConstants.ADDRESS_COUNTRY, getConfiguration(countryElement));
        defaultProperties.put(ConsentConstants.ADDRESS_LOCALITY, getConfiguration(localityElement));
        defaultProperties.put(ConsentConstants.ADDRESS_REGION, getConfiguration(regionElement));
        defaultProperties.put(ConsentConstants.POST_OFFICE_BOX_NUMBER, getConfiguration(postOfficeBoxNumberElement));
        defaultProperties.put(ConsentConstants.POSTAL_CODE, getConfiguration(postCodeElement));
        defaultProperties.put(ConsentConstants.STREET_ADDRESS, getConfiguration(streetAddressElement));
        defaultProperties.put(ConsentConstants.PUBLIC_KEY, getConfiguration(piiControllerPublicKeyElement));

        Properties properties = new Properties();
        properties.putAll(defaultProperties);
        return properties;
    }

    @Override
    public Map<String, String> getDefaultPropertyValues(String[] propertyNames, String tenantDomain) throws IdentityGovernanceException {

        return null;
    }

    private Map<String, String> populateData(String valueContact, String valuePiiController,
                                             String valueEmail, String valuePhone,
                                             String valueOnBehalf, String valuePiiControllerUrl,
                                             String valueAddressCountry, String valueAddressLocality,
                                             String valueAddressRegion, String valuePostOfficeBoxNumber,
                                             String valuePostalCode, String valueStreetAddress, String publicKey) {

        Map<String, String> mapping = new HashMap<>();
        mapping.put(ConsentConstants.CONTACT, valueContact);
        mapping.put(ConsentConstants.PII_CONTROLLER, valuePiiController);
        mapping.put(ConsentConstants.EMAIL, valueEmail);
        mapping.put(ConsentConstants.PHONE, valuePhone);
        mapping.put(ConsentConstants.ON_BEHALF, valueOnBehalf);
        mapping.put(ConsentConstants.PII_CONTROLLER_URL, valuePiiControllerUrl);
        mapping.put(ConsentConstants.ADDRESS_COUNTRY, valueAddressCountry);
        mapping.put(ConsentConstants.ADDRESS_LOCALITY, valueAddressLocality);
        mapping.put(ConsentConstants.ADDRESS_REGION, valueAddressRegion);
        mapping.put(ConsentConstants.POST_OFFICE_BOX_NUMBER, valuePostOfficeBoxNumber);
        mapping.put(ConsentConstants.POSTAL_CODE, valuePostalCode);
        mapping.put(ConsentConstants.STREET_ADDRESS, valueStreetAddress);
        mapping.put(ConsentConstants.PUBLIC_KEY, publicKey);
        return mapping;
    }

    private String getConfiguration(String configElement) {

        ConsentConfigParser consentConfigParser = new ConsentConfigParser();
        Map<String, Object> configuration = consentConfigParser.getConfiguration();
        if (configuration.get(configElement) != null) {
            return configuration.get(configElement).toString();
        }
        return EMPTY;
    }

    @Override
    public int getPriority() {

        return 10;
    }

    @Override
    public PiiController getControllerInfo(String tenantDomain) {

        String addressCountry = getConfiguration(countryElement);
        String addressLocality = getConfiguration(localityElement);
        String addressRegion = getConfiguration(regionElement);
        String addressPostOfficeBoxNumber = getConfiguration(postOfficeBoxNumberElement);
        String addressPostCode = getConfiguration(postCodeElement);
        String addressStreetAddress = getConfiguration(streetAddressElement);

        String piiControllerName = getConfiguration(piiControllerNameElement);
        String piiControllerContact = getConfiguration(piiControllerContactElement);
        String piiControllerPhone = getConfiguration(piiControllerPhoneElement);
        String piiControllerEmail = getConfiguration(piiControllerEmailElement);
        boolean piiControllerOnBehalf = Boolean.parseBoolean(getConfiguration(piiControllerOnBehalfElement));
        String piiControllerURL = getConfiguration(piiControllerUrlElement);
        String publicKey = getConfiguration(piiControllerPublicKeyElement);

        try {
            Property[] configurations = identityGovernanceService.getConfiguration(getPropertyNames(), tenantDomain);
            if (configurations != null) {
                for (Property config : configurations) {
                    if (ConsentConstants.PII_CONTROLLER.equals(config.getName())) {
                        piiControllerName = config.getValue();

                    } else if (ConsentConstants.CONTACT.equals(config.getName())) {
                        piiControllerContact = config.getValue();
                    } else if (ConsentConstants.EMAIL.equals(config.getName())) {
                        piiControllerEmail = config.getValue();
                    } else if (ConsentConstants.PHONE.equals(config.getName())) {
                        piiControllerPhone = config.getValue();
                    } else if (ConsentConstants.ON_BEHALF.equals(config.getName())) {
                        piiControllerOnBehalf = Boolean.parseBoolean(config.getValue());
                    } else if (ConsentConstants.PII_CONTROLLER_URL.equals(config.getName())) {
                        piiControllerURL = config.getValue();
                    } else if (ConsentConstants.ADDRESS_COUNTRY.equals(config.getName())) {
                        addressCountry = config.getValue();
                    } else if (ConsentConstants.ADDRESS_LOCALITY.equals(config.getName())) {
                        addressLocality = config.getValue();
                    } else if (ConsentConstants.ADDRESS_REGION.equals(config.getName())) {
                        addressRegion = config.getValue();
                    } else if (ConsentConstants.POST_OFFICE_BOX_NUMBER.equals(config.getName())) {
                        addressPostOfficeBoxNumber = config.getValue();
                    } else if (ConsentConstants.POSTAL_CODE.equals(config.getName())) {
                        addressPostCode = config.getValue();
                    } else if (ConsentConstants.STREET_ADDRESS.equals(config.getName())) {
                        addressStreetAddress = config.getValue();
                    } else if (ConsentConstants.PUBLIC_KEY.equals(config.getName())) {
                        publicKey = config.getValue();
                    }
                }
            }
        } catch (IdentityGovernanceException e) {
            String errorMessage = "Error while getting configuration from governance service. Default to configs  " +
                    "defined in xml file.";
            if (log.isDebugEnabled()) {
                log.debug(errorMessage, e);
            } else {
                log.warn(errorMessage);
            }
        }

        Address address = new Address(addressCountry, addressLocality, addressRegion, addressPostOfficeBoxNumber,
                addressPostCode, addressStreetAddress);

        return new PiiController(piiControllerName, piiControllerOnBehalf, piiControllerContact, piiControllerEmail,
                piiControllerPhone, piiControllerURL, address, publicKey);
    }
}
