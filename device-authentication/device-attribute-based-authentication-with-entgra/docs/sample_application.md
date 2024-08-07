## Configuring the Sample Application

1. Clone/download this project from {repo link}. 

2. Install the dependencies and generate the tar file by running the following command inside
   the `asgardeo-react-native-sdk/` directory.
   `npm pack` 
   
3. Create a `.env` file inside the project folder and add the relevant configurations
   - Replace the value of `clientID` with the value of `OAuth Client Key` or `Client ID` which you copied when you
     configure the Service Provider `ISEntgra`.
   - Replace the `EntgraClientKey` and `EntgraClientSecret` with the values of `OAuth Client Key` or `Client ID`
     which you copied when you register the application in Entgra IoT server.

       ```
       # IS Configs
       IS_BASE_URL=https://{hostname}:{port}
       SIGN_IN_REDIRECT_URL=wso2entgra://oauth2
       CLIENT_ID='ClientID'
      
       # Entgra Configs
       ENTGRA_BASE_URL=https://{gatewayURL}
       ENTGRA_CLIENT_KEY='EntgraClientKey'
       ENTGRA_CLIENT_SECRET='EntgraClientSecret'
       ENTGRA_CALLBACK_URL=https://localhost/sdk/secure
       ENTGRA_MGT_URL=https://{mgtURL}
       ```

     Example:

       ```
       # IS Configs
       IS_BASE_URL=https://localhost:9443
       SIGN_IN_REDIRECT_URL=wso2entgra://oauth2
       CLIENT_ID=cj7afMflxyiimER4F3kNE1H9Rg8a
      
       # Entgra Configs
       ENTGRA_BASE_URL=https://nest.gw.entgra.net
       ENTGRA_CLIENT_KEY=O6lYcMOwg1wl9OfhCrUDB_QTkKwa
       ENTGRA_CLIENT_SECRET=gBb6LATYVyxplGhvB6tcckBOvo8a
       ENTGRA_CALLBACK_URL=https://localhost/sdk/secure
       ENTGRA_MGT_URL=https://nest.mgt.entgra.net
       ```

4. Install the required dependencies by running the following command inside the `/`directory. 
   `npm install`

### Running the Sample App

This application can be run either in an emulator or an actual device. Some configurations may differ depending on the OS.

### Android Setup

1. If the WSO2 IS is hosted in the local machine, you have to change the domain of the endpoints defined in `.env` 
file `10.0.2.2`. Refer the documentation on [emulator-networking](https://developer.android.com/studio/run/emulator-networking). 
Next change the hostname of Identity server as `10.0.2.2` in the `<IS_HOME>/repository/conf/deployment.toml` 
file. 

2. By default, IS uses a self-signed certificate. If you ended up in SSL issues and are using the default pack without 
changing to a CA signed certificate, follow this 
[guide](https://developer.android.com/training/articles/security-config) to get rid of SSL issues. 

3. Sometimes you may get `SSLHandshakeException` in android application since WSO2 IS is using a self-signed 
certificate. To fix this exception, you need to add the public certificate of IS to the sample application. 

   i. Create a new keystore with CN as localhost and SAN as `10.0.2.2`.

   `keytool -genkey -alias wso2carbon -keyalg RSA -keystore wso2carbon.jks -keysize 2048 -ext SAN=IP:10.0.2.2`
   

   ii. Export the public certificate (ex: `wso2carbon.pem`) to add into the truststore.

   `keytool -exportcert -alias wso2carbon -keystore wso2carbon.jks -rfc -file wso2carbon.pem`
   

   iii. Import the certificate in the client-truststore.jks file located in  `<IS_HOME>/repository/resources/security/`.

   `keytool -import -alias wso2is -file wso2carbon.pem -keystore client-truststore.jks -storepass wso2carbon`
   

   iv. Now copy this public certificate (`wso2carbon.pem`) to the  `app/src/main/res/raw`  folder.
   

   v. Create a new file named  `network_security_config.xml`  in `sample/android/app/src/main/res/xml` folder and copy the below content to it. Make sure to replace `wso2carbon` with the certificate name you added.
   
   ```
   <?xml version="1.0" encoding="utf-8"?>
   <network-security-config>
   <domain-config cleartextTrafficPermitted="true">
   <domain includeSubdomains="true">localhost</domain>
   <domain includeSubdomains="true">10.0.2.2</domain>
   <trust-anchors>
   <certificates src="@raw/wso2carbon"/>
   </trust-anchors>
   <domain includeSubdomains="true">192.168.43.29</domain>
   <base-config cleartextTrafficPermitted="true"/>
   </domain-config>
   </network-security-config>
   ```

   vi. Then add the following config to the `sample/android/app/src/main/AndroidManifest.xml` file  under 
`application` section. 

   `android:networkSecurityConfig="@xml/network_security_config"`    

   Now the `AndroidManifest.xml` file should look like below.
   ```
   <?xml version="1.0" encoding="utf-8"?>
      <manifest ... >
      <application
      android:networkSecurityConfig="@xml/network_security_config"
      ...
      >
      </application>
      </manifest>`
   ```

### Running in an Android Emulator

1. Create a suitable Android virtual device using the **Android virtual device manager (AVD Manager)** and launch it.


2. Build and deploy the apps by running the following command at the root directory.
   `react-native run-android`

### Running in an Android Device

1. Enable **Debugging over USB** and plug in your device via USB. 

2. Build and deploy the apps by running the following command at the root directory.
   `react-native run-android`

> If you're running in a development or debugging mode, start the Metro by running the following command.
>
`react-native start`