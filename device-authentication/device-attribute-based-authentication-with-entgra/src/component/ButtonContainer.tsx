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

import React from "react";
import { StyleSheet, View } from "react-native";

const ButtonContainer = (props : any ) => <View style={ styles.view } { ...props } />;

const styles = StyleSheet.create({
    view: {
        alignSelf: "flex-end",
        bottom: 0,
        flexDirection: "row",
        left: 0,
        margin: 5,
        position: "absolute",
        right: 0
    }
});

export default ButtonContainer;
