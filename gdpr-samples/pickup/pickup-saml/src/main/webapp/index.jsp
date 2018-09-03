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
    if (request.getSession(false) != null) {
        request.getSession(false).invalidate();
    }
%>

<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="PickUp - Login">

    <title>PickUp Login</title>

    <!-- Bootstrap Material Design CSS -->
    <link href="libs/bootstrap-material-design_4.0.0/css/bootstrap-material-design.min.css" rel="stylesheet">
    <!-- Font Awesome icons -->
    <link href="libs/fontawesome-5.2.0/css/solid.min.css" rel="stylesheet">
    <link href="libs/fontawesome-5.2.0/css/fontawesome.min.css" rel="stylesheet">
    <!-- Custom styles -->
    <link href="css/custom.css" rel="stylesheet">
    <link href="css/pickup.css" rel="stylesheet">
</head>

<body class="app-login auth">

<section class="login-block">
    <div class="container">
        <div class="row">
            <div class="col-sm-9 col-md-4 col-lg-4 mx-auto login-sec">
                <div class="app-icon d-block mx-auto">
                    <i class="fas fa-taxi fa-4x"></i>
                </div>
                <div class="app-name text-center">PICKUP</div>
                <form class="app-login-form" role="form" action="samlsso" method="post" id="login-form" autocomplete="off">
                    <input type="submit"  class="btn btn-primary btn-login pickup-btn" value="LOGIN"><br/>
                    <button type="button" class="btn btn-primary btn-login pickup-btn" onclick="registration()">Register Now</button>
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
<!-- Custom Js -->
<script src="js/custom.js"></script>
<script>
    function registration() {
        location.href = "https://localhost:9443/accountrecoveryendpoint/register.do?callback=http://localhost:8080/pickup/";
    }
</script>

</body>
</html>

