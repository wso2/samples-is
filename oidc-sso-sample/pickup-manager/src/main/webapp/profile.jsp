<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<!--
~   Copyright (c) 2018 WSO2 Inc. (http://wso2.com) All Rights Reserved.
~
~   Licensed under the Apache License, Version 2.0 (the "License");
~   you may not use this file except in compliance with the License.
~   You may obtain a copy of the License at
~
~        http://www.apache.org/licenses/LICENSE-2.0
~
~   Unless required by applicable law or agreed to in writing, software
~   distributed under the License is distributed on an "AS IS" BASIS,
~   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
~   See the License for the specific language governing permissions and
~   limitations under the License.
-->
<%@ page import="com.nimbusds.jwt.ReadOnlyJWTClaimsSet" %>
<%@ page import="com.nimbusds.jwt.SignedJWT" %>
<%@ page import="org.wso2.sample.identity.oauth2.OAuth2Constants" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Properties" %>
<%@ page import="org.wso2.sample.identity.oauth2.SampleContextEventListener" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%
    String idToken = null;
    String sessionState = null;
    String error;
    String name = null;
    Properties properties;
    properties = SampleContextEventListener.getProperties();
    ReadOnlyJWTClaimsSet claimsSet = null;

    try {
        error = request.getParameter(OAuth2Constants.ERROR);
        if (StringUtils.isNotBlank(error)) { // User has been logged out
            session.invalidate();
            response.sendRedirect("index.jsp");
            return;
        }
        sessionState = request.getParameter(OAuth2Constants.SESSION_STATE);
        if (StringUtils.isNotBlank(sessionState)) {
            session.setAttribute(OAuth2Constants.SESSION_STATE, sessionState);
        }
        idToken = request.getParameter("id_token");
        if (idToken != null) {
            try {
                name = SignedJWT.parse(idToken).getJWTClaimsSet().getSubject();
                claimsSet= SignedJWT.parse(idToken).getJWTClaimsSet();
                session.setAttribute(OAuth2Constants.NAME, name);
            } catch (Exception e) {
//ignore
            }
        }


%>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="PICKUP MANAGER - Management Application">

    <title>PICKUP MANAGER</title>

    <!-- Bootstrap Material Design CSS -->
    <link href="libs/bootstrap-material-design_4.0.0/css/bootstrap-material-design.min.css" rel="stylesheet">
    <!-- Font Awesome icons -->
    <link href="libs/fontawesome-5.2.0/css/solid.min.css" rel="stylesheet">
    <link href="libs/fontawesome-5.2.0/css/fontawesome.min.css" rel="stylesheet">
    <!-- Custom styles -->
    <link href="css/custom.css" rel="stylesheet">
    <link href="css/manager.css" rel="stylesheet">
</head>

<body class="app-home manager profile">

<nav class="navbar navbar-expand-lg navbar-dark app-navbar justify-content-between">
    <a class="navbar-brand" href="home.html"><i class="fas fa-taxi"></i> PICKUP MANAGER</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav flex-row ml-md-auto ">
            <li class="nav-item dropdown ">
                <a class="nav-link dropdown-toggle user-dropdown" href="#" id="navbarDropdownMenuLink"
                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-user-circle"></i> <span><%=name%></span>
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" href="home.jsp?session_state=<%=sessionState%>&id_token_hint=<%=idToken%>">Home</a>
                    <a class="dropdown-item" href='<%=properties.getProperty("OIDC_LOGOUT_ENDPOINT")%>?post_logout_redirect_uri=<%=properties.getProperty("post_logout_redirect_uri")%>&id_token_hint=<%=idToken%>&session_state=<%=sessionState%>'>Logout</a>
                </div>
            </li>
        </ul>
    </div>
</nav>

<main role="main" class="main-content">
    <section class="jumbotron text-center">
        <div class="container">
            <div class="user-icon">
                <i class="fas fa-user-circle fa-5x"></i>
            </div>
            <div class="jumbotron-heading"><%=name%></div>
        </div>
    </section>
    <div class="container">
        <div class="row">
            <div class="col-md-6 d-block mx-auto">
                <div class="card card-body table-container">
                    <div class="table-responsive content-table">
                        <%
                            if (claimsSet != null) {
                                Map<String, Object> hashmap = new HashMap<>();
                                hashmap = claimsSet.getCustomClaims();
                                if (!hashmap.isEmpty()) {

                        %>
                        <table class="table">
                            <thead>
                            <tr>
                                <th rowspan="2">User Details</th>
                            </tr>
                            </thead>
                            <tbody>
                            <%
                                for (String key : hashmap.keySet()){
                                    if (!(key.equals("at_hash") || key.equals("c_hash") || key.equals("azp")
                                            || key.equals("amr") || key.equals("sid"))) {
                            %>
                            <tr>
                                <td><%=key%></td>
                                <td><%=hashmap.get(key).toString()%></td>
                            </tr>
                            <%
                                    }
                                }
                            %>
                            </tbody>
                        </table>
                        <%
                        } else {

                        %>
                        <p align="center">No user details Available. Configure SP Claim Configurations.</p>

                        <%
                                }
                            }
                        %>

                    </div>
                </div>
            </div>
        </div>
        </section>
    </div>
</main>
<footer class="text-muted footer text-center">
    <span>Copyright &copy; <a href="http://wso2.com/" target="_blank">
        <img src="img/wso2-dark.svg" class="wso2-logo" alt="wso2-logo"></a> &nbsp;<span class="year"></span>
    </span>
</footer>

<!-- JQuery -->
<script src="libs/jquery_3.3.1/jquery.min.js"></script>
<!-- Popper -->
<script src="libs/popper_1.12.9/popper.min.js"></script>
<!-- Bootstrap Material Design JavaScript -->
<script src="libs/bootstrap-material-design_4.0.0/js/bootstrap-material-design.min.js"></script>
<!-- Custom Js -->
<script src="js/custom.js"></script>

</body>
</html>
<%
    } catch (Exception e) {
        error = e.getMessage();
        System.console().printf(error);
    }

%>