package com.isentgra.entgraServices;

import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.provider.Settings
import android.content.Context
import android.text.style.WrapTogetherSpan 
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.bridge.Callback
import com.google.gson.JsonElement
import com.isentgra.BuildConfig

// Entgra SDK APIs
import io.entgra.device.mgt.sdk.api.Config
import io.entgra.device.mgt.sdk.api.SDK
import io.entgra.device.mgt.sdk.api.compromise.CompromiseCheck
import io.entgra.device.mgt.sdk.api.http.Server
import io.entgra.device.mgt.sdk.common.exception.NetworkAccessException
import io.entgra.device.mgt.sdk.info.TelephoneInfo
import io.entgra.device.mgt.sdk.info.DeviceInfo

class EntgraServiceManager(reactContext : ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    /*
    * Context for Entgra Device managment sdk
    * Context should be the current Acitivity Context not the React Context
    * Otherwise it will not open window surface
     */
    // var context : Context ;

    override fun getName(): String {
        return "EntgraServiceManager";
    }

    /**
     * This method fetch device attributes from Entgra SDK locally and return as WritableNativeMap.
     * @return      WritableNativeMap of the device attributes fetched from Entgra SDK
     */
    fun getDeviceAttributesLocally  () : WritableMap{
        var compromiseCheck = CompromiseCheck(getCurrentActivity() as Context);
        var isDeviceRooted = compromiseCheck.isDeviceRooted();
        var isDevModeEnabled = compromiseCheck.isDevModeEnabled();
        var isADBEnabled = compromiseCheck.isADBEnabled();
        var resultData =  WritableNativeMap();
        resultData.putBoolean("isDeviceRooted", isDeviceRooted);
        resultData.putBoolean("isDevModeEnabled", isDevModeEnabled);
        resultData.putBoolean("isADBEnabled", isADBEnabled);
        return resultData;
    }

    
    fun getTelephoneInfoLocally  () : Set<Map.Entry<String, JsonElement?>> {
        var telephoneInfo = TelephoneInfo(getCurrentActivity() as Context)
        val entrySet: Set<Map.Entry<String, JsonElement?>> = telephoneInfo.getAllProperties().entrySet();
        return entrySet;
    }

    /**
     * This method fetch device identifier from Entgra SDK locally and return as String.
     * @return      String of device identifier
     */
    fun getDeviceIdentifier () : String {
        var deviceInfo = DeviceInfo(getCurrentActivity() as Context)
        var deviceId = deviceInfo.getDeviceId()
        return deviceId;
    }

    /**
     * This method is invoked from Java Script accepts Promise and return a Promise resolved
     * with the device attributes
     * @param       Promise
     * @return      Promise resolved with the device attributes
     */
    @ReactMethod
    fun getDeviceAttributes(promise: Promise) {
        try {
            val result = getDeviceAttributesLocally(); 
            promise.resolve(result);
        } catch (e: Exception) {
            promise.reject(e);
        }
    }

    /**
     * This method is invoked from Java Script accepts Promise and return a Promise resolved
     * with the device identifier
     * @param       Promise
     * @return      Promise resolved with the device identifier
     */
    @ReactMethod
    fun getDeviceID(promise: Promise) {
        try {
            val result = getDeviceIdentifier();
            promise.resolve(result);
        } catch (e: Exception) {
            promise.reject("Entgra Device Id error : ", e);
        }
    }

    /**
     * This method enroll device in Entgra IoT server
     * This method is invoked from Java Script accepts Promise and return a Promise resolved
     * with the success message
     * @param       Promise
     * @return      Promise resolved with the success message
     */
    @ReactMethod
    fun enrollDevice(promise: Promise) {
        var baseUrl = BuildConfig.ENTGRA_BASE_URL;
        var clientKey = BuildConfig.ENTGRA_CLIENT_KEY;
        var clientSecret = BuildConfig.ENTGRA_CLIENT_SECRET;
        var callBackURL = BuildConfig.ENTGRA_CALLBACK_URL;
        var mgtURL = BuildConfig.ENTGRA_MGT_URL;
        SDK(
            Config.Builder(getCurrentActivity() as Context)
                .verifyApps(true)
                .build()
        ).refresh() {
            try{
                var server = Server(baseUrl, getCurrentActivity() as Context)
                server.enrollAuth(clientKey,clientSecret,callBackURL, mgtURL) {
                    // Log.i(TAG, "$it.code  , $it.message")
                    promise.resolve("Enrolled Successfully");  
                }
            } catch (e: NetworkAccessException) {
                promise.reject("Network Error", e);
            } catch (error: Exception) {
                promise.reject("Entgra Device Enrollment error : ", error);
            }
        }
    }

    /**
     * Disenroll device from Entgra IoT server
     * This method is invoked from Java Script accepts Promise and return a Promise resolved
     * with the suceess message
     * @param       Promise
     * @return      Promise resolved with the device identifier
     */
    @ReactMethod
    fun disenrollDevice(promise: Promise) {
        try {
            // Not implemented
            // var baseUrl = BuildConfig.ENTGRA_BASE_URL;
            // var server = Server(baseUrl, getCurrentActivity() as Context);
            // server.enroll(username, password) {
            //     //  Log.i(TAG, "$it.code  , $it.message")
            // }
            promise.resolve("Successfully disenrolled device");
        } catch (e: NetworkAccessException) {
            promise.reject("Network Error", e);
        } catch (e : Exception) {
            promise.reject("Error in disenrolling device", e);
        }
    }

    /**
     * Sync device information to Entgra IoT server
     * This method is invoked from Java Script accepts Promise and return a Promise resolved
     * with the suceess message
     * @param       Promise
     * @return      Promise resolved with the device identifier
     */
    @ReactMethod
    fun syncDevice(promise: Promise) {
        var baseUrl = BuildConfig.ENTGRA_BASE_URL;
        SDK(
            Config.Builder(getCurrentActivity() as Context)
                .verifyApps(true)
                .build()
        ).refresh() {
            try {
                var server = Server(baseUrl, getCurrentActivity() as Context);
                server.sync() {
                    promise.resolve("Synced successfully");
                }
            } catch (e: NetworkAccessException) {
                promise.reject("Network Error");
            } catch (e : Exception) {
                promise.reject("Error in syncing device");
            }
        }
    }

}


