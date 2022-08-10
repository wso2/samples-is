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
  ActivityIndicator,
  Button,
  Image,
  Linking,
  Text,
  View,
} from 'react-native';
import {styles} from '../theme/styles';

import {enrollDevice} from '../services/entgraService';

const ConsentScreen = (props: {
  navigation: {navigate: (args0: string) => void};
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmitPress = async () => {
    setLoading(true);
    enrollDevice().catch(e => {
      console.log(e);
      setLoading(false);
    }).then(() => props.navigation.navigate('LoginScreen'));
    setLoading(false);
    // setTimeout(() => props.navigation.navigate('LoginScreen'), 1000);
    
  };

  return (
    <>
      <View
        style={{
          ...styles.mainBody,
          flex: 1,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
             source={require('../assets/images/guardio-primary.png')}
            style={styles.image}
          />
          <Text style={styles.heading}>Disclaimer</Text>
          <Text style={styles.textpara}>
            We may send your device information to Entgra IoT Server to assess
            your device's security level and to provide you with the best
            services. All data sent to Entgra IoT Server is only accessible to
            the authorized users and can be permanently removed if needed.
          </Text>
        </View>
        <View
          style={{...styles.button, marginBottom: 10, alignItems: 'center'}}>
          <Button
            color="#282c34"
            onPress={handleSubmitPress}
            title="Enroll Device"
          />
        </View>
        {loading ? (
          <View style={styles.loading} pointerEvents="none">
            <ActivityIndicator size="large" color="#FF8000" />
          </View>
        ) : null}
      </View>
    </>
  );
};

export default ConsentScreen;
