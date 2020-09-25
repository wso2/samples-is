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

import au.com.bytecode.opencsv.CSVReader;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.LineIterator;
import org.apache.commons.lang.StringUtils;
import org.wso2.carbon.authenticator.stub.LoginAuthenticationExceptionException;
import org.wso2.carbon.authenticator.stub.LogoutAuthenticationExceptionException;
import org.wso2.carbon.um.ws.api.stub.ClaimDTO;
import org.wso2.carbon.um.ws.api.stub.ClaimValue;
import org.wso2.carbon.um.ws.api.stub.RemoteUserStoreManagerServiceUserStoreExceptionException;
import org.wso2.carbon.user.mgt.stub.UserAdminUserAdminException;
import javax.activation.DataHandler;
import javax.mail.util.ByteArrayDataSource;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.rmi.RemoteException;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

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
        RemoteUserStoreServiceAdminClient remoteUserStoreServiceAdminClient = new RemoteUserStoreServiceAdminClient(
                productUrl, session);

        //Uncomment these lines to hardcode the file to be uploaded - For testing purposes
        //String filePath = "path/to/your/csv/file";
        //File f = new File(filePath);

        //Uncomment this line to be able to pass the file path as the first parameter of the .jar app
        File f = new File(props.getFilePath());

        // get the initial time of the process
        Instant lineCountStart = Instant.now();

        // initiate the variable that count the lines of the .csv file
        int lines = 0;

        // It will receive the file lines
        String line = "";


        //Iterator that will read the file line by line
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

                //Just counting lines
                lines++;

                line = it.nextLine();

                //userAdminClient.BulkImportUsers always ignore the first line, that's the \n purpose
                String newLine = "\n" + line;

                byte[] content = newLine.getBytes();
                DataHandler file = new DataHandler(new ByteArrayDataSource(content, "application/octet-stream"));

                BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(file.getInputStream(),
                        StandardCharsets.UTF_8));
                CSVReader csvReader = new CSVReader(bufferedReader, ',', '"', 1);

                String[] userEntry = csvReader.readNext();
                while (userEntry != null && userEntry.length > 0) {
                    String userName = userEntry[0];
                    if (userName != null && !userName.isEmpty()) {
                        userName = "PATRON/" + userName;
                        try {
                            updateAccountCreatedTimeAndValidateUser(remoteUserStoreServiceAdminClient, userName, userEntry);
                        } catch (UserAdminUserAdminException e) {
                            e.printStackTrace();
                            out.println("User where error occurred: \n" + line);
                        }
                    }
                    userEntry = csvReader.readNext();
                }
                out.println("User count : " + lines);
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

        out.println("Update created time and users verification time: " +
                minutes + "m " + seconds + "s " + millis + "ms");

        out.println("Update created time and users verification process finished");

        login.logOut();
    }

    private static void updateAccountCreatedTimeAndValidateUser(
            RemoteUserStoreServiceAdminClient remoteUserStoreServiceAdminClient, String username, String[] line)
            throws UserAdminUserAdminException {

        String roleString = null;
        String[] roles = null;
        String password = line[1];
        Map<String, String> claims = new HashMap<>();
        for (int i = 2; i < line.length; i++) {
            if (StringUtils.isNotBlank(line[i])) {
                String[] claimStrings = line[i].split("=");
                if (claimStrings.length != 2) {
                    throw new IllegalArgumentException("Claims and values are not in correct format");
                } else {
                    String claimURI = claimStrings[0];
                    String claimValue = claimStrings[1];
                    if (claimURI.contains("role")) {
                        roleString = claimValue;
                    } else {
                        if (!claimURI.isEmpty()) {
                            // Not trimming the claim values as we should not restrict the claim values not to have
                            // leading or trailing whitespaces.
                            claims.put(claimURI.trim(), claimValue);
                        }
                    }
                }
            }
        }

        if (StringUtils.isNotBlank(roleString)) {
            roles = roleString.split(":");
        }

        // Update created time.
        String accountCreatedClaimURI = "http://wso2.org/claims/created";
        if (StringUtils.isNotEmpty(claims.get(accountCreatedClaimURI))) {
            ClaimValue accountCreatedClaimValue = new ClaimValue();
            accountCreatedClaimValue.setClaimURI(accountCreatedClaimURI);
            accountCreatedClaimValue.setValue(claims.get(accountCreatedClaimURI));

            ClaimValue[] claimValues = new ClaimValue[]{accountCreatedClaimValue};
            try {
                remoteUserStoreServiceAdminClient.setUserClaimValues(username, claimValues, "default");
            } catch (RemoteUserStoreManagerServiceUserStoreExceptionException | RemoteException e) {
                throw new UserAdminUserAdminException("Unable to update created time for the user : " + username, e);
            }
        }

        // Validate entries.
        ClaimDTO[] userClaims;
        try {
            userClaims = remoteUserStoreServiceAdminClient.getUserClaimValues(username, "default");
        } catch (RemoteUserStoreManagerServiceUserStoreExceptionException | RemoteException e) {
            throw new UserAdminUserAdminException("Unable get user claims for the user : " + username, e);
        }

        Map<String, String> userClaimsMap = new HashMap<>();
        for (ClaimDTO claimDTO : userClaims) {
            userClaimsMap.put(claimDTO.getClaimUri(), claimDTO.getValue());
        }
        for (Map.Entry<String, String> csvClaimValueEntry : claims.entrySet()) {
            if (userClaimsMap.get(csvClaimValueEntry.getKey()) == null || !userClaimsMap.get(
                    csvClaimValueEntry.getKey()).equals(csvClaimValueEntry.getValue())) {

                // Skipping empty created time.
                if (csvClaimValueEntry.getKey().contains("/created") && StringUtils.isBlank(csvClaimValueEntry.getValue())) {
                    continue;
                }

                throw new UserAdminUserAdminException("User validation failed for the user : " + username + ". " +
                        "Expected value for the claim uri : " + csvClaimValueEntry.getKey() + ", is "
                        + csvClaimValueEntry.getValue() + ", but got " + userClaimsMap.get(csvClaimValueEntry.getKey()));
            }
        }
    }
}
