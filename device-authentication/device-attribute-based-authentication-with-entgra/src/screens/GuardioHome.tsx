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
  Text,
  View,
  ImageBackground,
} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {styles} from '../theme/styles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faDollar} from '@fortawesome/free-solid-svg-icons/faDollar';

const GuardioHome = (props: {
  navigation: {navigate: (args0: string) => void};
}) => {
  function renderHeader() {
      return (
      <View style={{width: '100%', height: 300}}>
        <ImageBackground
          source={require('../assets/images/solid-color-image.png')}
          resizeMode="cover"
          style={{flex: 1, alignItems: 'center'}}>
          {/* Balance Section */}
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 50,
            }}>
            <Image
            source={require('../assets/images/guardio-light.png')}
            style={styles.image}
          />
            <Text style={{color: 'white', fontSize: 18}}>
              {' '}
              Available Balance
            </Text>
            <Text
              style={{
                color: 'white',
                marginTop: 10,
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              LKR 468,000.00
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  }

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 2,
          backgroundColor: 'white',
          height: 70,
        }}
        onPress={() => {}}>
        <FontAwesomeIcon
          icon={faDollar}
          size={30}
          color="black"
          style={{flex: 1}}
        />
        <View
          style={{
            flex: 1,
            marginLeft: 3,
          }}>
          <Text style={{color: 'black'}}>{item.description}</Text>
          <Text style={{color: 'black'}}>{item.date}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            height: '100%',
            alignItems: 'center',
          }}>
          <Text style={{color: 'black'}}>{item.amount}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  function renderTransactionHistory() {
    return (
      <View
        style={{
          marginTop: 20,
          marginHorizontal: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
          backgroundColor: 'white',
        }}>
        <Text style={{...styles.topicText3}}>Recent Transaction History </Text>
        <FlatList
          contentContainerStyle={{marginTop: 10}}
          scrollEnabled={false}
          data={transactionDemoData}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View
              style={{height: 1, width: '100%', backgroundColor: 'black'}}
            />
          )}
        />
      </View>
    );
  }

  return (
    <>
      <View style={{flex:1, flexDirection: 'column', backgroundColor: 'white',justifyContent: 'flex-start'}}>
        <View style={{flex: 1, justifyContent: 'flex-start'}}>{renderHeader()}</View>

        <View style={{flex:2, alignContent: 'center', justifyContent: 'flex-start'}}>{renderTransactionHistory()}</View>
      </View>
    </>
  );
};

export default GuardioHome;

const transactionDemoData = [
  {
    id: 1,
    description: 'Fund transfer via CEFT',
    date: '12/12/2020',
    amount: 'LKR 20,000.00',
  },
  {
    id: 2,
    description: 'Fund transfer via CEFT',
    date: '12/12/2020',
    amount: 'LKR 50,000.00',
  },
  {
    id: 3,
    description: 'Fund transfer via CEFT',
    date: '12/12/2020',
    amount: 'LKR 35,000.00',
  },
  {
    id: 4,
    description: 'Fund transfer via CEFT',
    date: '12/12/2020',
    amount: 'LKR 12,000.00',
  },
  {
    id: 5,
    description: 'Fund transfer via CEFT',
    date: '12/12/2020',
    amount: 'LKR 86,000.00',
  },
  {
    id: 6,
    description: 'Fund transfer via CEFT',
    date: '12/12/2020',
    amount: 'LKR 102,000.00',
  },
];

