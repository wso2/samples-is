# Sample Consent Management Interceptor

This is a sample consent management interceptor which is an extension of `ConsentMgtInterceptor`.

## Building from the source

1. Install Java8
1. Install Apache Maven 3.x.x(https://maven.apache.org/download.cgi#)
1. Get a clone or download the source from this repository (https://github.com/wso2/samples-is.git)
1. Navigate to `consent-mgt/interceptor` directory.
1. Run the Maven command ``mvn clean install`` from the ``carbon-consent-management`` directory.

## Installing the interceptor

1. Copy the buit jar `sample-consent-mgt-interceptor-1.0.0-SNAPSHOT.jar` from `target` directory to `<IS_HOME>/repository/components/dropins` directory.
1. Restart Identity Server.