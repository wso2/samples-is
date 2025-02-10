const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const util = require('util');
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory session store
const sessionStore = new Map();

const path = require("path");

// Configuration settings
const config = {
    AUTH_MODE: process.env.AUTH_MODE || "federated",
    BASE_WSO2_IAM_PROVIDER_URL: process.env.BASE_WSO2_IAM_PROVIDER_URL || "https://localhost:9443",
    HOST_URL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
};

// Load users from environment or local file in development
let userConfig = {};
if (process.env.USER_CONFIG) {
    userConfig = JSON.parse(process.env.USER_CONFIG);
} else {
    try {
        const usersFilePath = path.resolve(__dirname, "../data/users.json");
        userConfig = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
        console.log("Loaded users from local file");
    } catch (error) {
        console.error("Error loading users.json:", error);
    }
}

// Load users from config
const getUserDatabase = () => {
    const { federated = [], internal = [] } = userConfig;
    return config.AUTH_MODE === "federated" ? federated : config.AUTH_MODE === "internal" ? internal : [...federated, ...internal];
};

// Utility function for structured error handling
const handleError = (res, status, errorMessage, errorDescription) => {
    const response = { actionStatus: "ERROR", errorMessage, errorDescription };
    console.error(response);
    return res.status(status).json(response);
};

// Log requests and responses
const logRequest = (req) => {

    console.log("Request Received", {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        body: util.inspect(req.body, { depth: null })
    });
};

const logResponse = (req, resBody) => {
    console.log("Response Sent", {
        url: req.originalUrl,
        responseBody: util.inspect(resBody, { depth: null })
    });
};

// Health Check Endpoint
app.get("/api/health", (req, res) => {
    logRequest(req);
    const response = { status: "ok", message: "Service is running." };
    logResponse(req, response);
    res.json(response);
});

// Handle Authentication Request
app.post("/api/authenticate", (req, res) => {
    logRequest(req);
    const { flowId, event } = req.body;

    if (!flowId) return handleError(res, 400, "missingFlowId", "Flow ID is required.");

    if (!sessionStore.has(flowId)) {
        sessionStore.set(flowId, { tenant: event.tenant.name, user: config.AUTH_MODE === "second_factor" ? event.user : null });
        const pinEntryUrl = `${config.HOST_URL}/api/pin-entry?flowId=${flowId}`;
        const response = { actionStatus: "INCOMPLETE", operations: [{ op: "redirect", url: pinEntryUrl }] };
        logResponse(req, response);
        return res.json(response);
    }

    const session = sessionStore.get(flowId);
    const response = session.status === "SUCCESS" ? { actionStatus: "SUCCESS", data: { user: session.user } } :
        { actionStatus: "FAILED", failureReason: "userNotFound", failureDescription: "Unable to find user for given credentials." };
    logResponse(req, response);
    return res.json(response);;
});

// Serve PIN Entry Page
app.get("/api/pin-entry", (req, res) => {
    logRequest(req);
    const { flowId } = req.query;
    if (!flowId || !sessionStore.has(flowId)) return res.status(400).send("Invalid or expired Flow ID.");

    const session = sessionStore.get(flowId);
    const userField = config.AUTH_MODE === "second_factor" && session.user ? 
        `<input type="hidden" name="userId" value="${session.user.id}" />` : 
        '<input type="text" name="username" required placeholder="Username" />';

    const response = `
        <html>
        <body>
            <h2>Enter Your PIN</h2>
            <form action="/api/validate-pin" method="POST">
                <input type="hidden" name="flowId" value="${flowId}" />
                <input type="hidden" name="tenant" value="${session.tenant}" />
                ${userField}
                <input type="password" name="pin" required placeholder="PIN"/>
                <button type="submit">Submit</button>
            </form>
        </body>
        </html>
    `;
    res.send(response);
});

// Validate PIN & Redirect
app.post("/api/validate-pin", (req, res) => {
    logRequest(req);
    const { flowId, userId, username, pin, tenant } = req.body;

    console.log("session", sessionStore.get(flowId));

    if (!flowId || !tenant) return handleError(res, 400, "validationError", "Session correlating data not found.");

    const userDatabase = getUserDatabase();
    let userAuthenticating = config.AUTH_MODE === "second_factor" ? userDatabase.find(u => u.id === userId) : userDatabase.find(u => u.username === username);
    let userReferencedForPin = userDatabase.find(u => u.pin === pin);

    if (userAuthenticating && userReferencedForPin && userAuthenticating.id === userReferencedForPin.id) {
        sessionStore.set(flowId, { status: "SUCCESS", user: userReferencedForPin.data });
    } else {
        sessionStore.set(flowId, { status: "FAILED" });
    }

    const redirectUrl = `${config.BASE_WSO2_IAM_PROVIDER_URL}/t/${tenant}/commonauth?flowId=${flowId}`;
    logResponse(req, { redirectingTo: redirectUrl });
    return res.redirect(redirectUrl);
});

// Start server
if (require.main === module) {
    app.listen(3000, () => console.log(`Server running on http://localhost:3000`));
}

// Export app
module.exports = app;
