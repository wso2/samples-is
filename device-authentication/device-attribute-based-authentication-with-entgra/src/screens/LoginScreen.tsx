/*
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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
    syncDevice();
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
              state.authResponseError?.errorCode == "DEVICE_NOT_ENROLLED"
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
    // wipeAll();
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
      console.log(authURLConfig);
      // Sign in
      signIn(authURLConfig).catch((error: any) => {
        setLoading(false);
        console.log(error);
      });
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
      return;
    }
  };

  /**
   * This function will be triggered upon back button click.
   */
  const handleBackPress = async () => {
    disenrollDevice().catch(err => {
      console.log(err);
    });
    props.navigation.navigate('ConsentScreen');
  };

  return (
    <View style={{...styles.mainBody, justifyContent: 'space-between'}}>
      <View style={{...styles.container, justifyContent: 'space-between'}}>
        <View style={{width: '90%', marginTop: 10}}>
          <Text numberOfLines={1} adjustsFontSizeToFit style={styles.topicText1}>
            <Text style={styles.topicText1}>Guardio </Text>
            <Text style={styles.topicText2}>Finance</Text>
          </Text>
        </View>
        <View style={{...styles.imageAlign, marginVertical: 10}}>
          <Image
            source={require('../assets/images/guardio-primary.png')}
            style={styles.loginScreenImage}
          />
        </View>
        <View style={styles.button}>
          <Button color="#282c34" onPress={handleSubmitPress} title="Login" />
        </View>
        <View style={{...styles.button, marginVertical: 10}}>
          <Button color="#282c34" onPress={handleBackPress} title="Back" />
        </View>
        {loading ? (
          <View style={styles.loading} pointerEvents="none">
            <ActivityIndicator size="large" color="#FF8000" />
          </View>
        ) : null}
      </View>

      <View style={{...styles.footer, paddingBottom: 20}}>
        <Image
          source={require('../assets/images/guardio-horizontal-dark.webp')}
          style={styles.footerAlign}
        />
      </View>
    </View>
  );
};

export default LoginScreen;
