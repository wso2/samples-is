## WSO2 Identity Server web analytics integration
Web Analytics is used for the purpose of identifying the way users interact with web pages. WSO2 Identity Server supports the integration of both Google Analytics and the Mixpanel. Getting the Identity Service to fire events at different pages is easy enough. You can choose to enable either or both of the analytics services. 

### Setting up web analytics
1. Open the config.jsp in the analytics-extensions directory and replace the relevant token string of the analytics service that you want to be enabled.

2. Open the config.jsp in the analytics-extensions directory and replace the relevant token string of the analytics service that you want to be enabled.
    1. Get a Google Analytics token.
        1. Create a Google Analytics project.
        2. Go to Admin -> Tracking Info -> Tracking Code.
        3. Look for the token of your project inside, `gtag('config', 'UA-148957636-2');`.
    2. Get a Mixpanel token.
        1. Create a Mixpanel project.
        2. Go to Settings -> Set up Mixpanel.
        3. Look for the token of your project inside, `mixpanel.init("a97474fa7c8059c98a9972f2f5406596");`.
        
3. Replace the following files inside the IS_HOME with the respective files in the analytics-extensions.

|                                        Original file                                       	|                            File to replace                           	|
|:------------------------------------------------------------------------------------------:	|:--------------------------------------------------------------------:	|
| IS_HOME/repository/deployment/server/webapps/authenticationendpoint/includes/localize.jsp  	| samples-is/analytics-extensions/authenticationendpoint/localize.jsp  	|
| IS_HOME/repository/deployment/server/webapps/accountrecoveryendpoint/includes/localize.jsp 	| samples-is/analytics-extensions/accountrecoveryendpoint/localize.jsp 	|

4. Copy the analytics.jsp and config.jsp files inside the analytics-extensions to both the authenticationendpoint/include and accountrecoveryendpoint/include directories in the IS_HOME.

5. Run your Identity Server instance in the usual way and the analytics events will be fired when the users access the relevant web pages. 

