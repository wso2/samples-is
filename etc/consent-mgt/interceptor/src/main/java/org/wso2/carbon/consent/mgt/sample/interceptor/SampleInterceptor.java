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
 * limitations under the License.
 */

package org.wso2.carbon.consent.mgt.sample.interceptor;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.consent.mgt.core.connector.ConsentMgtInterceptor;
import org.wso2.carbon.consent.mgt.core.exception.ConsentManagementException;
import org.wso2.carbon.consent.mgt.core.model.AddReceiptResponse;
import org.wso2.carbon.consent.mgt.core.model.ConsentMessage;
import org.wso2.carbon.consent.mgt.core.model.PIICategory;
import org.wso2.carbon.consent.mgt.core.model.Purpose;
import org.wso2.carbon.consent.mgt.core.model.PurposeCategory;
import org.wso2.carbon.consent.mgt.core.model.Receipt;
import org.wso2.carbon.consent.mgt.core.model.ReceiptInput;
import org.wso2.carbon.consent.mgt.core.model.ReceiptListResponse;

import java.util.List;
import java.util.Map;

import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_ADD_PII_CATEGORY;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_ADD_PURPOSE;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_ADD_PURPOSE_CATEGORY;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_ADD_RECEIPT;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_DELETE_PII_CATEGORY;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_DELETE_PURPOSE;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants
        .POST_DELETE_PURPOSE_CATEGORY;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_GET_PII_CATEGORY;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants
        .POST_GET_PII_CATEGORY_BY_NAME;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants
        .POST_GET_PII_CATEGORY_LIST;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_GET_PURPOSE;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_GET_PURPOSE_BY_NAME;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_GET_PURPOSE_CATEGORY;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants
        .POST_GET_PURPOSE_CATEGORY_BY_NAME;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants
        .POST_GET_PURPOSE_CATEGORY_LIST;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_GET_PURPOSE_LIST;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_GET_RECEIPT;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants
        .POST_IS_PII_CATEGORY_EXIST;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants
        .POST_IS_PURPOSE_CATEGORY_EXIST;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_IS_PURPOSE_EXIST;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_LIST_RECEIPTS;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.POST_REVOKE_RECEIPT;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_ADD_PII_CATEGORY;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_ADD_PURPOSE;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_ADD_PURPOSE_CATEGORY;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_ADD_RECEIPT;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_DELETE_PII_CATEGORY;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_DELETE_PURPOSE;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants
        .PRE_DELETE_PURPOSE_CATEGORY;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_GET_PII_CATEGORY;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants
        .PRE_GET_PII_CATEGORY_BY_NAME;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_GET_PII_CATEGORY_LIST;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_GET_PURPOSE;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_GET_PURPOSE_BY_NAME;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_GET_PURPOSE_CATEGORY;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants
        .PRE_GET_PURPOSE_CATEGORY_BY_NAME;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants
        .PRE_GET_PURPOSE_CATEGORY_LIST;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_GET_PURPOSE_LIST;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_GET_RECEIPT;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_IS_PII_CATEGORY_EXIST;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants
        .PRE_IS_PURPOSE_CATEGORY_EXIST;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_IS_PURPOSE_EXIST;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_LIST_RECEIPTS;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.InterceptorConstants.PRE_REVOKE_RECEIPT;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.LIMIT;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.OFFSET;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PII_CATEGORY;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PII_CATEGORY_ID;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PII_CATEGORY_NAME;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PII_PRINCIPAL_ID;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PURPOSE;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PURPOSE_CATEGORY;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PURPOSE_CATEGORY_ID;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PURPOSE_CATEGORY_NAME;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PURPOSE_ID;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.PURPOSE_NAME;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.RECEIPT_ID;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.RECEIPT_INPUT;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.RESULT;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.SERVICE;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.SP_TENANT_DOMAIN;
import static org.wso2.carbon.consent.mgt.core.constant.ConsentConstants.STATE;

/**
 * This is a sample consent management interceptor which is an extension of {@link ConsentMgtInterceptor}.
 * This class will be called prior and post to all the consent management operations.
 * This class demonstrates all the available operations and respective operation properties.
 */
public class SampleInterceptor implements ConsentMgtInterceptor {


    private static final Log log = LogFactory.getLog(SampleInterceptor.class);

    public int getOrder() {
        return 0;
    }

    public void intercept(ConsentMessage consentMessage) throws ConsentManagementException {

        // Get the properties available in the intercepted message.
        Map<String, Object> operationProperties = consentMessage.getOperationProperties();

        // All the available properties for all types of operations.
        int purposeId;
        int piiCategoryId;
        int purposeCategoryId;
        int limit;
        int offset;
        String receiptId;
        String purposeName;
        String piiCategoryName;
        String purposeCategoryName;
        String piiPrincipalId;
        String spTenantDomain;
        String state;
        String service;
        Purpose purpose;
        PurposeCategory purposeCategory;
        PIICategory piiCategory;
        Receipt receipt;
        ReceiptInput receiptInput;
        Object result;

        if (PRE_ADD_PURPOSE.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_ADD_PURPOSE));

            purpose = (Purpose) operationProperties.get(PURPOSE);
        }

        if (POST_ADD_PURPOSE.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_ADD_PURPOSE));

            purpose = (Purpose) operationProperties.get(PURPOSE);
            Purpose purpose1 = (Purpose) operationProperties.get(RESULT);
        }

        if (PRE_GET_PURPOSE.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_GET_PURPOSE));

            purposeId = (int) operationProperties.get(PURPOSE_ID);
        }

        if (POST_GET_PURPOSE.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_GET_PURPOSE));

            purposeId = (int) operationProperties.get(PURPOSE_ID);
            Purpose purpose1 = (Purpose) operationProperties.get(RESULT);
        }

        if (PRE_GET_PURPOSE_BY_NAME.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_GET_PURPOSE_BY_NAME));

            purposeName = (String) operationProperties.get(PURPOSE_NAME);
        }

        if (POST_GET_PURPOSE_BY_NAME.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_GET_PURPOSE_BY_NAME));

            purposeName = (String) operationProperties.get(PURPOSE_NAME);
            Purpose purpose1 = (Purpose) operationProperties.get(RESULT);
        }

        if (PRE_GET_PURPOSE_LIST.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_GET_PURPOSE_LIST));

            limit = (int) operationProperties.get(LIMIT);
            offset = (int) operationProperties.get(OFFSET);
        }

        if (POST_GET_PURPOSE_LIST.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_GET_PURPOSE_LIST));

            limit = (int) operationProperties.get(LIMIT);
            offset = (int) operationProperties.get(OFFSET);
            List<Purpose> purposes = (List<Purpose>) operationProperties.get(RESULT);
        }

        if (PRE_DELETE_PURPOSE.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_DELETE_PURPOSE));

            purposeId = (int) operationProperties.get(PURPOSE_ID);
        }

        if (POST_DELETE_PURPOSE.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_DELETE_PURPOSE));

            purposeId = (int) operationProperties.get(PURPOSE_ID);
        }

        if (PRE_IS_PURPOSE_EXIST.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_IS_PURPOSE_EXIST));

            purposeName = (String) operationProperties.get(PURPOSE_NAME);
        }

        if (POST_IS_PURPOSE_EXIST.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_IS_PURPOSE_EXIST));

            purposeName = (String) operationProperties.get(PURPOSE_NAME);
            boolean isExist = (boolean) operationProperties.get(RESULT);
        }

        if (PRE_ADD_PURPOSE_CATEGORY.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_ADD_PURPOSE_CATEGORY));

            purposeCategory = (PurposeCategory) operationProperties.get(PURPOSE_CATEGORY);
        }

        if (POST_ADD_PURPOSE_CATEGORY.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_ADD_PURPOSE_CATEGORY));

            purposeCategory = (PurposeCategory) operationProperties.get(PURPOSE_CATEGORY);
            PurposeCategory purposeCategory1 = (PurposeCategory) operationProperties.get(RESULT);
        }

        if (PRE_GET_PURPOSE_CATEGORY.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_GET_PURPOSE_CATEGORY));

            purposeCategoryId = (int) operationProperties.get(PURPOSE_CATEGORY_ID);
        }

        if (POST_GET_PURPOSE_CATEGORY.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_GET_PURPOSE_CATEGORY));
            purposeCategoryId = (int) operationProperties.get(PURPOSE_CATEGORY_ID);
            PurposeCategory purposeCategory1 = (PurposeCategory) operationProperties.get(RESULT);
        }

        if (PRE_GET_PURPOSE_CATEGORY_BY_NAME.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_GET_PURPOSE_CATEGORY_BY_NAME));

            purposeCategoryName = (String) operationProperties.get(PURPOSE_CATEGORY_NAME);
        }

        if (POST_GET_PURPOSE_CATEGORY_BY_NAME.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_GET_PURPOSE_CATEGORY_BY_NAME));

            purposeCategoryName = (String) operationProperties.get(PURPOSE_CATEGORY_NAME);
            PurposeCategory purposeCategory1 = (PurposeCategory) operationProperties.get(RESULT);
        }

        if (PRE_GET_PURPOSE_CATEGORY_LIST.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_GET_PURPOSE_CATEGORY_LIST));

            limit = (int) operationProperties.get(LIMIT);
            offset = (int) operationProperties.get(OFFSET);
        }

        if (POST_GET_PURPOSE_CATEGORY_LIST.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_GET_PURPOSE_CATEGORY_LIST));

            limit = (int) operationProperties.get(LIMIT);
            offset = (int) operationProperties.get(OFFSET);
            List<PurposeCategory> purposeCategories = (List<PurposeCategory>) operationProperties.get(RESULT);
        }

        if (PRE_DELETE_PURPOSE_CATEGORY.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_DELETE_PURPOSE_CATEGORY));

            purposeCategoryId = (int) operationProperties.get(PURPOSE_CATEGORY_ID);
        }

        if (POST_DELETE_PURPOSE_CATEGORY.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_DELETE_PURPOSE_CATEGORY));

            purposeCategoryId = (int) operationProperties.get(PURPOSE_CATEGORY_ID);
        }

        if (PRE_IS_PURPOSE_CATEGORY_EXIST.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_IS_PURPOSE_CATEGORY_EXIST));

            purposeCategoryName = (String) operationProperties.get(PURPOSE_CATEGORY_NAME);
        }

        if (POST_IS_PURPOSE_CATEGORY_EXIST.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_IS_PURPOSE_CATEGORY_EXIST));

            purposeCategoryName = (String) operationProperties.get(PURPOSE_CATEGORY_NAME);
            boolean isExist = (boolean) operationProperties.get(RESULT);
        }

        if (PRE_ADD_PII_CATEGORY.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_ADD_PII_CATEGORY));

            piiCategory = (PIICategory) operationProperties.get(PII_CATEGORY);
        }

        if (POST_ADD_PII_CATEGORY.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_ADD_PII_CATEGORY));

            piiCategory = (PIICategory) operationProperties.get(PII_CATEGORY);
            PIICategory piiCategory1 = (PIICategory) operationProperties.get(RESULT);
        }

        if (PRE_GET_PII_CATEGORY.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_GET_PII_CATEGORY));

            piiCategoryId = (int) operationProperties.get(PII_CATEGORY_ID);
        }

        if (POST_GET_PII_CATEGORY.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_GET_PII_CATEGORY));

            piiCategoryId = (int) operationProperties.get(PII_CATEGORY_ID);
            PIICategory piiCategory1 = (PIICategory) operationProperties.get(RESULT);
        }

        if (PRE_GET_PII_CATEGORY_BY_NAME.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_GET_PII_CATEGORY_BY_NAME));

            piiCategoryName = (String) operationProperties.get(PII_CATEGORY_NAME);
        }

        if (POST_GET_PII_CATEGORY_BY_NAME.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_GET_PII_CATEGORY_BY_NAME));

            piiCategoryName = (String) operationProperties.get(PII_CATEGORY_NAME);
            PIICategory piiCategory1 = (PIICategory) operationProperties.get(RESULT);
        }

        if (PRE_GET_PII_CATEGORY_LIST.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_GET_PII_CATEGORY_LIST));

            limit = (int) operationProperties.get(LIMIT);
            offset = (int) operationProperties.get(OFFSET);
        }

        if (POST_GET_PII_CATEGORY_LIST.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_GET_PII_CATEGORY_LIST));

            limit = (int) operationProperties.get(LIMIT);
            offset = (int) operationProperties.get(OFFSET);
            List<PIICategory> piiCategories = (List<PIICategory>) operationProperties.get(RESULT);
        }

        if (PRE_DELETE_PII_CATEGORY.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_DELETE_PII_CATEGORY));

            piiCategoryId = (int) operationProperties.get(PII_CATEGORY_ID);
        }

        if (POST_DELETE_PII_CATEGORY.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_DELETE_PII_CATEGORY));

            piiCategoryId = (int) operationProperties.get(PII_CATEGORY_ID);
        }

        if (PRE_IS_PII_CATEGORY_EXIST.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_IS_PII_CATEGORY_EXIST));

            purposeName = (String) operationProperties.get(PURPOSE_NAME);
        }

        if (POST_IS_PII_CATEGORY_EXIST.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_IS_PII_CATEGORY_EXIST));

            purposeName = (String) operationProperties.get(PURPOSE_NAME);
            boolean isExist = (boolean) operationProperties.get(RESULT);
        }

        if (PRE_ADD_RECEIPT.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_ADD_RECEIPT));

            receiptInput = (ReceiptInput) operationProperties.get(RECEIPT_INPUT);
        }

        if (POST_ADD_RECEIPT.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_ADD_RECEIPT));

            receiptInput = (ReceiptInput) operationProperties.get(RECEIPT_INPUT);
            AddReceiptResponse receiptResponse = (AddReceiptResponse) operationProperties.get(RESULT);
        }

        if (PRE_GET_RECEIPT.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_GET_RECEIPT));

            receiptId = (String) operationProperties.get(RECEIPT_ID);
        }

        if (POST_GET_RECEIPT.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_GET_RECEIPT));

            receiptId = (String) operationProperties.get(RECEIPT_ID);
            Receipt receipt1 = (Receipt) operationProperties.get(RESULT);
        }

        if (PRE_REVOKE_RECEIPT.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_REVOKE_RECEIPT));

            receiptId = (String) operationProperties.get(RECEIPT_ID);
        }

        if (POST_REVOKE_RECEIPT.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_REVOKE_RECEIPT));

            receiptId = (String) operationProperties.get(RECEIPT_ID);
        }

        if (PRE_LIST_RECEIPTS.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", PRE_LIST_RECEIPTS));

            limit = (int) operationProperties.get(LIMIT);
            offset = (int) operationProperties.get(OFFSET);
            piiPrincipalId = (String) operationProperties.get(PII_PRINCIPAL_ID);
            spTenantDomain = (String) operationProperties.get(SP_TENANT_DOMAIN);
            service = (String) operationProperties.get(SERVICE);
            state = (String) operationProperties.get(STATE);
        }

        if (POST_LIST_RECEIPTS.equals(consentMessage.getOperation())) {

            log.info(String.format("Event %s triggered.", POST_LIST_RECEIPTS));

            limit = (int) operationProperties.get(LIMIT);
            offset = (int) operationProperties.get(OFFSET);
            piiPrincipalId = (String) operationProperties.get(PII_PRINCIPAL_ID);
            spTenantDomain = (String) operationProperties.get(SP_TENANT_DOMAIN);
            service = (String) operationProperties.get(SERVICE);
            state = (String) operationProperties.get(STATE);
            List<ReceiptListResponse> receiptListResponses = (List<ReceiptListResponse>) operationProperties.get
                    (RESULT);
        }
    }
}
