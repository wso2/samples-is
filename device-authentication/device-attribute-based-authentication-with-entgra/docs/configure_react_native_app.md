## Configure your React Native application

### Android configuration

1. In the project level `build.gradle` file , add the following repository,
```Java
allprojects {
    repositories {
        maven {
            url "http://nexus.entgra.io/repository/maven-releases/"
            allowInsecureProtocol = true
        }
    }
}
```

2. In the app level `build.gradle` file add following
```
android {
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
   implementation 'io.entgra.device.mgt.sdk:security-sdk-core:0.2.0'
}
```

3. Download the entgra native module zip file from this
   [link](https://github.com/PasinduYeshan/files/raw/main/entgra_native_module.zip). 

4. Create a folder name `entgraSrvices` inside the `<APP_ROOT_DIRECTORY>/android/app/src/main/java/com/<app_name>/`.
   Extract the `entgra_native_module.zip` file and copy the `EntgraServiceManager.kt` and `EntgraServicePackage.kt`
   files to the `<APP_ROOT_DIRECTORY>/android/app/src/main/java/com/<app_name>/entgraServices` folder. 

5. Import the `EntgraServicePackage` to the `MainApplication.java` file inside 
`<APP_ROOT_DIRECTORY>/android/app/src/main/java/com/<app_name>/`. and add `packages.add(new EntgraServicePackage());` 
line to the `getPackages` method as follows.

```
import com.isentgra.entgraServices.EntgraServicePackage;
```
```
 @Override
    protected List<ReactPackage> getPackages() {
      List<ReactPackage> packages = new PackageList(this).getPackages();
      packages.add(new EntgraServicePackage());
      return packages;
    }
```
8. Refer this [doc](native_module_wrapper.md) to access native module from JavaScript.

9. Clone/download this project from [repo link](https://github.com/asgardeo/asgardeo-react-native-oidc-sdk). 

10. Copy the `<PROJECT_ROOT>/lib` folder to the react native application root directory and rename it to 
`asgardeo-react-native-sdk`. 

11. Install the dependencies and generate the tar file by running the following command inside
   the `asgardeo-react-native-sdk/` directory.
   `npm pack` 

12. Create a `.env` file inside the project root folder and add the relevant configurations.
    - Replace the value of `clientID` with the value of `OAuth Client Key` or `Client ID` which you copied when you 
    configure the Service Provider.
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

13. Install the required dependencies by running the following command inside the project root directory.
    `npm install` 

14. Refer this [doc](login_page.md) to create a sample login page.

15. Refer this [doc](https://github.com/asgardeo/asgardeo-react-native-oidc-sdk#apis) for more information regarding 
APIs.
