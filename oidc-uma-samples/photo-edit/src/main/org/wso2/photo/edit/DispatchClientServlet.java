/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
package org.wso2.photo.edit;

import org.apache.commons.lang.StringUtils;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.wso2.photo.edit.exceptions.SampleAppServerException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * This is the servlet which handles OAuth callbacks.
 */
public class DispatchClientServlet extends HttpServlet {

    private final Logger LOGGER = Logger.getLogger(DispatchClientServlet.class.getName());

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        responseHandler(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        responseHandler(req, resp);
    }

    private void responseHandler(final HttpServletRequest request, final HttpServletResponse response) throws IOException {
        // Create the initial session
        if (request.getSession(false) == null) {
            request.getSession(true);
        }

        // Validate callback properties
        if (request.getParameterMap().isEmpty() || (request.getParameterMap().containsKey("sp") && request.getParameterMap().containsKey("tenantDomain"))) {
            CommonUtils.logout(request, response);
            response.sendRedirect("index.jsp");
            return;
        }

        final String error = request.getParameter(OAuth2Constants.ERROR);

        if (StringUtils.isNotBlank(error)) {
            // Error response from IDP
            CommonUtils.logout(request, response);
            response.sendRedirect("index.jsp");
            return;
        }

        try {
            // Obtain token response
            CommonUtils.getToken(request, response);
            response.sendRedirect("home.jsp");
        } catch (OAuthSystemException | OAuthProblemException | SampleAppServerException e) {
            LOGGER.log(Level.SEVERE, "Something went wrong", e);
            response.sendRedirect("index.jsp");
        }
    }
}
