# Ciba Proxy Approach
Being developed to extend IS of WSO2 to support Client Initiated Backchannel Authentication.
A POC for demonstration that CIBA can be applicable to real world scenarios.


## Reason for Implementation
* In all of the flows initiated by the RP[Relying Party-client App] in regard to  OpenID Connect Authentication flow, the end-user interaction from the consumption device is required and are based on HTTP redirection mechanisms. 

* But there has become a necessity where the RP needs to be the initiator of the user authentication flow and end-user interaction from the consumption device is not needed.

* That is, required to decouple consumption device[RP] from Authentication.CIBA decouples the Consumption device [Say POS] from Authentication device [eg: Phone]. 


## Flow as per the spec:

![flow](https://miro.medium.com/max/1000/1*hIH7HdHg6P9eaRby1zA1Gg.png)
* This specification does not change the semantics of the OpenID Connect Authentication flow. 
* It introduces a new endpoint to which the authentication request is posted. 
* It introduces a new asynchronous method for authentication result notification or delivery. 
* It does not introduce new scope values nor does it change the semantics of standard OpenID Connect parameters.

1. Consumption device obtains a valid identifier for the user they want to authenticate.
2. Consumption device initiates an interaction flow to authenticate their users(Authentication Request).
3. Authorization Issues a Authentication Response.
4. Authorization Server, requests Authentication Device for Consent and credentials. 
5. Authentication Device prompts for credentials and consent.
6. End User provides consent and Credentials.
7. Authorization Server authenticates and send Notification to Consumption device about Token.
8. Consumption device requests Token.
9. Authorization sends Token Response.

* The flow after 6 varies according to modes - Poll,Ping,Push.
* But Push is neglected for Financial grade API because of compromised security features.
* So, we will not be implementing Push mode.


## For Poll:

10. And IS communicates with Authentication Device for credentials and consent.
11. Consumption device polls for Token at CIBA Proxy Server
12. Proxy Server Polls IS for Token
13. If IS has received credentials token is issued to CIBA proxy [else error message]
14. Token then passes from CIBA proxy server to Consumption device 
15. Service Provision

### Customized Flow :
![customized](https://miro.medium.com/max/2059/1*hOY-wNIirz8NDKFlvI1XBA.png)

## Design :

We planned to deploy CIBA Proxy Server as an extension to Identity Server 
* To withstand scalability  issues due to polling
* Considering the future prospective of IS turning into micro-service architecture.
* This implementation will incorporate CIBA Proxy Server as an extension to Authorization Server.

### If the Architecture has physical appearance :

![archi](https://miro.medium.com/max/4688/1*EgJ7tBe5sAXPXtjn_ZZqbw.png)


## TryOut :

* Fork the Repository
* Clone it to your local machine
* Create Database of your need [MySQL] and update Database name in the configurationFile
* Download WSO2 IS. Start the server.login using user : admin and password:admin.
* Create a service provider and configure the config file handler with relevant clientapp[service provider] name, clientID and ClientSecret.
* Can Send requests from Postman or any demo app.
* Or Else deploy DEMO APP provided[runs in localhost -with xampp server] and send requests from there.
* Build the project using maven - "mvn clean install"


### Further Readup:
* Spec: https://openid.net/specs/openid-client-initiated-backchannel-authentication-core-1_0.html
* External Blog : https://blog.usejournal.com/lets-break-up-dear-decouple-ourselves-88159a86aba
* External Blog : https://medium.com/@vivekc.16/people-you-dont-expect-to-operate-from-area-51-93646a58f485
* Architectural Approach : https://medium.com/@vivekc.16/she-dwelt-among-the-untrodden-trails-f834b046e128
* Try out Ciba POC : https://medium.com/@vivekc.16/trying-out-ciba-poc-of-wso2-is-186af645f874
