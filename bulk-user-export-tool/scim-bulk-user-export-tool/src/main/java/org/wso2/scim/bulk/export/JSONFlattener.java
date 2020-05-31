/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.scim.bulk.export;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.Iterator;
import java.util.Set;

public class JSONFlattener {

    private static final String EMAILS_ATTRIBUTE = "emails";
    private static final String FIELD_SEPARATOR = "_";
    private static final String TYPE_ATTRIBUTE = "type";
    private static final String VALUE_ATTRIBUTE = "value";
    private static final String DEFAULT_TYPE = "work";

    /**
     * Generate a flattened json node from the given hierarchical json node.
     *
     * @param flatJsonNode flat json node to be created.
     * @param node Hierarchical JSON node.
     * @param prefix prefix is used to preserve hierarchy in flat node.
     * @param excludedAttributes attributes to exclude when converting to flat JSON.
     * @return flattened JSON node.
     */
    public static ObjectNode generateFlatJSON(ObjectNode flatJsonNode, JsonNode node, String prefix,
                                              Set<String> excludedAttributes) {

        if (flatJsonNode == null) {
            flatJsonNode = new ObjectMapper().createObjectNode();
        }

        if(node.isObject()){
            Iterator<String> fieldNames = node.fieldNames();

            while(fieldNames.hasNext()) {
                String fieldName = fieldNames.next();
                JsonNode subNode = node.get(fieldName);
                if (prefix != null ) {
                    if (!excludedAttributes.contains(prefix + FIELD_SEPARATOR + fieldName)) {
                        generateFlatJSON(flatJsonNode, subNode, prefix + FIELD_SEPARATOR + fieldName,
                                excludedAttributes);
                    }
                } else if (!excludedAttributes.contains(fieldName)){
                    generateFlatJSON(flatJsonNode, subNode, fieldName, excludedAttributes);
                }
            }
        } else if(node.isArray() && !excludedAttributes.contains(prefix)){
            ArrayNode arrayNode = (ArrayNode) node;
            for(int i = 0; i < arrayNode.size(); i++) {
                JsonNode arrayElement = arrayNode.get(i);
                if (arrayElement.get(TYPE_ATTRIBUTE) != null) {
                    generateFlatJSON(flatJsonNode, arrayElement.get(VALUE_ATTRIBUTE),
                            prefix + "_" + arrayElement.get(TYPE_ATTRIBUTE).textValue(), excludedAttributes);
                } else {
                    if (prefix.contains(EMAILS_ATTRIBUTE)) {
                        generateFlatJSON(flatJsonNode, arrayElement,
                                prefix + "_" + DEFAULT_TYPE, excludedAttributes);
                    } else {
                        generateFlatJSON(flatJsonNode, arrayElement,
                                prefix + String.valueOf(i), excludedAttributes);
                    }
                }
            }
        } else if (!excludedAttributes.contains(prefix)) {
            flatJsonNode.put(prefix, node.textValue());
        }
        return flatJsonNode;
    }
}
