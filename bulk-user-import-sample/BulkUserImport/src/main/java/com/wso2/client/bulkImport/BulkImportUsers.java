/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package com.wso2.client.bulkImport;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.LineIterator;
import org.wso2.carbon.authenticator.stub.LoginAuthenticationExceptionException;
import org.wso2.carbon.authenticator.stub.LogoutAuthenticationExceptionException;
import org.wso2.carbon.user.mgt.stub.UserAdminUserAdminException;
import javax.activation.DataHandler;
import javax.mail.util.ByteArrayDataSource;
import java.io.File;
import java.io.IOException;
import java.time.Duration;
import java.time.Instant;

import static java.lang.System.out;

public class BulkImportUsers {

    public static void main(String[] args)
            throws IOException, LoginAuthenticationExceptionException, LogoutAuthenticationExceptionException {

        ClientGetPropertiesValues props = new ClientGetPropertiesValues();

        // Getting the product URL as a java property from the command
        String productUrl = props.getProductUrl();

        // Authentication
        String authUser = props.getAuthUser();
        String authPwd = props.getAuthPwd();
        String remoteAddress = props.getRemoteAddress();
        LoginAdminServiceClient login = new LoginAdminServiceClient(productUrl);
        String session = login.authenticate(authUser, authPwd, remoteAddress);
        UserAdminClient userAdminClient = new UserAdminClient(productUrl, session);

        // Uncomment these lines to hardcode the file to be uploaded - For testing purposes
        //String filePath = "path/to/your/csv/file";
        //File f = new File(filePath);

        // Uncomment this line to be able to pass the file path as the first parameter of the .jar app
        File f = new File(props.getFilePath());

        // Get the initial time of the process
        Instant lineCountStart = Instant.now();

        // Initiate the variable that count the lines of the .csv file
        int lines = 0;

        // It will receive the file lines
        String line = "";


        // Iterator that will read the file line by line
        LineIterator it = FileUtils.lineIterator(f, "UTF-8");

        try {
            // Taking the useless first line
            it.nextLine();

            String fileName = f.getName();
            out.println(fileName);

            // If you want to specify the user store, use the second argument.
            String userStoreName = props.getUserStoreName();

            // If you want to specify the default password, use the third argument.
            String defaultPassword = props.getDefaultPassword();

            // Looping through the file lines
            while (it.hasNext()) {

                // Just counting lines
                lines++;

                line = it.nextLine();

                // userAdminClient.BulkImportUsers always ignore the first line, that's the \n purpose
                String newLine = "\n" + line;

                byte[] content = newLine.getBytes();
                DataHandler file = new DataHandler(new ByteArrayDataSource(content, "application/octet-stream"));

                try {
                    userAdminClient.BulkImportUsers(userStoreName, defaultPassword, file, fileName);
                } catch (UserAdminUserAdminException e) {
                    e.printStackTrace();
                    out.println("User where error occurred: \n" + line);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
            out.println("User where error occurred: \n" + line);
        } finally {
            LineIterator.closeQuietly(it);
        }

        out.println("Total users count: " + lines);
        Instant lineCountEnd = Instant.now();

        // Calculating the execution time
        long millis = Duration.between(lineCountStart, lineCountEnd).toMillis();
        long minutes = (millis / 1000) / 60;
        millis = millis - 60000 * minutes;
        long seconds = (millis / 1000) % 60;
        millis = millis - 1000 * seconds;

        out.println("Users import time: " +
                minutes + "m " + seconds + "s " + millis + "ms");

        out.println("Import process finished");

        login.logOut();
    }
}
