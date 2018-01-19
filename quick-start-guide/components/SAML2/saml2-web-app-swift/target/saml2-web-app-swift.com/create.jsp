<!--
~ Copyright (c) WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
<%@ page import="org.wso2.carbon.identity.sso.agent.bean.LoggedInSessionBean" %>
<%@ page import="org.wso2.carbon.identity.sso.agent.util.SSOAgentConstants" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Stylish Portfolio - Start Bootstrap Theme</title>

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
    String subjectId = null;

    final String SAML_SSO_URL = "samlsso";
    final String SAML_LOGOUT_URL = "logout";

    // if web-browser session is there but no session bean set,
    // invalidate session and direct back to login page
    if (request.getSession(false) != null
            && request.getSession(false).getAttribute(SSOAgentConstants.SESSION_BEAN_NAME) == null) {
        request.getSession().invalidate();
%>
<script type="text/javascript">
    location.href = <%=SAML_SSO_URL%>;
</script>
<%
        return;
    }
    LoggedInSessionBean sessionBean = (LoggedInSessionBean) session.getAttribute(SSOAgentConstants.SESSION_BEAN_NAME);

    if (sessionBean != null && sessionBean.getSAML2SSO() != null) {
        subjectId = sessionBean.getSAML2SSO().getSubjectId();
    } else {
%>
<script type="text/javascript">
    location.href = <%=SAML_SSO_URL%>;
</script>
<%
        return;
    }
%>

<body>
    <nav id="top" class="navbar navbar-inverse navbar-custom">
        <div class="container-fluid">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#"><img src="img/logo.png" height="30" /> Dispatch</a>
            </div>
            <div class="collapse navbar-collapse" id="myNavbar">
                <ul class="nav navbar-nav navbar-right">
                    <!--<li><button class="btn btn-dark custom-primary btn-login"><strong>Login</strong></button></li>-->
                    <li class="dropdown user-name">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                            <img class="img-circle" height="30" width=30" src="img/Admin-icon.jpg"/>
                            <span class="user-name"><%=subjectId%>@pickup.com <i class="fa fa-chevron-down"></i></span>
                        </a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href=<%=SAML_LOGOUT_URL%>>Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- About -->
    <section id="about" class="about">
        <div class="container">
            <div class="row">
                <div class="col-lg-12 text-center">
                    <h2><strong>PickUp Dispatch</strong></h2>
                    <p class="lead">A vehicle allocation application used to allocate drivers to vehicles</p>
                </div>
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </section>

    <section id="allocations" class="services">
        <div class="container">
            <div class="row text-center">
                <div class="col-lg-10 col-lg-offset-1">
                    <h3>Allocations</h3>
                    <hr class="small">
                    <div class="row">
                        <div class="col-md-3 col-sm-6">
                        </div>
                        <div class="col-md-3 col-sm-6 tab-nav">
                            <a href="create.jsp" class=" allocations active" >
                                <div class="service-item">
                                    <span class="fa-stack fa-3x">
                                    <i class="fa fa-circle fa-stack-2x circle custom-primary-color"></i>
                                    <i class="fa fa-tasks fa-stack-1x text-link"></i>
                                </span>
                                    <span class="text-gray">
                                        <h4>
                                            <strong>Create</strong>
                                        </h4>
                                        </br>
                                    </span>
                                </div>
                            </a>

                        </div>
                        <div class="col-md-3 col-sm-6 tab-nav">
                            <a href="view.jsp" class="allocations">
                                <div class="service-item">
                                    <span class="fa-stack fa-3x">
                                    <i class="fa fa-circle fa-stack-2x circle"></i>
                                    <i class="fa fa-eye fa-stack-1x text-link"></i>
                                </span>
                                    <span class="text-gray">
                                        <h4>
                                            <strong>View</strong>
                                        </h4>
                                        <!--<h5>List Allocations</h5>-->
                                        </br>
                                    </span>
                                </div>
                            </a>
                        </div>
                        <div class="col-md-3 col-sm-6">
                        </div>
                    </div>
                    <!-- /.row (nested) -->
                </div>
                <!-- /.col-lg-10 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </section>

    <!-- Create Section-->
    <section class="create content">
        <div class="container">
            <div class="row">
                <div class="col-lg-10 col-lg-offset-1">
                    <h4 class="text-center">Create New Allocation</h4>
                    <div class="row">
                        <div class="col-lg-6 col-lg-offset-3">
                            <form>
                                <div class="form-group">
                                    <label>Driver</label>
                                    <select class="form-control" id="sel1">
                                        <option selected>Select a driver</option>
                                        <option >John</option>
                                        <option>David</option>
                                        <option>Jeffery</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Vehicle</label>
                                    <select class="form-control" id="sel1">
                                        <option selected>Select a vehicle</option>
                                        <option>Car</option>
                                        <option>Van</option>
                                        <option>Jeep</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Vehicle Number</label>
                                    <select class="form-control" id="sel1">
                                        <option selected>Select a vehicle number</option>
                                        <option>CA-1234</option>
                                        <option>KN-4567</option>
                                        <option>CJ-8910</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <div class="row">
                                    <div class="col-md-6">
                                        <label>Date</label>
                                        <input type="password" class="form-control" placeholder="Enter allocation date">
                                    </div>
                                    <div class="col-md-6">
                                        <label>Time</label>
                                        <input type="password" class="form-control" placeholder="Enter allocation time">
                                    </div>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Period</label>
                                    <input type="password" class="form-control" placeholder="Enter allocation period">
                                </div>
                                <button type="submit" class="btn btn-lg btn-dark custom-primary center-block">Create</button>
                            </form>

                        </div>
                    </div>
                </div>
                <!-- /.col-lg-10 -->
            </div>
            <!-- /.row -->
        </div>
        <!-- /.container -->
    </section>

    <!-- Footer -->
    <footer id="footer">
        <div class="container">
            <div class="row">
                <div class="col-lg-10 col-lg-offset-1 text-center">
                    <a href="http://wso2.com/" target="_blank" ><img src="img/wso2logo.svg" height="20" /></a>
                    <p class="text-muted">Copyright &copy; WSO2 2017</p>
                </div>
            </div>
        </div>
        <a id="to-top" href="#top" class="btn btn-dark btn-lg"><i class="fa fa-chevron-up fa-fw fa-1x"></i></a>
    </footer>

    <!-- jQuery -->
    <script src="js/jquery.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="js/bootstrap.min.js"></script>

</body>

</html>
