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
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

// eslint-disable-next-line react/prop-types
const Button = ({
  text,
  color,
  onPress,
}: {
  text: string;
  color: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={[styles.buttonBox, {backgroundColor: color}]}>
    <Text style={styles.text}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  buttonBox: {
    alignItems: 'center',
    flex: 1,
    height: 50,
    justifyContent: 'center',
    margin: 5,
  },
  text: {
    color: 'white',
  },
});

export default Button;
