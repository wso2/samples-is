Sample OAuth2 Client Authenticator

OAuth 2 client authentication is the process of identifying and authenticating the client of an incoming request.
According to the specification [1] clients can be authenticated in multiple ways. ex - using client id and client secret
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


How to Deploy the sample.

1) Clone the project from GitHub and build it using the following command.

mvn clean install

2) Get the built jar which resides in target directory with name org.wso2.carbon.identity.oauth.client.auth
.sample-<version>

3) Copy the jar to <IS_HOME>/repository/components/dropins

4) Start Identity Server once the jar is copied.

5) Once the server is started, log in to the management console and create a service provider. Generate client id
and secrets for the oauth application.

6) Use the following curl command to retrieve a token using password grant type. Replace the client_id and secret with
your generated client id and secret.


curl -k -d "grant_type=password&username=admin&password=admin" -H "Content-Type: application/x-www-form-urlencoded" https://localhost:9443/oauth2/token -i -H "client_id: 5Me6ta8IqnrcTN07t5SZ8OPqS0Qa" -H "client_secret: jih0VuTzAVa4Mqm3auATbAQgCA0a"

You will successfully get the token. The way you used to authenticate the client is our new protocol which is using client id and secret as separate headers.

[1] http://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication