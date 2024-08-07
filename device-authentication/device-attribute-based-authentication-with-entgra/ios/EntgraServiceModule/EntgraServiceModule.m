//
//  EntgraServiceModule.m
//  ISEntgra
//
//  Created by User on BE 2565-03-16.
//

#import <Foundation/Foundation.h>
#import "EntgraServiceModule.h"

@implementation EntgraServiceModule

// Export EntgraServiceModule
// EntgraServiceManager ->  Name that the module will be accessible in JS
RCT_EXPORT_MODULE(EntgraServiceManager);

// Get device id method
RCT_EXPORT_METHOD(getDeviceID: (RCTResponseSenderBlock)successCallback errorCallback: (RCTResponseSenderBlock)errorCallback)
{
  @try{
    // Implement get device id logic
    NSString *deviceID = @ "testdeviceId-456";
    successCallback(@[deviceID]);
  }
  @catch(NSException *exception){
    errorCallback(@[exception]);
  }
}



// Enroll mobile device in Entgra Server
RCT_EXPORT_METHOD(enrollDevice: (RCTResponseSenderBlock)successCallback errorCallback: (RCTResponseSenderBlock)errorCallback)
{
  @try{
    // Implement enrolling logic
    successCallback(@[ @ "Enrolled Successfully!"]);
  }
  @catch(NSException *exception){
    errorCallback(@[exception]);
  }
}

@end
