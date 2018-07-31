<!--
~ Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
~
~ WSO2 Inc. licenses this file to you under the Apache License,
~ Version 2.0 (the "License"); you may not use this file except
~ in compliance with the License.
~ You may obtain a copy of the License at
~
~    http://www.apache.org/licenses/LICENSE-2.0
~
~ Unless required by applicable law or agreed to in writing,
~ software distributed under the License is distributed on an
~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
~ KIND, either express or implied.  See the License for the
~ specific language governing permissions and limitations
~ under the License.
-->
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Dispatch</title>

    <!-- Bootstrap Core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="css/stylish-portfolio.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700,300italic,400italic,700italic" rel="stylesheet" type="text/css">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<%
    if (request.getSession(false) != null) {
        request.getSession(false).invalidate();
    }
%>

<body>

    <section id="login">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <div class="form-wrap">
                        <img src="img/logo.png" class="center-block" height="60"/>
                        <!--<h1 class="pickup-primary-color">Log in with your email account</h1>-->
                        </br>
                        <form role="form" action="samlsso"
                              method="post" id="login-form" autocomplete="off">
                            <!--<div class="form-group">-->
                                <!--<label for="email" class="sr-only">Email</label>-->
                                <!--<input type="email" name="email" id="email" class="form-control" placeholder="johndoe@example.com">-->
                            <!--</div>-->
                            <!--<div class="form-group">-->
                                <!--<label for="key" class="sr-only">Password</label>-->
                                <!--<input type="password" name="key" id="key" class="form-control" placeholder="Password">-->
                            <!--</div>-->
                            <input type="submit" id="btn-login" class="btn btn-custom btn-lg btn-block pickup-primary-bg" value="Log in">
                        </form>
                        <!--<a href="javascript:;" class="forget" data-toggle="modal" data-target=".forget-modal">Forgot your password?</a>-->
                        <hr>
                    </div>
                </div> <!-- /.col-xs-12 -->
            </div> <!-- /.row -->
        </div> <!-- /.container -->
    </section>

    <footer id="footer">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <a href="http://wso2.com/" target="_blank" ><img src="img/wso2logo.svg" height="20" /></a>
                    <p>Copyright &copy; <a href="http://wso2.com/" target="_blank">WSO2</a> 2018</p>
                </div>
            </div>
        </div>
    </footer>

    <!-- jQuery -->
    <script src="js/jquery.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="js/bootstrap.min.js"></script>
    <script>

    </script>

</body>

</html>