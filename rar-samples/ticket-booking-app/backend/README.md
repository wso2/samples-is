# Sample App for Rich Authorization Requests (RAR) - Backend

This is the backend of a ticket booking application.

 ## Table of Contents
 1. [API Endpoint](#api-endpoint)
 2. [Configure an Application in WSO2 Identity Server](#configure-an-application-in-wso2-identity-server)
 3. [Configure the `config.json` File](#configure-the-configjson-file)
 4. [Run the application](#run-the-application)

## API Endpoint

### Description
The `/booking-creation` endpoint is used to create a new booking in the system. It accepts a JSON payload with the booking details, processes the request, and returns a response indicating success or failure.

### Request
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Payload**:
    ```json
    {
        "name":"The Godfather",
        "ticketCount":3,
        "location":"Zephyria",
        "totalAmount":38.97,
        "bookingType":"film"
    }
    ```

### Response
- **Success**:
    - **Status Code**: `201 Created`
    - **Body**:
        ```json
        {
            "data": "Success"
        }
        ```
- **Error**:
    - **Status Code**: `401 Unauthorized`
    - **Body**:
        ```json
        {
            "error": "Unauthorized",
            "description": "Authorization details are missing."
        }
        ```

    - **Status Code**: `403 Forbidden`
    - **Body**:
        ```json
        {
            "error": "Forbidden",
            "description": "You are not allowed to create bookings."
        }
        ```
    
    - **Status Code**: `403 Forbidden`
    - **Body**:
        ```json
        {
            "error": "Forbidden",
            "description": "You are exceeding the allowed limit for booking creation."
        }
        ```

    - **Status Code**: `500 Internal Server Error`
    - **Body**:
        ```json
        {
            "error": "Internal Server Error",
            "description": "Failed to process the request."
        }
        ```

## Configure an Application in WSO2 Identity Server

To enable communication between this backend application and the authorization server, you need to configure an application in WSO2 Identity Server. Follow these steps:

1. **Log in to the WSO2 Identity Server Console**  
    Access the WSO2 Identity Server Management Console by navigating to `https://<IS_HOST>:<PORT>/console`.

2. **Navigate to Applications**  
    In the left-hand menu, click on **Applications**.

3. **Create a New Application**  
    - Click on the **New Application** button.
    - Select **Standard-Based Application** from the list of application types.

4. **Configure Basic Information**  
    - Provide a **Name** for the application (e.g., `RAR Sample App Backend`).
    - Optionally, add a description.

7. **Save the Application**  
    - Click **Create** to save the application configuration.

8. **Obtain Client Credentials**  
    - After saving, you will be provided with the **Client ID** and **Client Secret** from `Protocol` tab.
    - Use these credentials in your backend application to communicate with the Identity Server.

## Configure the `config.json` File

After obtaining the **Client ID** and **Client Secret**, you need to configure the `config.json` file in your backend application. Follow these steps:

1. **Locate the `config.json` File**  
    Navigate to the root directory where the `config.json` file is located in your backend application.

2. **Update the Base URL**  
    Set the `baseUrl` to the URL of your WSO2 Identity Server. For example:
    ```json
    "baseUrl": "https://<IS_HOST>:<PORT>/t/<TENANT_DOMAIN>"
    ```

3. **Add the Client ID and Client Secret**  
    Update the `clientId` and `clientSecret` fields with the values obtained from the WSO2 Identity Server:
    ```json
    "clientId": "<YOUR_CLIENT_ID>",
    "clientSecret": "<YOUR_CLIENT_SECRET>"
    ```

4. **Configure Allowed Origins**  
    Specify the allowed origins for your application. For example:
    ```json
    "allowedOrigins": [
            "http://localhost:3000",
            "https://your-frontend-app.com"
    ]
    ```

5. **Save the File**  
    Save the changes to the `config.json` file.

## Run the application

To run the backend server, follow these steps:

1. **Install Dependencies**
    Navigate to the root directory of the application and run the following command to install the required dependencies:
    ```bash
    npm install
    ```

2. **Start the Server**
    After the dependencies are installed, start the server by running:
    ```bash
    npm start
    ```

3. **Verify the Server**
    Once the server is running, you can verify it by accessing the API endpoint (e.g., `http://localhost:3000/booking-creation`) using a tool like Postman or cURL.
