# Sample App for Rich Authorization Requests (RAR) - AuthorizationDetailsProcessor

This is a extension written by implementing `AuthorizationDetailsProcessor` interface to validate the `booking_creation` type authorization details.

## Build and Deploy Guide

Follow these steps to build the repository and deploy the generated JAR file:

### Step 1: Build the Repository
1. Open a terminal and navigate to the `samples-is/rar-samples/ticket-booking-app/authorization-processor` directory of the project.
2. Run the following command to build the project:
    ```bash
    mvn clean install
    ```
    This will compile the code, run tests, and package the project into a JAR file.

### Step 2: Locate the Generated JAR
1. After the build is complete, navigate to the `target` folder inside the `validator` module:
    ```bash
    cd components/validator/target
    ```
2. Locate the generated JAR file. It will have a name similar to `org.wso2.samples.is.rar.ticket.booking.app.validator-<version>.jar`.

### Step 3: Copy the JAR to Identity Server
1. Copy the JAR file to the `dropins` folder of your WSO2 Identity Server pack:
    ```bash
    cp org.wso2.samples.is.rar.ticket.booking.app.validator-<version>.jar <IS_HOME>/repository/components/dropins/
    ```

### Step 4: Restart the Identity Server
1. Navigate to the `<IS_HOME>/bin` directory.
2. Restart the server.
