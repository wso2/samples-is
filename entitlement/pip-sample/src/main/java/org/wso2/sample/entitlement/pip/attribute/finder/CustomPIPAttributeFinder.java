/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 */

package org.wso2.sample.entitlement.pip.attribute.finder;


import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.balana.attr.AttributeValue;
import org.wso2.balana.attr.BagAttribute;
import org.wso2.balana.attr.StringAttribute;
import org.wso2.balana.cond.EvaluationResult;
import org.wso2.balana.ctx.EvaluationCtx;
import org.wso2.carbon.identity.entitlement.pip.AbstractPIPAttributeFinder;

import java.net.URI;
import java.util.Collections;
import java.util.HashSet;
import java.util.Properties;
import java.util.Set;

public class CustomPIPAttributeFinder extends AbstractPIPAttributeFinder {

    private static final String PIP_NAME = "CustomPIPAttributeFinder";

    private static final Set<String> SUPPORTED_ATTRIBUTES;
    private static final Log log = LogFactory.getLog(CustomPIPAttributeFinder.class);

    static {
        SUPPORTED_ATTRIBUTES = new HashSet<String>();
        SUPPORTED_ATTRIBUTES.add(CustomPIPConstants.SAMPLE_ATTRIBUTE_ID);
        SUPPORTED_ATTRIBUTES.add(CustomPIPConstants.SAMPLE_ATTRIBUTE_NAME);
        SUPPORTED_ATTRIBUTES.add(CustomPIPConstants.SAMPLE_CATEGORY);
    }

    @Override
    public Set<String> getAttributeValues(URI attributeType, URI attributeId, URI category, String issuer,
                                          EvaluationCtx evaluationCtx) throws Exception {

        EvaluationResult context;
        String sampleID = null;

        if (StringUtils.isBlank(attributeId.toString())) {
            log.debug("Empty attribute URI received..");
            return Collections.EMPTY_SET;
        }
        context = evaluationCtx
                .getAttribute(new URI(StringAttribute.identifier), new URI(CustomPIPConstants.SAMPLE_ATTRIBUTE_ID),
                        issuer, new URI(CustomPIPConstants.SAMPLE_CATEGORY));
        if (context != null && context.getAttributeValue() != null && context.getAttributeValue().isBag()) {
            BagAttribute bagAttribute = (BagAttribute) context.getAttributeValue();
            if (bagAttribute.size() > 0) {
                sampleID = ((AttributeValue) bagAttribute.iterator().next()).encode();
                if (log.isDebugEnabled()) {
                    log.debug(String.format("Finding attributes for the context %1$s", sampleID));
                }
            }
        }


        if (sampleID != null) {
            String sampleName = retrieveSampleName(sampleID);
            if (StringUtils.isNotEmpty(sampleName)) {
                Set<String> values = new HashSet<String>();

                switch (attributeId.toString()) {
                    case CustomPIPConstants.SAMPLE_ATTRIBUTE_NAME:
                        values.add(sampleName);
                        break;
                    default:
                }
                if (log.isDebugEnabled()) {
                    String valuesString = StringUtils.join(values, ",");
                    log.debug("Returning " + attributeId + " value as " + valuesString);
                }
                return values;
            }
        }
        return Collections.emptySet();
    }

    private String retrieveSampleName(String accessToken) {

        String sampleName = null;

        // TODO: Get the value of the sample name from the sampleID from the datasource

        return sampleName;
    }

    /**
     * Since we override the {@link #getAttributeValues(URI, URI, URI, String, EvaluationCtx)} this won't be called.
     */
    @Override
    public Set<String> getAttributeValues(String subject, String resource, String action, String environment,
                                          String attributeId, String issuer) throws Exception {

        throw new UnsupportedOperationException("Method unsupported in the context");
    }

    public void init(Properties properties) throws Exception {


    }

    public String getModuleName() {

        return PIP_NAME;
    }

    public Set<String> getSupportedAttributes() {

        return SUPPORTED_ATTRIBUTES;
    }
}
