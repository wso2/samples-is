## Login page

###  Initialize the auth client with the config data
This method initializes the auth client with the config data.
```ts
const config = {
  serverOrigin: Config.IS_BASE_URL,
  baseUrl: Config.IS_BASE_URL,
  clientID: Config.CLIENT_ID,
  signInRedirectURL: Config.SIGN_IN_REDIRECT_URL,
  validateIDToken: false,
};

useEffect(() => {
    initialize(config);
}, []);
```

###  Sign in the user
This method will work in two phases. The first phase generates the authorization url and takes the user to the 
single-sign-on page of the identity server, while second 
phase triggers the token request to complete the authentication process. So, this method should be called when the user 
clicks on the Sign-in button and should listen for the authentication state for state update inorder to proceed with 
the signing.
```ts
/**
 * This function will be triggered upon login button click.
 */
const handleSubmitPress = async () => {
        setLoading(true);
        try {
            // Sync device information to Entgra Server
            syncDevice().catch(err => console.log(err));

            let authURLConfig: GetAuthURLConfig = {};
            // Fetch device id from Entgra SDK wrapper and set it in the config object.
            const deviceID = await getDeviceID();
            authURLConfig = {
                deviceID: deviceID,
                platformOS: Platform.OS,
                forceInit: true,
            };
            // Sign in
            signIn(authURLConfig).catch((error: any) => {
                setLoading(false);
            });
            setLoading(false);
        } catch (err) {
            setLoading(false);
            return;
        }
    };

/**
 * This hook will listen for auth state updates and proceed.
 */
useEffect(() => {
    if (state?.isAuthenticated) {
        const getData = async () => {
            try {
                const basicUserInfo = await getBasicUserInfo();
                const idToken = await getIDToken();
                const decodedIDToken = await getDecodedIDToken();

                setLoginState({
                    ...loginState,
                    ...state,
                    ...basicUserInfo,
                    idToken: idToken,
                    ...decodedIDToken,
                    hasLogin: true,
                });
                setLoading(false);
                props.navigation.navigate('Dashboard');
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        };

        getData();
    } else if (loginState.hasLogoutInitiated) {
        setLoginState(initialState);
        props.navigation.navigate('LoginScreen');
    }
}, [state.isAuthenticated]);
```

### Handle auth response error
This hook will listen for `authResponseError` and proceed. 

| No  | Error Code                               | Description                                                                         | 
|-----|------------------------------------------|-------------------------------------------------------------------------------------|
| 1   | `DEVICE_NOT_ENROLLED`                    | Mobile device is not enrolled in the Entgra server.                                 |
| 2   | `DEVICE_NOT_ENROLLED_UNDER_CURRENT_USER` | Mobile device is enrolled in the Entgra server but not under the <br/>current user. | 
| 3   | `ACCESS_DENIED`                          | For other error scenarios.                                                          |

```ts
/**
   * This hook will listen for auth response error and proceed.
   */
  useEffect(() => {
    if (state.authResponseError?.hasOwnProperty('errorCode')) {
      setLoading(false);
      Alert.alert('Access Denied', state.authResponseError.errorMessage, [
        {
          text: 'OK',
          onPress: async () => {
            if (
              state.authResponseError?.errorCode ==
              AuthResponseErrorCode.DEVICE_NOT_ENROLLED
            ) {
              setLoginState(initialState);
              clearAuthResponseError();
              // Logic for when the deivce is not enrolled
            } else {
              setLoginState(initialState);
              clearAuthResponseError();
            }
          },
        },
      ]);
    }
  }, [state.authResponseError]);

```

### Sample login page
```tsx
import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  Platform,
  Text,
  View,
  Alert,
} from 'react-native';
import 'text-encoding-polyfill';
import {
  useAuthContext,
  AuthResponseErrorCode,
} from '@asgardeo/auth-react-native';
import {GetAuthURLConfig} from '@asgardeo/auth-js';
import {styles} from '../theme/styles';
import Config from 'react-native-config';

import {initialState, useLoginContext} from '../context/LoginContext';
import {
  getDeviceID,
  disenrollDevice,
  syncDevice,
} from '../services/entgraService';
import {wipeAll} from '../utils/Storage';

// Create a config object containing the necessary configurations.
const config = {
  serverOrigin: Config.IS_BASE_URL,
  baseUrl: Config.IS_BASE_URL,
  clientID: Config.CLIENT_ID,
  signInRedirectURL: Config.SIGN_IN_REDIRECT_URL,
  validateIDToken: false,
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const LoginScreen = (props: {
  navigation: {navigate: (arg0: string) => void};
}) => {
  const {loginState, setLoginState, loading, setLoading} = useLoginContext();
  const {
    state,
    initialize,
    signIn,
    getBasicUserInfo,
    getIDToken,
    getDecodedIDToken,
    getAuthorizationURL,
    clearAuthResponseError,
  } = useAuthContext();

  /**
   * This hook will initialize the auth provider with the config object.
   */
  useEffect(() => {
    initialize(config);
  }, []);

  /**
   * This hook will listen for auth response error and proceed.
   */
  useEffect(() => {
    if (state.authResponseError?.hasOwnProperty('errorCode')) {
      setLoading(false);
      Alert.alert('Access Denied', state.authResponseError.errorMessage, [
        {
          text: 'OK',
          onPress: async () => {
            if (
              state.authResponseError?.errorCode ==
              AuthResponseErrorCode.DEVICE_NOT_ENROLLED
            ) {
              setLoginState(initialState);
              clearAuthResponseError();
              disenrollDevice().catch(err => {
                console.log(err);
              });
              props.navigation.navigate('ConsentScreen');
            } else {
              setLoginState(initialState);
              clearAuthResponseError();
            }
          },
        },
      ]);
    }
  }, [state.authResponseError]);

  /**
   * This hook will listen for auth state updates and proceed.
   */
  useEffect(() => {
    if (state?.isAuthenticated) {
      const getData = async () => {
        try {
          const basicUserInfo = await getBasicUserInfo();
          const idToken = await getIDToken();
          const decodedIDToken = await getDecodedIDToken();

          setLoginState({
            ...loginState,
            ...state,
            ...basicUserInfo,
            idToken: idToken,
            ...decodedIDToken,
            hasLogin: true,
          });
          setLoading(false);
          props.navigation.navigate('Dashboard');
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      };

      getData();
    } else if (loginState.hasLogoutInitiated) {
      setLoginState(initialState);
      props.navigation.navigate('LoginScreen');
    }
  }, [state.isAuthenticated]);

  /**
   * This function will be triggered upon login button click.
   */
  const handleSubmitPress = async () => {
    setLoading(true);
    try {
      // Sync device information to Entgra Server
      syncDevice().catch(err => console.log(err));

      let authURLConfig: GetAuthURLConfig = {};
      // Fetch device id from Entgra SDK and set it in the config object.
      const deviceID = await getDeviceID();
      authURLConfig = {
        deviceID: deviceID,
        platformOS: Platform.OS,
        forceInit: true,
      };
      // Sign in
      signIn(authURLConfig).catch((error: any) => {
        setLoading(false);
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      return;
    }
  };

  /**
   * This function will be triggered upon back button click.
   */
  const handleBackPress = async () => {
    props.navigation.navigate('ConsentScreen');
  };

  return (
    <View style={{...styles.mainBody, justifyContent: 'space-between'}}>
      <View style={{...styles.container, justifyContent: 'space-between'}}>
        <View style={{width: '90%', marginTop: 10}}>
          <Text numberOfLines={1} adjustsFontSizeToFit>
            <Text style={styles.topicText1}>Guardio </Text>
            <Text style={styles.topicText2}>Finance</Text>
          </Text>
        </View>
        <View style={{marginVertical: 10}}>
          <Image
            source={require('../assets/images/guardio-primary.png')}
            style={styles.loginScreenImage}
          />
        </View>
        <View>
          <Button color="#282c34" onPress={handleSubmitPress} title="Login" />
        </View>
        <View style={{marginVertical: 10}}>
          <Button color="#282c34" onPress={handleBackPress} title="Back" />
        </View>
        {loading ? (
          <View pointerEvents="none">
            <ActivityIndicator size="large" color="#FF8000" />
          </View>
        ) : null}
      </View>

      <View style={{paddingBottom: 20}}>
        <Image
          source={require('../assets/images/guardio-horizontal-dark.webp')}
          style={styles.footerAlign}
        />
      </View>
    </View>
  );
};

export default LoginScreen;
```