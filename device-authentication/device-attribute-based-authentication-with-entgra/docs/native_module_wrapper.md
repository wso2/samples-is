## Accessing entgra native module from JavaScript

```ts
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
 *
 * getDeviceAttributes().then((response) => {
 *     console.log(response);
 * }).catch((error) => {
 *     console.error(error);
 * });
 *
 */
export async function getDeviceAttributes(): Promise<any> {
    return await EntgraServiceManager.getDeviceAttributes();
}

/**
 * This method returns a Promise that resolves with the device identifier,
 * fetched form the native module
 * @example
 *
 * getDeviceID().then((response) => {
 *     console.log(response);
 * }).catch((error) => {
 *     console.error(error);
 * });
 *
 */
export async function getDeviceID(): Promise<string> {
    return await EntgraServiceManager.getDeviceID();
}

/**
 * This method enroll device to Entgra Service and
 * returns a Promise that resolves with the success message
 * @example
 *
 * enrollDevice().then((response) => {
 *     console.log(response);
 * }).catch((error) => {
 *     console.error(error);
 * });
 *
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
 * This method sync device information to the Entgra IoT server and
 * returns a Promise that resolves with the success message
 * @example
 *
 * syncDevice().then((response) => {
 *     console.log(response);
 * }).catch((error) => {
 *     console.error(error);
 * });
 *
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
```
