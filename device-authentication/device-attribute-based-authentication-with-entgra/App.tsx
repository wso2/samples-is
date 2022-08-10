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

import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthProvider} from '@asgardeo/auth-react-native';

import {LoginContextProvider} from './src//context/LoginContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ConsentScreen from './src/screens/ConsentScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import GuardioHome from './src/screens/GuardioHome';
import Dashboard from './src/screens/Dashboard';

const App = () => {
  const Stack = createStackNavigator();
  return (
    <AuthProvider>
      <LoginContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName={'LoadingScreen'}>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ConsentScreen"
              component={ConsentScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="LoadingScreen"
              component={LoadingScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="GuardioHome"
              component={GuardioHome}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Dashboard"
              component={Dashboard}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </LoginContextProvider>
    </AuthProvider>
  );
};

export default App;
