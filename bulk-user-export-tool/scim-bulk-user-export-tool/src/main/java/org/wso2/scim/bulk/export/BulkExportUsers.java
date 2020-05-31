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
import java.io.IOException;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

public class BulkExportUsers {

    private static final String SCIM_USER_ENDPOINT = "scim2/Users";
    private static final String PATH_SEPARATOR = "/";
    private static final String NONE = "none";
    private static final String DEFAULT_CSV_FILE = "users.csv";

    private static final Logger LOGGER = Logger.getLogger(BulkExportUsers.class.getName());

    public static void main(String args[]) throws IOException, KeyStoreException,
            NoSuchAlgorithmException, KeyManagementException, URISyntaxException {

        if (args.length < 6) {
            LOGGER.log(Level.INFO,
                    "Invalid arguments! Please provide valid arguments to host address, username and password.");
            return;
        }

        Set<String> attributesToExclude = new HashSet<>(Arrays.asList("schemas", "meta_location",
                "meta_lastModified", "meta_resourceType"));
        String hostAddress = args[0];
        String username = args[1];
        String password = args[2];
        String csvDirectory = DEFAULT_CSV_FILE;

        if (!NONE.equals(args[3])) {
            csvDirectory = args[3];
        }

        String attributes = null;
        if (!NONE.equals(args[4])) {
            attributes = args[4];
        }

        if (!NONE.equals(args[5])) {
            attributesToExclude.addAll(Arrays.asList(args[5].split(",")));
        }

        // Create a get request to retrieve list users from SCIM 2.0
        URIBuilder builder = new URIBuilder(hostAddress + PATH_SEPARATOR + SCIM_USER_ENDPOINT);
        if (attributes != null) {
            builder.setParameter("attributes", attributes);
        }

        HttpGet request = HttpClient.createGetHttpRequest(builder, username, password);

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

                // ArrayNode to store flattened user information.
                ArrayNode usersArrayNode = new ObjectMapper().createArrayNode();

                // Create a flattened user information array.
                if (usersNode.isArray()) {
                    ArrayNode arrayNode = (ArrayNode) usersNode;
                    for (int i = 0; i < arrayNode.size(); i++) {
                        JsonNode arrayElement = arrayNode.get(i);
                        usersArrayNode.add(JSONFlattener.generateFlatJSON(new ObjectMapper().createObjectNode(),
                                arrayElement, null, attributesToExclude));
                    }
                }

                // Create a csv schema and generate the csv file containing user information.
                CsvSchema.Builder csvSchemaBuilder = CsvSchema.builder();
                for (int i = 0; i < usersArrayNode.size(); i++) {
                    usersArrayNode.get(i).fieldNames().forEachRemaining(
                            fieldName -> {
                                if (!csvSchemaBuilder.hasColumn(fieldName)) {
                                    csvSchemaBuilder.addColumn(fieldName);
                                }
                            });
                }
                CsvSchema csvSchema = csvSchemaBuilder.build().withHeader();

                CsvMapper csvMapper = new CsvMapper();
                csvMapper.writerFor(ArrayNode.class)
                        .with(csvSchema)
                        .writeValue(new File(csvDirectory), usersArrayNode);
                LOGGER.log(Level.INFO, "User information was successfully written to : " + csvDirectory + " file.");
            } else {
                LOGGER.log(Level.INFO, request.getMethod() + " Request to " + request.getURI().toString() +
                        " returned the status code : " + response.getStatusLine());
            }
        }
    }
}
