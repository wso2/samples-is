# Sample OAuth2 Client Authenticator

OAuth 2 client authentication is the process of identifying and authenticating the client of an incoming request.
According to the [specification](http://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication) clients can be authenticated in multiple ways. ex - using client id and client secret
.Using client id and client secret also has two flavours. Client id and secret can be either sent as HTTP authorization
header or client id and secret can be sent in the request body.

There are few other methods also defined in the specification such as private_key_jwt authentication. The
private_key_jwt client authenticator can be found in the git repo [2]

This sample comprises of a very basic level OAuth client authenticator which will demonstrate key concepts and
implementation guide lines of an OAuth2 client authenticator.

The idea behind this authenticator is, this will be able to authenticate clients who have two separate HTTP headers as
"client_id" and "client_secret" carrying the values of client id and client secret of an oauth application repectively.

Based on the content of these two headers, the client authentication will be done. If you are searching for the
difference between our OOTB BasicOAuthClientAuthenticator and this , Basic Client authenticator expects to have an HTTP
header "Authorization" with value Basic (base64encoded(client_id:client_secret)) or it expects to have
client_id=qwertyuiosdfghjk&client_secret=zxcvbnmsdfghj in the body of the request. But this sample authenticator only
expects to have client id and secret as two separate HTTP headers.

## Table of contents

- [Getting started](#getting-started)
- [Useful links](#useful-links)

## Getting started

### Prerequisites

* [Maven](https://maven.apache.org/download.cgi)
* [Java](http://www.oracle.com/technetwork/java/javase/downloads)
* [cURL](https://curl.haxx.se/download.html)

cURL is required to run specific command only. It is not a requirement for WSO2 IS.

### Building from source

In the following instructions, WSO2 IS installation directory will be referred as `<IS_HOME>`

1. Get a clone or download source of [WSO2 sample-is repository](https://github.com/wso2/samples-is).
   
   We will refer this directory as `<IS_SAMPLE_REPO>` here onwards.
2. Run the Maven command `mvn clean install` from the `<IS_SAMPLE_REPO>/etc/oauth-sample-client-authenticator` directory.
3. Build jar can be found at 
   `<IS_SAMPLE_REPO>/etc/oauth-sample-client-authenticator/target/org.wso2.carbon.identity.oauth.client.auth.sample-<VERSION>`
   
   Here the version will be same as repository's current version
4. Copy the jar to `<IS_HOME>/repository/components/dropins`
5. Start WSO2 IS.
6. Once the server is started, log in to the management console and create a service provider. Generate client id
and secrets for the OAuth/OpenID Connect application.
7. Use the following curl command to retrieve a token using password grant type. Replace the client_id and secret with
your generated client id and secret.

       curl -k -d "grant_type=password&username=admin&password=admin" -H "Content-Type: application/x-www-form-urlencoded" https://localhost:9443/oauth2/token -i -H "client_id: 5Me6ta8IqnrcTN07t5SZ8OPqS0Qa" -H "client_secret: jih0VuTzAVa4Mqm3auATbAQgCA0a"
    
You will successfully get the token. The way you used to authenticate the client is our new protocol which is using 
client id and secret as separate headers.

## Useful links

* For more information please refer [Openid Connect specification](http://openid.net/specs/openid-connect-core-1_0.html).
