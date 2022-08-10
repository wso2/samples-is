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

import {NativeModules} from 'react-native';
import {storeString} from '../utils/Storage';
// Get Entgra Services from Native Modules and export
const EntgraServiceManager: IEntgraServiceManager = NativeModules.EntgraServiceManager;

interface IEntgraServiceManager {
  getDeviceAttributes(): Promise<any>;
  getDeviceID(): Promise<string>;
  enrollDevice(): Promise<string>;
  disenrollDevice(): Promise<string>;
  syncDevice(): Promise<string>;
}

/**
 * This method returns a Promise that resolves with the device attributes,
 * fetched form the native module
 * @example
 * ```
 * getDeviceAttributes().then((response) => {
 *     console.log(response);
 * }).catch((error) => {
 *     console.error(error);
 * });
 * ```
 */
export async function getDeviceAttributes(): Promise<any> {
  return await EntgraServiceManager.getDeviceAttributes();
}

/**
 * This method returns a Promise that resolves with the device identifier,
 * fetched form the native module
 * @example
 * ```
 * getDeviceID().then((response) => {
 *     console.log(response);
 * }).catch((error) => {
 *     console.error(error);
 * });
 * ```
 */
export async function getDeviceID(): Promise<string> {
  return await EntgraServiceManager.getDeviceID();
}

/**
 * This method enroll device to Entgra Service and 
 * returns a Promise that resolves with the success message
 * @example
 * ```
 * enrollDevice().then((response) => {
 *     console.log(response);
 * }).catch((error) => {
 *     console.error(error);
 * });
 * ```
 */
export async function enrollDevice(): Promise<string> {
  try {
    const res = await EntgraServiceManager.enrollDevice();
    await storeString('enrolledState', 'true');
    return 'Successfully enrolled device';
  } catch (error) {
    console.error(error);
    return 'Device enrollment failed';
  }
}

/**
 * This method disenroll the device from Entgra IoT server and
 * returns a Promise that resolves with the success message
 * @example
 * ```
 * disenrollDevice().then((response) => {
 *     console.log(response);
 * }).catch((error) => {
 *     console.error(error);
 * });
 * ```
 */
export async function disenrollDevice(): Promise<string> {
  try {
    await EntgraServiceManager.disenrollDevice();
    await storeString('enrolledState', 'false');
    return 'Successfully disenrolled device';
  } catch (error) {
    console.error(error);
    return 'Device disenrollment failed';
  }
}

/**
 * This method sync device information to the Entgra IoT server and
 * returns a Promise that resolves with the success message
 * @example
 * ```
 * syncDevice().then((response) => {
 *     console.log(response);
 * }).catch((error) => {
 *     console.error(error);
 * });
 * ```
 */
 export async function syncDevice(): Promise<string> {
  try {
    const res = await EntgraServiceManager.syncDevice();
    console.log(res);
    return 'Successfully synced';
  } catch (error) {
    console.error(error);
    return 'Device syncing failed';
  }
}

export default EntgraServiceManager as IEntgraServiceManager;
