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
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.util.EntityUtils;

import javax.net.ssl.SSLContext;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.Collections;
import java.util.logging.Level;
import java.util.logging.Logger;

public class BulkExportUsers {

    private static final String SCIM_USER_ENDPOINT = "scim2/Users";
    private static final String PATH_SEPARATOR = "/";
    private static final String NONE = "none";
    private static final String DEFAULT_CSV_FILE = "users.csv";
    private static final int START_INDEX = 1;
    private static final int DEFAULT_COUNT = 100;
    private static final int MAX_COUNT = -1;

    private static final Logger LOGGER = Logger.getLogger(BulkExportUsers.class.getName());

    public static void main(String[] args) throws IOException, KeyStoreException,
            NoSuchAlgorithmException, KeyManagementException, URISyntaxException {

        if (args.length < 6) {
            LOGGER.log(Level.INFO,
                    "Invalid arguments! Please provide valid arguments to host address, username and password.");
            return;
        }

        String attributesToExclude = "schemas,meta_location,meta_lastModified,meta_resourceType";
        String userstoreDomain = null;
        String hostAddress = args[0];
        String username = args[1];
        String password = args[2];
        String csvDirectory = DEFAULT_CSV_FILE;
        int startIndex = START_INDEX;
        int batchCount = DEFAULT_COUNT;
        int maxCount = MAX_COUNT;

        if (!NONE.equals(args[3])) {
            csvDirectory = args[3];
        }

        String attributes = null;
        if (!NONE.equals(args[4])) {
            attributes = args[4];
        }

        if (!NONE.equals(args[5])) {
            attributesToExclude += "," + args[5];
        }

        if (!NONE.equals(args[6])) {
            userstoreDomain = args[6];
        }

        if (!NONE.equals(args[7])) {
            startIndex = Integer.parseInt(args[7]);
        }

        if (!NONE.equals(args[8])) {
            batchCount = Integer.parseInt(args[8]);
        }

        if (!NONE.equals(args[9])) {
            maxCount = Integer.parseInt(args[9]);
        }

        // Create a get request to retrieve list users from SCIM 2.0.
        URIBuilder builder = new URIBuilder(hostAddress + PATH_SEPARATOR + SCIM_USER_ENDPOINT);

        // CsvSchema Builder and CsvMapper to generate the csv.
        CsvSchema.Builder csvSchemaBuilder = CsvSchema.builder();
        CsvSchema csvSchema = null;
        CsvMapper csvMapper = new CsvMapper();

        // Initialize the CSV file.
        File file = new File(csvDirectory);

        // ArrayNode to store flattened user information.
        ArrayNode usersArrayNode = new ObjectMapper().createArrayNode();;

        while (true) {
            if (maxCount != -1 && maxCount < startIndex) {
                LOGGER.log(Level.INFO, "Maximum count: " + maxCount + " reached.");
                break;
            }

            if (attributes != null) {
                builder.setParameter("attributes", attributes);
            }

            if (userstoreDomain != null) {
                builder.setParameter("domain", userstoreDomain);
            }

            builder.setParameter("excludedAttributes", attributesToExclude);
            builder.setParameter("startIndex", Integer.toString(startIndex));
            builder.setParameter("count", Integer.toString(batchCount));

            LOGGER.log(Level.INFO, "Retrieving " + batchCount + " users starting from: " + startIndex);
            HttpGet request = HttpClient.createGetHttpRequest(builder, username, password);
            startIndex += batchCount;

            final SSLContext sslContext = new SSLContextBuilder()
                    .loadTrustMaterial(null, (x509CertChain, authType) -> true)
                    .build();

            try (CloseableHttpClient client = HttpClientBuilder.create()
                    .setSSLContext(sslContext)
                    .build();) {
                HttpResponse response = client.execute(request);

                String stringResponse;
                // Check response status code is OK
                if (HttpStatus.SC_OK == response.getStatusLine().getStatusCode()) {
                    stringResponse = EntityUtils.toString(response.getEntity(), "UTF-8");
                    JsonNode jsonTree = new ObjectMapper().readTree(stringResponse);
                    JsonNode usersNode = jsonTree.at("/Resources");

                    // Create a flattened user information array.
                    if (usersNode.isArray()) {
                        ArrayNode arrayNode = (ArrayNode) usersNode;
                        for (int i = 0; i < arrayNode.size(); i++) {
                            JsonNode arrayElement = arrayNode.get(i);
                            usersArrayNode.add(JSONFlattener.generateFlatJSON(new ObjectMapper().createObjectNode(),
                                    arrayElement, null, Collections.emptySet()));
                        }

                        if (arrayNode.size() < batchCount) {
                            LOGGER.log(Level.INFO, "End of results reached.");
                            break;
                        }
                    } else {
                        LOGGER.log(Level.INFO, "End of results reached.");
                        break;
                    }

                } else {
                    LOGGER.log(Level.SEVERE, request.getMethod() + " Request to " + request.getURI().toString() +
                            " returned the status code : " + response.getStatusLine());
                    return;
                }
            }
        }

        // Create CSV schema and file after receiving all the user data
        for (int i = 0; i < usersArrayNode.size(); i++) {
            usersArrayNode.get(i).fieldNames().forEachRemaining(
                    fieldName -> {
                        if (!csvSchemaBuilder.hasColumn(fieldName)) {
                            csvSchemaBuilder.addColumn(fieldName);
                        }
                    });
        }
        csvSchema = csvSchemaBuilder.build().withHeader();

        csvMapper.writerFor(ArrayNode.class)
                .with(csvSchema)
                .writeValue(new FileWriter(file), usersArrayNode);

        if (usersArrayNode.size() == 0) {
            LOGGER.log(Level.WARNING, "Empty results returned. CSV file is not created.");
        } else {
            LOGGER.log(Level.INFO, "User information was successfully written to : " + csvDirectory + " file.");
        }
    }
}
