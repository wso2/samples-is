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

<%@page import="java.util.logging.Level"%>
<%@page import="com.nimbusds.jwt.SignedJWT"%>
<%@page import="com.nimbusds.jwt.JWTClaimsSet"%>
<%@page import="org.json.JSONObject"%>
<%@page import="org.wso2.photo.view.OAuth2Constants"%>
<%@page import="java.util.Properties"%>
<%@page import="org.wso2.photo.view.SampleContextEventListener"%>
<%@page import="java.util.logging.Logger"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>

<%
    final Logger logger = Logger.getLogger(getClass().getName());
    final HttpSession currentSession =  request.getSession(false);
    
    if (currentSession == null || currentSession.getAttribute("authenticated") == null) {
        // A direct access to home. Must redirect to index
        response.sendRedirect("index.jsp");
        return;
    }
    
    final Properties properties = SampleContextEventListener.getProperties();
    final String sessionState = request.getParameter(OAuth2Constants.SESSION_STATE);
    
    currentSession.setAttribute(OAuth2Constants.SESSION_STATE, sessionState);
   
    final JSONObject requestObject = (JSONObject) currentSession.getAttribute("requestObject");
    final JSONObject responseObject = (JSONObject) currentSession.getAttribute("responseObject");
    
    final String idToken = (String) currentSession.getAttribute("idToken");
    
    JWTClaimsSet claimsSet = null;
    String name = "";
    
    if (idToken != null) {
        try {
            name = SignedJWT.parse(idToken).getJWTClaimsSet().getSubject();
            claimsSet = SignedJWT.parse(idToken).getJWTClaimsSet();
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Error when getting id_token details.", e);
        }
    }



%>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Photo View Application">

    <title>Photo View</title>

    <!-- Bootstrap Material Design CSS -->
    <link href="libs/bootstrap-material-design_4.0.0/css/bootstrap-material-design.min.css" rel="stylesheet">
    <!-- Font Awesome icons -->
    <link href="libs/fontawesome-5.2.0/css/fontawesome.min.css" rel="stylesheet">
    <link href="libs/fontawesome-5.2.0/css/solid.min.css" rel="stylesheet">
    <!-- Golden Layout styles -->
    <link href="libs/goldenlayout/css/goldenlayout-base.css" rel="stylesheet">
    <!-- Highlight styles -->
    <link href="libs/highlight_9.12.0/styles/atelier-cave-light.css" rel="stylesheet">

    <!-- Custom styles -->
    <link href="css/spinner.css" rel="stylesheet">
    <link href="css/custom.css" rel="stylesheet">
    <link href="css/manager.css" rel="stylesheet">

    <style>
        .small-image {
          width: 200px;
        }
    </style>
</head>

<body class="app-home">

<div id="wrapper" class="wrapper"></div>

<div id="actionContainer">
    <nav class="navbar navbar-expand-lg navbar-dark app-navbar justify-content-between">
        <a class="navbar-brand" href="home.jsp"><i class="fas fa-tasks"></i> Photo Viewer</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav flex-row ml-md-auto ">
                <li class="nav-item dropdown ">
                    <a class="nav-link dropdown-toggle user-dropdown" href="#" id="navbarDropdownMenuLink"
                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-user-circle"></i> <span><%=name%></span></span>
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <a class="dropdown-item" href="#" id="profile">Profile</a>
                        <a class="dropdown-item" href='<%=properties.getProperty("OIDC_LOGOUT_ENDPOINT")%>?post_logout_redirect_uri=<%=properties.getProperty("post_logout_redirect_uri")%>&id_token_hint=<%=idToken%>&session_state=<%=sessionState%>'>
                            Logout</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>

    <main role="main" class="main-content">
        <div id="main-content">
            <section class="jumbotron text-center">
                <div class="container">
                    <div class="jumbotron-heading">Photo View</div>
                    <p class="lead text-muted">View photos shared with you</p>
                </div>
            </section>

            <div class="container">
                 <div class="col-md-6 mb-5 mt-5 d-block mx-auto">

                  <button type="button"
                         class="btn btn-outline-primary btn-create content-btn mt-4 d-block mx-auto"
                         onclick="loadImages()">View Album
                  </button>
                </div>

                <div class="text-center" id="image-holder">
                </div>
            </div>
    </main>
    <footer class="text-muted footer text-center">
        <span>Copyright &copy;  <a href="http://wso2.com/" target="_blank">
            <img src="img/wso2-dark.svg" class="wso2-logo" alt="wso2-logo"></a> &nbsp;<span class="year"></span>
        </span>
    </footer>

</div>

<!-- JQuery -->
<script src="libs/jquery_3.3.1/jquery.min.js"></script>
<!-- Popper -->
<script src="libs/popper_1.12.9/popper.min.js"></script>
<!-- Bootstrap Material Design JavaScript -->
<script src="libs/bootstrap-material-design_4.0.0/js/bootstrap-material-design.min.js"></script>
<!-- Moment -->
<script src="libs/moment_2.11.2/moment.min.js"></script>
<!-- Golden Layout -->
<script src="libs/goldenlayout/js/goldenlayout.min.js"></script>
<!-- Highlight -->
<script src="libs/highlight_9.12.0/highlight.pack.js"></script>
<!-- Clipboard -->
<script src="libs/clipboard/clipboard.min.js"></script>
<!-- Custom Js -->
<script src="js/custom.js"></script>
<!-- SweetAlerts -->
<script src="libs/sweetalerts/sweetalert.2.1.2.min.js"></script>
<script>hljs.initHighlightingOnLoad();</script>

</body>
</html>
