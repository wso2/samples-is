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
import {
  Image,
  View,
} from 'react-native';
import {styles} from '../theme/styles';

import {getStoredString} from '../utils/Storage';
import {enrollDevice} from '../services/entgraService';

const LoadingScreen = (props: {
  navigation: {navigate: (arg0: string) => void};
}) => {
  useEffect(() => {
    async function checkDeviceEnrolledStat() {
      const enrolledState = await getStoredString('enrolledState');
      if (enrolledState == null || enrolledState == 'false') {
        props.navigation.navigate('ConsentScreen');
      } else {
        props.navigation.navigate('LoginScreen');
      }
    }
    checkDeviceEnrolledStat();
  }, []);

  return (
    <>
      <View style={{...styles.mainBody, backgroundColor: 'black'}}>
        <View
          style={{
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../assets/images/wso2-inverted-logo.png')}
            style={styles.image}
          />
        </View>
      </View>
    </>
  );
};

export default LoadingScreen;
