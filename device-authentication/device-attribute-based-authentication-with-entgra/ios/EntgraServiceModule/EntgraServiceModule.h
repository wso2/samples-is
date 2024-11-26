//
//  EntgraServiceModule.h
//  ISEntgra
//
//  Created by User on BE 2565-03-16.
//

#ifndef EntgraServiceModule_h
#define EntgraServiceModule_h

#import <React/RCTBridgeModule.h>
@interface EntgraServiceModule : NSObject <RCTBridgeModule>

- (void) getDeviceID : (RCTResponseSenderBlock)successCallback errorCallback: (RCTResponseSenderBlock)errorCallback;
- (void) getDeviceAttributes : (RCTResponseSenderBlock)successCallback errorCallback: (RCTResponseSenderBlock)errorCallback;

@end

#endif /* EntgraServiceModule_h */
