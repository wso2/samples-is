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

package com.wso2.csa;

import org.apache.axis2.AxisFault;
import org.apache.axis2.context.ServiceContext;
import org.apache.axis2.transport.http.HTTPConstants;
import org.wso2.carbon.authenticator.stub.AuthenticationAdminStub;
import org.wso2.carbon.authenticator.stub.LoginAuthenticationExceptionException;
import org.wso2.carbon.authenticator.stub.LogoutAuthenticationExceptionException;

import java.rmi.RemoteException;

class LoginAdminServiceClient {
    private static final String SERVICE_NAME = "AuthenticationAdmin";
    private AuthenticationAdminStub authenticationAdminStub;

    LoginAdminServiceClient(String backEndUrl) throws AxisFault {
        String endPoint = backEndUrl + "/services/" + SERVICE_NAME;
        authenticationAdminStub = new AuthenticationAdminStub(endPoint);
    }


    /**
     * @return sessionCookie
     * @throws RemoteException                       .
     * @throws LoginAuthenticationExceptionException .
     */
    String authenticate(String authUser, String authPwd, String remoteAddress) throws RemoteException,
            LoginAuthenticationExceptionException {

        String sessionCookie = null;

        if (authenticationAdminStub.login(authUser, authPwd, remoteAddress)) {
            System.out.println("Login Successful");

            ServiceContext serviceContext = authenticationAdminStub.
                    _getServiceClient().getLastOperationContext().getServiceContext();
            sessionCookie = (String) serviceContext.getProperty(HTTPConstants.COOKIE_STRING);
        }

        return sessionCookie;
    }

    /**
     * @throws RemoteException                        .
     * @throws LogoutAuthenticationExceptionException .
     */
    void logOut() throws RemoteException, LogoutAuthenticationExceptionException {
        authenticationAdminStub.logout();
    }
}
