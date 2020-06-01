# Bulk User Export Tool

Java client that can export a bulk of users as a comma-separated values (.csv) using SCIM 2.0 APIs.

## Table of contents

- [Exporting user data from WSO2 IS](#exporting-user-data-from-wso2-is)
- [Download and build](#download-and-build)

## Exporting user data from WSO2 IS

Follow these steps to export user data from WSO2 IS

1. Start the WSO2 IS. (Note : This should SCIM 2.0 supported and enabled IS version(5.3.0 or higher))
2. Download the latest jar in sample-is releases().
3. Extract the downloaded .zip file.
4. Run `sh start.sh` inside extracted directory.
5. Provide the host address of the Identity Server instance.
[Note : If you’re getting user data from the super-tenant you only need to provide the host address 
of the instance(ex : For a local instance https://localhost:9443). If you’re getting data from a tenant you need 
append `t/<tenant-domain>` to host address (ex: https://localhost:9443/t/wso2).]
6. Provide user credentials of a user with required permissions to call SCIM 2.0 /users endpoint.
7. Provide location of the CSV file you need to create. This is an **optional** parameter 
and by default tool will create a users.csv in the tool directory.
8. Provide attributes that needs to be filtered. Created CSV will only have the attributes specified. 
This is also an **optional** input.
9. Provide attributes that needs to be excluded when creating the CSV. Attributes provided here won’t be in the CSV. 
This is also an **optional** input.
10. Now you've successfully created the CSV file containing user data.

## Download and build

### Prerequisites

* [Maven](https://maven.apache.org/download.cgi)
* [Java](http://www.oracle.com/technetwork/java/javase/downloads)

### Building from source

1. Get a clone or download source of [WSO2 sample-is repository](https://github.com/wso2/samples-is).

   We will refer this directory as `<IS_SAMPLE_REPO>` here onwards.
2. Run the Maven command `mvn clean install` from the `<IS_SAMPLE_REPO>/bulk-user-export-tool/scim-bulk-user-export-tool` directory.

You can find the tool in `target` directory of `<IS_SAMPLE_REPO>/bulk-user-export-tool/scim-bulk-user-export-tool`
directory.
Application distributions are named as `scim-bulk-user-export-tool-LATEST.jar`.
Tool can be found as a .zip file in `target` directory `scim-bulk-user-export-tool-LATEST.zip`