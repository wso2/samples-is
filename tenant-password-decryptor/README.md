# Tenant Password Decryptor

This is a simple java application that can be used to decrypt the tenant passwords which are encrypted using either asymmetric key encryption or symmetric key encryption.

## Table of Contents
- [Build Project](#build-project)
- [Decrypt passwords](#decrypt-passwords)
  - [Encrypted with Asymmetric Key Encryption](#encrypted-with-asymmetric-key-encryption)
  - [Encrypted with Symmetric Key Encryption](#encrypted-with-symmetric-key-encryption)

## Build Project
Clone the repository, change directory into it and execute the following command to build the project

```mvn clean install```

## Decrypt passwords
### Encrypted with Asymmetric Key Encryption
change directory in target folder and issue the following command.

```
java -cp org.wso2.custom.password.decrypt-1.0.0.jar:lib/\* org.wso2.custom.password.decrypt.AsymmetricKeyDecryptImpl
```
You will be prompted to enter the following details: Encrypted Text, Server KeyStore file path, KeyStore alias, KeyStore password

example:

```
java -cp org.wso2.custom.password.decrypt-1.0.0.jar:lib/\* org.wso2.custom.password.decrypt.AsymmetricKeyDecryptImpl
Encrypted Text : eyJjIjoiT0hXOUtRajI3K0JqKzJjRjFTRkdMRXMxUjdSMUE3alZVZ2F1djhRd24yU3JXWXNOWjdBaG9zYllGMHYxSmtEOHNabE5wd1FFZm8vNis1dWVlUGU0aWs4UTNON2huV09FRHVGS3dpejgrWk80VnlkMmx6QWtlRWJPV2p2R1ZYamJyZVY4czVIb2JYUnd0T1lUcmt1MVF2WHg3bXJWZkpSbUZCSk9VT0g1TW9YbUdIZ1kvZVlncU9yVmVKbTlpcHl3Ylo4eUV4andEVi9KazJSaXNMckhkSWMxSHF6Tng0Z0wzTEZDcGZvODBCeEdab05KS1h2UVdIYW5OWUQ0Z2d6SDJzaEJpVzdDLzdLQ1hUYkZkaUxpNkhWb0JsVVZlWXBoTElEcCtQN2VXMTIwU0N5QVVESEIya2dybFBITGFtZERsN0VjR0JtNnFVOFNPOG03VVcwYzZnXHUwMDNkXHUwMDNkIiwidCI6IlJTQS9FQ0IvT0FFUHdpdGhTSEExYW5kTUdGMVBhZGRpbmciLCJ0cCI6IjU3RkYzOEQ5NzY2NEM3OTJGRjg4MDExNzFGMDQxOTFERUQ4ODc3OEQiLCJ0cGQiOiJTSEEtMSJ9
KeyStore file path : /Users/tharaka/Documents/wso2is-5.10.0/repository/resources/security/wso2carbon.jks
KeyStore alias : wso2carbon
KeyStore password : wso2carbon
```
The above values can be passed as args as well.
```
java -cp org.wso2.custom.password.decrypt-1.0.0.jar:lib/\* org.wso2.custom.password.decrypt.AsymmetricKeyDecryptImpl $CipherText $SuperTenantKeystorePath $SuperTenantKeystoreAlias $SuperTenantKeystorePassword
```
#### Output
The ouput would be in the following format. The decrypted plain text would be displayed under "*** Plain Text ***"
```
Cipher transformation for decryption : RSA/ECB/OAEPwithSHA1andMGF1Padding
*** Plain Text ***
1b01a18564
```
### Encrypted with Symmetric Key Encryption
change directory in target folder and issue the following command.
```
java -cp org.wso2.custom.password.decrypt-1.0.0.jar:lib/\* org.wso2.custom.password.decrypt.SymmetricKeyDecryptImpl
```
You will be prompted to enter the following details: Encrypted Text and the Encryption Key

example:

```
java -cp org.wso2.custom.password.decrypt-1.0.0.jar:lib/\* org.wso2.custom.password.decrypt.SymmetricKeyDecryptImpl
Encrypted Text : eyJjIjoiZXlKamFYQm9aWElpT2lKSVR6QlZPVXN3Y0RkdlZWbHZWRVpUY1haUUt6Tk5RMVpKYWtkclFsWkRPUzlXT0QwaUxDSnBibWwwYVdGc2FYcGhkR2x2YmxabFkzUnZjaUk2SWt4alpqVndiMlp4UldWNVFXRkZNV3RXVVZoNGFIYzlQU0o5IiwidCI6IkFFUy9HQ00vTm9QYWRkaW5nIiwiaXYiOiJMY2Y1cG9mcUVleUFhRTFrVlFYeGh3PT0ifQ==
Encryption Key : 03BAFEB27A8E871CAD83C5CD4E771DAB
```
The above values can be passed as args as well.
```
java -cp org.wso2.custom.password.decrypt-1.0.0.jar:lib/\* org.wso2.custom.password.decrypt.SymmetricKeyDecryptImpl $CipherText $EncryptionKey
```
#### Output
The ouput would be in the following format. The decrypted plain text would be displayed under "*** Plain Text ***"
```
Cipher transformation for decryption : AES/GCM/NoPadding
*** Plain Text ***
97b86a2a6a
******************
```
