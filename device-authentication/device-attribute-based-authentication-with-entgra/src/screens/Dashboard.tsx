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

import React from 'react';
import {LogBox} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import {useLoginContext} from '../context/LoginContext';
import {useAuthContext} from '@asgardeo/auth-react-native';

import GuardioHome from './GuardioHome';
import HomeScreen from './HomeScreen';
import {Header} from '../component';
import DrawerItems from '../config/drawerItem.js';

const Drawer: any = createDrawerNavigator();

const Dashboard = () => {
  const {loginState, setLoginState, loading, setLoading} = useLoginContext();
  const {state, signOut, refreshAccessToken} = useAuthContext();

  React.useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedList should never be nested']);
  }, []);

  /**
   * This function will handle the sign out button click.
   */
  const handleSignOut = async () => {
    console.log('this workds');
    setLoginState({
      ...loginState,
      ...state,
      hasLogoutInitiated: true,
    });

    signOut().catch(error => {
      setLoading(false);
      // eslint-disable-next-line no-console
      console.log(error);
    });
  };

  const CustomDrawerContent = (props: any) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />

        <DrawerItem
          label="Log out"
          onPress={async () => handleSignOut()}
          style={{alignContent: 'flex-end'}}
        />
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      // drawerType="front"
      useLegacyImplementation={true}
      initialRouteName="GuardioHome"
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}>
      {DrawerItems.map(drawer => (
        <Drawer.Screen
          key={drawer.name}
          name={drawer.name}
          drawerContentOptions={{
            activeTintColor: '#e91e63',
            itemStyle: {marginVertical: 50},
          }}
          options={{
            headerShown: true,
            header: () => {
              const title = drawer.name;
              return <Header />;
            },
          }}
          component={
            drawer.component === 'GuardioHome' ? GuardioHome : HomeScreen
            //   : drawer.name==='Settings' ? SettingsScreen
            //     : drawer.name==='Saved Items' ? SavedScreen
            //       : ReferScreen
          }
        />
      ))}
    </Drawer.Navigator>
  );
};

export default Dashboard;
