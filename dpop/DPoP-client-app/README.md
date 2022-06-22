# DPoP-client-app 
 This client application was originally developed by Darsa Mahendrarajah as Gradle application. This repository contains the Maven conversion of the same.
 
 ## How to setup :
 1. Clone /dpop/DPoP-client-app 
 2. Build the project using ```mvn clean install```
 3. Follow the below steps

### Option 01:
1. Generate per request basis DPOPProofGenerator.java (This will generate per request
private and public keypair )
  - Navigate to /samples-is/dpop/DPoP-client-app folder.
  - Run the below command.
  
  ```java -cp target/client-app-1.0-jar-with-dependencies.jar org.wso2.dpop.client.DPOPProofGenerator```
  - Enter the user inputs for below questions.

   ```
   Enter the public and private key pair type(EC or RSA): 
   EC
   Enter the HTTP Method: 
   POST
   Enter the HTTP Url: 
   https://localhost:9443/oauth2/token
  
  ```
- Extract the dpop proof from the output.  

    ```
    [Signed JWT] : eyJ0eXAiOiJkcG9wK2p3dCIsImFsZyI6IkVTMjU2IiwiandrIjp7Imt0eSI6IkVDIiwiY3J2IjoiUC0yNTYiLCJ4IjoiQ
                   y03b1ZVQ2Z2OUlRQmlWN0JlLVdNVVEtdF9ibmo1TzBlV0tuZkhnUUJaSSIsInkiOiJla2Rsci12dFJFMHFMdUpNYU5FUDR
                   vdXhKNVVHTEREdWphZUN6ejhJTkdjIn19.eyJodG0iOiJQT1NUIiwic3ViIjoic3ViIiwibmJmIjoxNjM1MTc2MDg2LCJp
                   c3MiOiJpc3N1ZXIiLCJodHUiOiJodHRwczpcL1wvbG9jYWxob3N0Ojk0NDNcL29hdXRoMlwvdG9rZW4iLCJpYXQiOjE2Mz
                   UxNzYwODYsImp0aSI6ImUzMTEzYzdmLTE0YTQtNGU2ZC1hY2VmLTZjZDQ5NWQ1ZWZjNCJ9.lgEjdP1Fv3OOAaFfM4CEREg
                   46RGdbusLzb4409eCMabCwbN0dS6NdXsc6qxfR_TVhkKzIUKLSDmM4qzEIuw4LQ
    ```
 
 ### Option 02: 
 1. Generate dpop proof by passing public key and private key file location.
    -  Generate public key pair and store it in a file.(GeneratePublicKeyPair.java)
        1. Navigate to /samples-is/dpop/DPoP-client-app folder and run the below command.Private key file (dpop.key) and Public key file will be generated(dpop.pub).
           
           ```java -cp target/client-app-1.0-jar-with-dependencies.jar org.wso2.dpop.client.GeneratePublicKeyPair```
    -  Use the already created key pairs and load and generate the DPoP Proof(DPOPProofGeneratorFromPP.java) .
        1. Navigate to /samples-is/dpop/DPoP-client-app folder.
        2. Run the below command.
        
           ``` java -cp target/client-app-1.0-jar-with-dependencies.jar org.wso2.dpop.client.DPOPProofGeneratorFromPP```
           
        3. Enter the user inputs for  the below questions.

          ```  
          File path to private key: 
          dpop.key
          File path to public key: 
          dpop.pub
          Enter the public and private key pair type(EC or RSA): 
          EC
          Enter the HTTP Method: 
          POST
          Enter the HTTP Url: 
          https://localhost:9443/oauth2/token
          ```
        4. Extract the dpop proof from the output.  

         ```
         [Signed JWT] : eyJ0eXAiOiJkcG9wK2p3dCIsImFsZyI6IkVTMjU2IiwiandrIjp7Imt0eSI6IkVDIiwiY3J2IjoiUC0yNTYiLCJ4IjoiQ
                        y03b1ZVQ2Z2OUlRQmlWN0JlLVdNVVEtdF9ibmo1TzBlV0tuZkhnUUJaSSIsInkiOiJla2Rsci12dFJFMHFMdUpNYU5FUDR
                        vdXhKNVVHTEREdWphZUN6ejhJTkdjIn19.eyJodG0iOiJQT1NUIiwic3ViIjoic3ViIiwibmJmIjoxNjM1MTc2MDg2LCJp
                        c3MiOiJpc3N1ZXIiLCJodHUiOiJodHRwczpcL1wvbG9jYWxob3N0Ojk0NDNcL29hdXRoMlwvdG9rZW4iLCJpYXQiOjE2Mz
                        UxNzYwODYsImp0aSI6ImUzMTEzYzdmLTE0YTQtNGU2ZC1hY2VmLTZjZDQ5NWQ1ZWZjNCJ9.lgEjdP1Fv3OOAaFfM4CEREg
                        46RGdbusLzb4409eCMabCwbN0dS6NdXsc6qxfR_TVhkKzIUKLSDmM4qzEIuw4LQ```
       
