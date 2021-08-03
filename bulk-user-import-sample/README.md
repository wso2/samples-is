# Bulk User Import Client Samples

Java client that can import a bulk of users from comma-separated values (.csv) using admin services calls.

## Table of contents

- [Download and build](#download-and-build)
- [Running sample applications](#running-sample-applications)

## Download and build

### Prerequisites

* [Maven](https://maven.apache.org/download.cgi)
* [Java](http://www.oracle.com/technetwork/java/javase/downloads)

### Building from source

1. Get a clone or download source of [WSO2 sample-is repository](https://github.com/wso2/samples-is).

   We will refer this directory as `<IS_SAMPLE_REPO>` here onwards.
2. Run the Maven command `mvn clean install` from the `<IS_SAMPLE_REPO>/bulk-user-import-sample/BulkUserImport` directory.

You can find SSO sample applications in `target` directory of `<IS_SAMPLE_REPO>//bulk-user-import-sample/BulkUserImport`
directory.
Application distributions are named `BulkUserImport-LATEST-jar-with-dependencies.jar`.

## Running sample applications
 
In order to import the users, please follow these steps 
 
1. Start the WSO2 IS. 
3. Build the source code by following build commands in [Building from source](#building-from-source)
4. Copy the file [client.properties](https://github.com/wso2/samples-is/blob/master/bulk-user-import-sample/BulkUserImport/src/main/resources/client.properties) to **the same directory** as the .jar file.
5. Open the `client.properties` file and fill it with the information of your environment, following the comments and examples within it.
6. Change to the directory where you placed the files and run the .jar file as follows:
```
$ cd <jar_file_dir>
$ java -jar BulkUserImport-LATEST-jar-with-dependencies.jar
```
**Important:** It's mandatory to change to the directory where the files are placed to run the command.
7. At the end of the execution, the client will print in the terminal the information about the time spent in the import and the users count as shown below:
```sh
Login Successful
Total users count: 3
Users import time: 0m 0s 172ms
Import process finished
```
 
**NOTE:** If an error occurs in the middle of the import, the execution will stop and the line of the .csv file where error ocurred will be printed in the terminal. Which means that the user contained in that line was not imported, neither any of the next users in the file. Users processed until the error has occurred must have been imported normally.
Example:
```sh
User where error occurred: 
name00001,Password1,http://wso2.org/claims/emailaddress=name1@gmail.com,http://wso2.org/claims/country=France
```
