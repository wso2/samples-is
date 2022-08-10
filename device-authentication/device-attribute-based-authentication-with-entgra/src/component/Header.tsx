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
import {View, Text, TouchableOpacity} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
    import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
    import { faBell } from '@fortawesome/free-solid-svg-icons/faBell';
import { useNavigation } from '@react-navigation/native';

import {styles} from '../theme/styles';

export default function Header() {
  const navigation : any = useNavigation();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
              <FontAwesomeIcon icon={faBars} size={ 20} color='white'/>
      </TouchableOpacity>
      <View style={{justifyContent:'center', alignSelf:'center'}}>
        <FontAwesomeIcon
                icon={faBell}
                size={20}
                color="white"
                style={{flex: 1}}
                secondaryColor="black"
              />
      </View>
    </View>
  );
}


