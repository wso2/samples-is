## Custom JWT Token Issuer

An extended implementation of the JWT token issuer to format the 'scope' claim from a space separated string to a JSON array.

##### Default format of the JWT token issuer
```
"scope": "claims.read claims.write customerProfile.read customerProfile.write customerServices.read customerServices.write healthCareProviders.read healthCareProviders.write notifications.read policyAdmin.read"
```

##### Expected format from the extended JWT token issuer
```
  "scope": [
    "claims.read",
    "claims.write",
    "customerProfile.read",
    "customerProfile.write",
    "customerServices.read",
    "customerServices.write",
    "healthCareProviders.read",
    "healthCareProviders.write",
    "notifications.read",
    "policyAdmin.read"
  ]
```

### Steps
1. Implement and build the sample

- Create a  maven project with custom class extends JWTTokenIssuer and Override the createJWTClaimSet method.
- Add the dependencies in pom.xml
- Build the claimset by using the JWTClaimsSet.Builder instance
- Build the maven project `mvn clean install`
- Copy the jar from target folder into  $IS_HOME/repository/components/lib location

2. Add Configuration in deployment.toml

Add the below configuration to deployment.toml file found under $IS_HOME/repository/conf directory

```
[oauth.extensions.token_types.token_type]
name="JWT"
issuer="org.wso2.carbon.identity.extensions.CustomJWTTokenIssuer"
persist_access_token_alias=true
```

3. Replace org.wso2.carbon.identity.extensions.CustomJWTTokenIssuer with your custom class name.
4. Restart the WSO2 Identity Server.


### Command use to generate JWT

```
curl -v -X POST -H "Authorization: Basic d3o3RFR0RFBHOTZiZmZBdUlIRTdPRUpKN3RVYTpKNmZkaHAwWTNyTDlVSzhJME1xYVMxTWZpekVh" -k -d "grant_type=password&username=<username>&password=<password>" -H "Content-Type:application/x-www-form-urlencoded" "https://<HOST-IP>:<HOST-PORT>/oauth2/token?scope=customerProfile.read%20customerProfile.write%20customerProfile.read%20policyAdmin.read%20healthCareProviders.read%20healthCareProviders.write%20customerServices.write%20customerServices.read%20notifications.read%20claims.read%20claims.write"
```

#### Generated JWT

```
eyJ4NXQiOiJOVGRtWmpNNFpEazNOalkwWXpjNU1tWm1PRGd3TVRFM01XWXdOREU1TVdSbFpEZzROemM0WkEiLCJraWQiOiJOVGRtWmpNNFpEazNOalkwWXpjNU1tWm1PRGd3TVRFM01XWXdOREU1TVdSbFpEZzROemM0WkFfUlMyNTYiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImF1ZCI6InhOU2F6cFBtV1dPeXVaV2dnZkJKbjN6QWhMMGEiLCJuYmYiOjE2MDYzMDI5MzAsImF6cCI6InhOU2F6cFBtV1dPeXVaV2dnZkJKbjN6QWhMMGEiLCJzY29wZSI6WyJjbGFpbXMucmVhZCIsImNsYWltcy53cml0ZSIsImN1c3RvbWVyUHJvZmlsZS5yZWFkIiwiY3VzdG9tZXJQcm9maWxlLndyaXRlIiwiY3VzdG9tZXJTZXJ2aWNlcy5yZWFkIiwiY3VzdG9tZXJTZXJ2aWNlcy53cml0ZSIsImhlYWx0aENhcmVQcm92aWRlcnMucmVhZCIsImhlYWx0aENhcmVQcm92aWRlcnMud3JpdGUiLCJub3RpZmljYXRpb25zLnJlYWQiLCJwb2xpY3lBZG1pbi5yZWFkIl0sImlzcyI6Imh0dHBzOlwvXC9sb2NhbGhvc3Q6OTQ0M1wvb2F1dGgyXC90b2tlbiIsImV4cCI6MTYwNjMwNjUzMCwiaWF0IjoxNjA2MzAyOTMwLCJqdGkiOiI1NDA0NDljOC1jNmY0LTQ0ODgtOWMzYy1lMWJiYWIyYWVmZjAifQ.ovVrIPplmordOrh1qYIm5sft0KbPuRklXIqQ2vfreL6W6_Uj9Os9Eh7peqAY8XhepgwT09M96ry7t_Nf1sjzGRLE-sWhNP-02xICpmInSU0CeqzUq2Vz9bkHbUASZBCDtTd7oRVOWg-etPoRKPtyGrRf_DM9u5o1R-Y8Hu8rImWQeSiNm9qYNZs1ja7n5wfWzk72LPM23c7w5dsQTvzdNXW5lh4Ptl4OQp4f9Xt3RWQE5e-IoFljXRQwFmekZrYVXU090wBFMoAwMO612C93g-2HUnNdTeAfI5XwAacFx69kQO7gdXV5TZwKDhTRY-_vYUqEWxKCQBtMbQ_gCE1r4A
```

#### DECODED JWT

```
{
  "sub": "admin",
  "aud": "xNSazpPmWWOyuZWggfBJn3zAhL0a",
  "nbf": 1606302930,
  "azp": "xNSazpPmWWOyuZWggfBJn3zAhL0a",
  "scope": [
    "claims.read",
    "claims.write",
    "customerProfile.read",
    "customerProfile.write",
    "customerServices.read",
    "customerServices.write",
    "healthCareProviders.read",
    "healthCareProviders.write",
    "notifications.read",
    "policyAdmin.read"
  ],
  "iss": "https://localhost:9443/oauth2/token",
  "exp": 1606306530,
  "iat": 1606302930,
  "jti": "540449c8-c6f4-4488-9c3c-e1bbab2aeff0"
}
```
