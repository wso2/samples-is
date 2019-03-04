# Backend service

### Introduction

A simple, [msf4j](https://github.com/wso2/msf4j) based backend service to store and retrieve 
[is-sample bookings](https://github.com/wso2/samples-is/tree/master/sso-samples).

By default services are not protected. It is possible enable bearer token authorization by either changing 
`service.properties` or through startup parameters. Following are supported startup parameters,

* -port : Change the running port of the backend service. Default is 39090
* -introspectionEnabled : Enable or disable bearer token introspection. Accepts true or false boolean values. Default is false (no introspection)
* -introspectionEndpoint : WSO2 IS introspection endpoint that needs to be invoked for token introspection. Default is https://localhost:9443/oauth2/introspect

Application startup with default values,

`java -jar backend-service.jar`

Application startup with altered port and introspection enabled,


`java -jar backend-service.jar -port 8787 -introspectionEnabled true`

### Running the service

You can invoke following endpoints to store and retrieve bookings,

* GET /bookings : Retrieve stored bookings. Response contains currently stored bookings

`curl -i -H "Authorization: Bearer <ACCESS_TOKEN>" -X GET http://localhost:39090/bookings`

* POST /bookings : Store a booking. Response will be internal ID and a status

`curl -i -H "Authorization: Bearer <ACCESS_TOKEN>" -H "Content-type: application/json" -X POST -d '{"driver": "Alex","client": "Mike","client-phone": "678"}' http://localhost:39090/bookings`

### Building from source

In case you want to build the application from source, follow these steps.

checkout [is-sample repository](https://github.com/wso2/samples-is). Navigate to <IS_SAMPLE_REPOSITORY>/etc/backend-service.
Build the application by running `mvn clean install` command from this directory. Distribution, `backend-service.jar` can
be found at target directory.


