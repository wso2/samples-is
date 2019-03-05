/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
package org.wso2.sample.identity.backend;

import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.wso2.msf4j.Request;

import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * Booking service
 */
@Path("/bookings")
public class BookingService {

    private static final Logger LOGGER = LoggerFactory.getLogger(BookingService.class);

    // Simply store requests and response them for requests
    private static final JSONObject JSON_OBJECT = new JSONObject();
    private static int index = 0;

    // Config properties
    private final Properties properties;
    private final IntrospectionHandler introspectionHandler;

    public BookingService(final Properties properties) {

        this.properties = properties;
        this.introspectionHandler =
                new IntrospectionHandler(
                        properties.getProperty("introspectionEndpoint"),
                        Boolean.parseBoolean(properties.getProperty("introspectionEnabled")));
    }

    @OPTIONS
    public Response bookingsOptions() {

        LOGGER.info("OPTIONS /bookings");

        return Response
                .status(Response.Status.OK)
                .header("Access-Control-Allow-Origin", "*")
                .header("X-Content-Type-Options", "nosniff")
                .header("Access-Control-Allow-Headers", "Authorization, Content-Type")
                .header("Access-Control-Allow-Methods", "OPTIONS, POST, HEAD, GET")
                .build();
    }

    @GET
    public Response bookingsGet(@Context Request request) {

        LOGGER.info("GET /bookings");

        // Validate for authorization
        if (!this.introspectionHandler.isAuthorized(request.getHeader("Authorization"))) {
            return Response
                    .status(Response.Status.UNAUTHORIZED)
                    .header("Access-Control-Allow-Origin", "*")
                    .build();
        }

        return Response
                .status(Response.Status.OK)
                .header("Access-Control-Allow-Origin", "*")
                .entity(JSON_OBJECT.toString())
                .type(MediaType.APPLICATION_JSON_TYPE)
                .build();
    }

    @POST
    public Response bookingsPost(@Context Request request) throws IOException {

        LOGGER.info("POST /bookings");

        // Validate for authorization
        if (!this.introspectionHandler.isAuthorized(request.getHeader("Authorization"))) {
            return Response
                    .status(Response.Status.UNAUTHORIZED)
                    .header("Access-Control-Allow-Origin", "*")
                    .build();
        }

        final BufferedInputStream bufferedInputStream = new BufferedInputStream(request.getMessageContentStream());
        final ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try {
            int nextByte;

            while ((nextByte = bufferedInputStream.read()) != -1) {
                byteArrayOutputStream.write(nextByte);
            }
        } catch (final IOException e) {
            LOGGER.error("Error while reading request body.", e);
            throw e;
        }

        final JSONObject requestJson;

        try {
            requestJson = new JSONObject(byteArrayOutputStream.toString());
        } catch (final JSONException e) {
            LOGGER.error("Error while converting body to json.", e);
            throw e;
        }

        requestJson.put("ref-id", index);

        // Store bookings
        JSON_OBJECT.append("bookings", requestJson);

        // Create response
        final JSONObject responseJson = new JSONObject();
        responseJson.put("status", "ok");
        responseJson.put("ref-id", index);

        index += 1;

        return Response
                .status(Response.Status.OK)
                .header("Access-Control-Allow-Origin", "*")
                .entity(responseJson.toString())
                .type(MediaType.APPLICATION_JSON_TYPE)
                .build();
    }
}
