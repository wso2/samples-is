# DPoP Client Application

This client application can be used as stand alone application to generate dpop proofs.
Source code for DPoP can be found here: https://github.com/wso2-extensions/identity-oauth-dpop

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- **Java** (JDK 8 or later)
- **Maven**

### Steps to Set Up

1. Clone the repository:
2. Navigate to the project directory:
   ```sh
   cd org.wso2.dpop.proof.generator
   ```
3. Build the project using Maven:
   ```sh
   mvn clean install
   ```

## Generating DPoP Proof Using Pre-Generated Key Pair

In this method, you generate a key pair once and use it for multiple requests.

#### Step 1: Generate a Public-Private Key Pair

1. Navigate to the project folder:
2. Run the following command to generate the key pair:
   ```sh
   java -cp target/org.wso2.dpop.proof.generator-(*)-jar-with-dependencies.jar org.wso2.dpop.proof.generator.GeneratePublicKeyPair
   ```
   This will generate two files:
    - `dpop.key` (Private Key)
    - `dpop.pub` (Public Key)

#### Step 2: Generate DPoP Proof Using Pre-Generated Keys

1. Run the following command:
   ```sh
   java -cp target/org.wso2.dpop.proof.generator-(*)-jar-with-dependencies.jar org.wso2.dpop.proof.generator.DPOPProofGenerator
   ```
2. Enter the requested inputs:
   ```
   File path to private key: dpop.key
   File path to public key: dpop.pub
   Enter the public and private key pair type (EC or RSA): EC
   Enter the HTTP Method: POST
   Enter the HTTP URL: https://localhost:9443/oauth2/token
   ```
3. Extract the DPoP proof from the output:
   ```
   [Signed JWT]: eyJ0eXAiOiJkcG9wK2p3dCIsImFsZyI6IkVTMjU2IiwiandrIjp7Imt0eSI6IkVDIiwiY3J2IjoiUC0yNTYiLCJ4Ijoi...
   ```

---

This guide ensures a smooth setup and usage experience for generating DPoP proofs using pre-generated key pairs.

