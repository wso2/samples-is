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

<%
    final HttpSession currentSession =  request.getSession(false);
    if (currentSession != null
            && currentSession.getAttribute("authenticated") != null
                &&  (boolean)currentSession.getAttribute("authenticated")) {
        // Logged in session. Direct to Home
        response.sendRedirect("home.jsp");
        return;
    }
%>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="PICKUP MANAGER - Login">

    <title>PickUp Manager Login</title>

    <!-- Bootstrap Material Design CSS -->
    <link href="libs/bootstrap-material-design_4.0.0/css/bootstrap-material-design.min.css" rel="stylesheet">
    <!-- Font Awesome icons -->
    <link href="libs/fontawesome-5.2.0/css/solid.min.css" rel="stylesheet">
    <link href="libs/fontawesome-5.2.0/css/fontawesome.min.css" rel="stylesheet">
    <!-- Custom styles -->
    <link href="css/custom.css" rel="stylesheet">
    <link href="css/manager.css" rel="stylesheet">
</head>

<body class="app-login">
<section class="login-block">
    <div class="container">
        <div class="row">
            <div class="col-sm-9 col-md-4 col-lg-4 mx-auto login-sec">
                <div class="app-icon d-block mx-auto">
                    <img src="img/manager.png" class="login-img"/>
                </div>
                <div class="app-name text-center">PICKUP MANAGER</div>
                <form class="app-login-form" role="form" action="oauth2-authorize-user.jsp?reset=true" method="post" id="login-form"
                      autocomplete="off">
                    <input type="submit" id="btn-login" class="btn btn-login" value="LOGIN"/>
                </form>
            </div>
        </div>
    </div>
    <div class="text-muted text-center login-footer">
        <span>Sample Application. </span>
        <span>Copyright &copy; <a href="http://wso2.com/" target="_blank">
            <img src="img/wso2-dark.svg" class="wso2-logo" alt="wso2-logo"></a> &nbsp;<span class="year"></span>
        </span>
    </div>
</section>

<!-- JQuery -->
<script src="libs/jquery_3.3.1/jquery.min.js"></script>
<!-- Popper -->
<script src="libs/popper_1.12.9/popper.min.js"></script>
<!-- Bootstrap Material Design JavaScript -->
<script src="libs/bootstrap-material-design_4.0.0/js/bootstrap-material-design.min.js"></script>


</body>
</html>
