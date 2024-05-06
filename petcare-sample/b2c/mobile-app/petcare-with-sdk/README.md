# Pet care sample with Asgardeo Android SDK

## ⚠️ Read this first

1. Required versions
 ```
 Java version >= 17
 ```
 ```
 Android Studio version >= Giraffe
 ```

#### 1. Setup steps Identity Server
1.1 Setup the latest version of WSO2 Identity Sever.

1.2 [Create a mobile application](https://is.docs.wso2.com/en/next/guides/applications/register-mobile-app/) (Un tick the PKCE `Mandayory` checkbox)
- Add `wso2.apiauth.sample.android://login-callback` as the redirect URL of the application

#### 2. Import the configurations
2.1 Go to the `<APP_CONTENT_LOCATION>/com/wso2_sample/api_auth_sample/util/Config.kt` file and change the following values according the application you created above,

```
private const val BASE_URL: String = <BASE_URL of the tenant>
private const val DISCOVERY_URL: String = null
private const val CLIENT_ID: String = "<CLIENT_ID of the created application>
private const val REDIRECT_URI: String = "wso2.apiauth.sample.android://login-callback"
private const val SCOPE: String = "openid internal_login profile email"
private const val GOOGLE_WEB_CLIENT_ID = <GOOGLE_WEB_CLIENT_ID>
private val DATA_SOURCE_RESOURCE_SERVER_URL: String? = null
```

>| Property                    |                                    Value/s                                     |
>|--------------------------|:------------------------------------------------------------------------------:|
>| BASE_URL      |            Enter the base URL of the IS server here. If you are using an emulator to try with a locally hosted IS instance, <b>make sure to replace `localhost` with `10.0.2.2` !</b>          |
>| DISCOVERY_URL |  Discovery URL of the teant. This will not work in a locally hosted version of IS hence keep this value `null` if you are plannig to use a locally hosted version of IS.  |
>| CLIENT_ID | Client ID of the created application. |
>| REDIRECT_URI | `wso2.apiauth.sample.android://login-callback` |
>| SCOPE |            `openid internal_login`             |
>| GOOGLE_WEB_CLIENT_ID  | Enter the client id of the Google credential that will be used to create the Google connection in the IS. Since we are using the IS to authenticate the user we need to identify the currently signed-in user on the server. To do so securely, after a user successfully signs in, we need to send the user's ID token to the IS using HTTPS. Then, on the server, we are verifing the integrity of the ID token and use the user information contained in the token to establish the session. To generate the user's ID token for the IS, we will require the client id that is used to create the Google connection in the IS. For more details, https://developers.google.com/identity/sign-in/android/backend-auth         |
>| DATA_SOURCE_RESOURCE_SERVER_URL |  This is the url where we have hosted the pet care service. If you do not have that setup keep this value `null`, the app is developed to show a dummy data if the resource server is not available. |

2.2 Go to the `<APP_CONTENT_LOCATION>/java/com/wso2_sample/api_auth_sample/features/login/impl/repository/AsgardeoAuthRepositoryImpl.kt` file, and change the values passed for the `AuthenticationCoreConfig` object at your discretion.

#### 3. Setup Google Login
3.1 Go to `https://console.cloud.google.com/` and create a new project.

3.2 In the `credentials` section create two `Oauth Client IDs` one for `android app(Select Android)` and one for `WSO2 identity server(Select Web Application)`.
> Follow the steps to get the SHA-1 key to create Oauth Client ID for our Android app
> https://stackoverflow.com/a/67983215/10601286.
>
> After that make sure to sync the gradle of the project. This can be done using the `Sync project with Gradle files` icon in the top right hand corner of the IDE (or in Apple `Shift + Command + O`).
> ![image](https://github.com/wso2/samples-is/assets/46097917/dbd6738c-384d-495c-bc57-03bfd8dd7105)

> `WSO2_CLIENT_ID_OF_GOOGLE` is the client ID of the client ID crated for the WSO2 identity server.

3.3 Create a Google connection as a Trusted Token Issuer using the following curl command.
```
curl --location 'https://localhost:9443/api/server/v1/identity-providers' \
--header 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/118.0' \
--header 'Accept: application/json' \
--header 'Accept-Language: en-US,en;q=0.5' \
--header 'Accept-Encoding: gzip, deflate, br' \
--header 'Content-Type: application/json' \
--header 'Authorization: Basic YWRtaW46YWRtaW4=' \
--data '{
    "image": "assets/images/logos/google.svg",
    "isPrimary": false,
    "roles": {
        "mappings": [],
        "outboundProvisioningRoles": []
    },
    "name": "Google-TTI-IDP",
    "certificate": {
        "certificates": [],
        "jwksUri": "https://www.googleapis.com/oauth2/v3/certs"
    },
    "claims": {
        "userIdClaim": {
            "uri": "http://wso2.org/claims/username"
        },
        "roleClaim": {
            "uri": "http://wso2.org/claims/role"
        },
        "provisioningClaims": []
    },
    "description": "Login users with existing Google accounts.",
    "alias": <WSO2_CLIENT_ID_OF_GOOGLE>,
    "homeRealmIdentifier": "",
    "provisioning": {
        "jit": {
            "userstore": "PRIMARY",
            "scheme": "PROVISION_SILENTLY",
            "isEnabled": true
        }
    },
    "federatedAuthenticators": {
        "defaultAuthenticatorId": "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I",
        "authenticators": [
            {
                "isEnabled": true,
                "authenticatorId": "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I",
                "properties": [
                    {
                        "value": <WSO2_CLIENT_ID_OF_GOOGLE>,
                        "key": "ClientId"
                    },
                    {
                        "value": <WSO2_CLIENT_SECRET_OF_GOOGLE>,
                        "key": "ClientSecret"
                    },
                    {
                        "value": "https://localhost:9443/commonauth",
                        "key": "callbackUrl"
                    },
                    {
                        "value": "scope=email openid profile",
                        "key": "AdditionalQueryParameters"
                    }
                ]
            }
        ]
    },
    "idpIssuerName": "https://accounts.google.com",
    "isFederationHub": false,
    "templateId": "google-idp"
}'
```
3.4 Add the created Google connection to the created application (in step 2) as a level 1 sign-in option.

#### 4. Run the application

4.1 To run the application you need to open the application from the Android Studio IDE, and select the project to open with an `Android` view from the project view selection.
![image](https://github.com/wso2/samples-is/assets/46097917/c5ebb28f-335e-4a0f-a560-5504f5402f55)

4.2 You may require to sync the gradle files again. This can be done using the `Sync project with Gradle files` icon in the top right hand corner of the IDE (or in Apple `Shift + Command + O`).
![image](https://github.com/wso2/samples-is/assets/46097917/f4548481-9eda-425b-8535-eed610012723)

###### Optional
> This project is recommended to run on an emulator version `Pixel 7` or above, becuase some authenticators like `Passkey` are not supported for older version of Andriod.  To download the new emulator you can refer the following documentation. When selecting the device make sure to select `Pixel 7` or above version.
https://developer.android.com/studio/run/managing-avds

4.3 After the gradle files are synced you can run the app from the `Run `app`` button on the top bar (or in Apple `Command + R`)
![image](https://github.com/wso2/samples-is/assets/46097917/2ec180e4-4aec-4c0c-83b7-258118bfd988)

#### 5. Client attestation

5.1 To test the client attestation you need to test the application from a real device, where the app downloaded from the playstore, for this <b>you will require a Google play account</b>.
This application is bound to one of my Google cloud projects, hence you need to change the package name of the application and associate the project with a new Google Project, for this you can use the Google project that you created for the step 3.
> Changing the package name of an Android application involves several steps. It's a common task, but it requires careful attention to detail to ensure that all components of the app work correctly after the change. Here are the general steps:
>
> #### Step 1: Backup Your Project
>
> Before making any changes, it's always a good idea to create a backup of your entire project to avoid potential data loss.
>
> #### Step 2: Update the Package Name in the Manifest
>
> 1. Open the `AndroidManifest.xml` file in your Android Studio.
> 2. Locate the `package` attribute in the `<manifest>` element and change the package name to your desired name.
>
>    ```xml
>    <manifest xmlns:android="http://schemas.android.com/apk/res/android"
>        package="com.your.old.packagename">
>    ```
>
>    Change it to:
>
>    ```xml
>    <manifest xmlns:android="http://schemas.android.com/apk/res/android"
>        package="com.your.new.packagename">
>    ```
>
> #### Step 3: Refactor the Package Name
>
> 1. Right-click on the old package name in the project explorer.
> 2. Select "Refactor" > "Rename" (or just press `Shift` + `F6`).
> 3. Enter the new package name and click "Refactor."
>
> #### Step 4: Update Gradle Files
>
> 1. Open the `build.gradle` file (Module: app).
> 2. Update the `applicationId` to the new package name.
>
>    ```gradle
>    android {
>        ...
>        defaultConfig {
>          ...
>            applicationId "com.your.new.packagename"
>        }
>    }
>    ```
>
> 3. Sync your project with Gradle by clicking on the "Sync Now" prompt that appears in the bar at the top.
>
> #### Step 5: Rename Source Code Directories
>
> 1. Right-click on the old package name directory and choose "Refactor" > "Rename."
> 2. Enter the new package name and click "Refactor."
>
> #### Step 6: Update References
>
> 1. Android Studio will update most references automatically, but double-check for any manual references in your code or resources.
> 2. Look for occurrences of the old package name and update them to the new one.
>
> #### Step 7: Clean and Rebuild
>
> 1. Clean your project by selecting "Build" > "Clean Project" from the menu.
> 2. Rebuild your project by selecting "Build" > "Rebuild Project."
>
> #### Step 8: Test Your App
>
> 1. Run your app on an emulator or a physical device to ensure that everything is working as expected.
> 2. Check for any errors or warnings in the logcat.

Also make sure to subscribe to Google Play Integrity API from the project, you can do this from `Enabled API's & Services` in the Google cloud project.

5.2 After that you need to create a new service account in the google project.
You can create a Service Account for yourself with the following scopes.
- Go to IAM& Admin -> Service Accounts
- Click Create Service Account
- Fill the name and click create and continue.
- You need to grant your service account the roles of Service Account User and Service Usage Consumer.
- Click continue and then Done
- You can see the service account added without keys, click : Actions -> Manage Keys for the service account.
- Click Add key and Select JSON.
- Save the JSON in secure place (We need this for Android Attestation Credentials for application metadata)

5.3 After that, Update Application Advanced properties.
The application you created requires 2 properties to perform android attestation.
- Android package name
- androidAttestationServiceCredentials
    - The JSON secret of Service Account downloaded. Note that this attribute is defined as a JSON object hence use the JSON key as it is.

5.4 Go to the Google play console and create a new application for this application, after that you need to associate your cloud project for the app integrity. To do this,
- Navigate to Release > App integrity. Under Play Integrity API select **Link a Cloud project**.
- Choose the Cloud project you want to link to your app and this will enable Play Integrity API responses.
- You can now integrate the Play Integrity API into your app.
- Create a new release.
    - For this we need a signed app bundle. To create a signed app bundle,
        - In the Android Studio, go to **Build** > **Generate Signed App Bundle**, and select app bundle.
        - Then create a new keystore (make sure to store the credentials of the keystore in a secure location), then upload the released bundle to the play console internal testing release section.
- In the testers section, add yourself as a tester in a new list of testers and select that list only for the testing.
- Then copy the web link and download the application from there.
- Download the application from that link, and you can test the client attestation from that application
> NOTE:
> When you have released multiple versions of the application, you may face a problem that the application you download from the link are still giving the old version, to mitigate this you can change the device and open the link or wait a few minutes.

###### App Screens
![Screenshot_20240411_223503](https://github.com/wso2/samples-is/assets/46097917/e2aabd05-4450-4dff-a93d-587bd37360b8)
![Screenshot_20240411_223521](https://github.com/wso2/samples-is/assets/46097917/34bd711c-aa69-418a-a5a9-6e517d15ba1a)
![Screenshot_20240411_223607](https://github.com/wso2/samples-is/assets/46097917/6c6a6d25-4be3-454b-930d-9fd4332c1e4c)

###### Credits
- Images used in the application are taken from [Freepik](https://www.freepik.com/), [Unsplash](https://unsplash.com/), and [Flaticon](https://www.flaticon.com/).
