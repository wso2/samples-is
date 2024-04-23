# wso2-user-store-listener

WSO2 Carbon User Stores provide the ability to customize user store operations by registering an event listener for these operations. The listeners are executed at a fixed point in the user store operation, and the users are free to create a listener which implements their desired logic to be executed at these fixed points. Listener is an extension to extend the user core functions. Any number of listeners can be plugged with the user core and they would be called one by one. By using a listener, you are not overriding the user store implementation, which is good since you are not customizing the existing implementations.

This is a sample code provided in [1] with a workaround for a issue [2].

[1] https://docs.wso2.com/display/IS550/User+Store+Listeners
[2] https://github.com/wso2/carbon-kernel/issues/1826
