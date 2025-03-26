/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import express from 'express';
import cors from 'cors';
import axios from 'axios';
import https from 'https';
import IDPConfig from './config.json' assert { type: 'json' };

// Added to compress self signed cert validation
const agent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
});
const corsOptions = {
    origin: IDPConfig.allowedOrigins,
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
    credentials: true,
    enablePreflight: true
}

const app = express();

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

const getAuthHeader = () => {
    const authString = `${IDPConfig.clientId}:${IDPConfig.clientSecret}`;
    return "Basic " + Buffer.from(authString).toString("base64");
};

app.post("/booking-creation", async (req, res) => {
    try {
        const token = req?.headers?.authorization?.split(" ")[1];
        const bookingType = req?.body?.bookingType;
        const totalAmount = req?.body?.totalAmount;

        // Check whether the token is available.
        if (!token) {
            return res.status(401).json({
                error: "Unauthorized",
                description: "Authorization details are missing.",
            })
        }

        // Introspect the token to get the authorization details.
        const response = await axios.post(`${IDPConfig.baseUrl}/oauth2/introspect`, {
            token
        }, {
            headers: {
                Authorization: getAuthHeader(),
                Accept: "*/*",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            httpsAgent: agent // Attach the custom agent
        });

        // Validate the authorization details with the booking type and total amount.
        if (response.status == 200) {
            const authorizationDetails = response?.data?.["authorization_details"];
            if (!authorizationDetails?.[0] || authorizationDetails[0].bookingType !== bookingType) {
                return res.status(403).json({
                    error: "Forbidden",
                    description: "You are not allowed to create bookings.",
                });
            }
            if (authorizationDetails[0].allowedAmount.limit < totalAmount) {
                return res.status(403).json({
                    error: "Forbidden",
                    description: "You are exceeding the allowed limit for booking creation.",
                });
            }
            return res.status(201).json({ data: "Success" });
        }
        res.status(500).json({ error: "Internal Server Error", description: "Failed to process the request." });
    } catch (error) {
        console.error("Error while introspecting the token: ", error);
        res.status(500).json({ error: "Internal Server Error", description: "Failed to process the request." });
    }
});

const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, () =>
    console.log(`🌐 Server running at: http://${HOST}:${PORT}`)
);
