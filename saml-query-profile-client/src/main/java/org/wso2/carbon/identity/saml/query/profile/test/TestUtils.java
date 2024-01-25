/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.identity.saml.query.profile.test;

import org.apache.axiom.om.OMElement;
import org.apache.axiom.om.util.AXIOMUtil;
import org.apache.axis2.AxisFault;
import org.apache.axis2.addressing.EndpointReference;
import org.apache.axis2.client.Options;
import org.apache.axis2.client.ServiceClient;
import org.apache.axis2.context.ConfigurationContext;
import org.apache.axis2.context.ConfigurationContextFactory;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.identity.query.saml.exception.IdentitySAML2QueryException;

import java.io.File;

public class TestUtils {

    private final static Log log = LogFactory.getLog(TestUtils.class);

    private static final String END_POINT = "https://localhost:9443/services/SAMLQueryService";
    private static final String SOAP_ACTION = "http://wso2.org/identity/saml/query";
    private static final String TRUST_STORE = "wso2carbon.p12";
    private static final String TRUST_STORE_PASSWORD = "wso2carbon";

    public static void setSystemProperties() {

        ClassLoader loader = TestUtils.class.getClassLoader();
        String trustStore = new File(loader.getResource(TRUST_STORE).getPath()).getAbsolutePath();

        System.setProperty("javax.net.ssl.trustStore", trustStore);
        System.setProperty("javax.net.ssl.trustStorePassword", TRUST_STORE_PASSWORD);
    }

    public static ServiceClient createServiceClient() throws IdentitySAML2QueryException {

        ConfigurationContext configurationContext;
        ServiceClient serviceClient;

        try {
            configurationContext = ConfigurationContextFactory.
                    createConfigurationContextFromFileSystem(null, null);
            serviceClient = new ServiceClient(configurationContext, null);

        } catch (AxisFault axisFault) {
            log.error("Error creating axis2 service client !!! " + axisFault);
            throw new IdentitySAML2QueryException("Error creating axis2 service client", axisFault);
        }

        return serviceClient;
    }

    public static Options setOptionsForServiceClient() {

        Options options = new Options();
        // Security scenario 01 must use the SSL.  So we need to call HTTPS endpoint of the service.
        options.setTo(new EndpointReference(END_POINT));
        // Set the operation that you are calling in the service.
        options.setAction(SOAP_ACTION);

        return options;
    }

    public static OMElement receiveResultFromServiceClient(ServiceClient serviceClient, String body)
            throws IdentitySAML2QueryException {

        OMElement result;
        try {
            result = serviceClient.sendReceive(AXIOMUtil.stringToOM(body));
            System.out.println("Message is sent");
        } catch (AxisFault axisFault) {
            log.error("Error invoking service !!! " + axisFault);
            throw new IdentitySAML2QueryException("Error invoking service", axisFault);
        } catch (Exception e) {
            log.error("Error invoking service !!! " + e);
            throw new IdentitySAML2QueryException("Error invoking service", e);
        }

        return result;
    }
}
