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
<%@ page import="org.wso2.carbon.identity.sso.agent.bean.LoggedInSessionBean" %>
<%@ page import="org.wso2.carbon.identity.sso.agent.util.SSOAgentConstants" %>
<%@ page import="java.util.Map" %>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="PICKUP DISPATCH - Login">

    <title>Dispatch</title>

    <!-- Bootstrap Material Design CSS -->
    <link href="libs/bootstrap-material-design_4.0.0/css/bootstrap-material-design.min.css" rel="stylesheet">
    <!-- Font Awesome icons -->
    <link href="libs/fontawesome-5.2.0/css/solid.min.css" rel="stylesheet">
    <link href="libs/fontawesome-5.2.0/css/fontawesome.min.css" rel="stylesheet">
    <!-- Custom styles -->
    <link href="css/custom.css" rel="stylesheet">
    <link href="css/dispatch.css" rel="stylesheet">
</head>
<%
    String subjectId = null;
    Map<String, String> saml2SSOAttributes = null;

    final String SAML_SSO_URL = "samlsso";
    final String SAML_LOGOUT_URL = "logout";
    // if web-browser session is there but no session bean set,
    // invalidate session and direct back to login page
    if (request.getSession(false) != null
            && request.getSession(false).getAttribute(SSOAgentConstants.SESSION_BEAN_NAME) == null) {
        request.getSession().invalidate();
%>
    <script type="text/javascript">
        location.href =<%=SAML_SSO_URL%>;
    </script>
<%
        return;
    }
    LoggedInSessionBean sessionBean = (LoggedInSessionBean) session
            .getAttribute(SSOAgentConstants.SESSION_BEAN_NAME);

    if(sessionBean != null && sessionBean.getSAML2SSO() != null) {
        subjectId = sessionBean.getSAML2SSO().getSubjectId();
        saml2SSOAttributes = sessionBean.getSAML2SSO().getSubjectAttributes();

    } else {
%>
    <script type="text/javascript">
        location.href = <%=SAML_SSO_URL%>;
    </script>
<%
        return;
    }

%>


<body class="app-home dispatch profile">

<nav class="navbar navbar-expand-lg navbar-dark app-navbar justify-content-between">
    <a class="navbar-brand" href="profile.jsp"><i class="fas fa-taxi"></i> PICKUP DISPATCH</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav flex-row ml-md-auto ">
            <li class="nav-item dropdown ">
                <a class="nav-link dropdown-toggle user-dropdown" href="#" id="navbarDropdownMenuLink"
                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-user-circle"></i> <span><%=subjectId%></span>
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" href="home.jsp">Home</a>
                    <a class="dropdown-item" href=<%=SAML_LOGOUT_URL%>>Logout</a>
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
            <div class="jumbotron-heading"><%=subjectId%></div>
        </div>
    </section>
    <div class="container">
        <div class="row">
            <div class="col-md-6 d-block mx-auto">
                <div class="card card-body table-container">
                    <div class="table-responsive content-table">
                        <table class="table">
                            <%
                                if (saml2SSOAttributes != null && !saml2SSOAttributes.isEmpty()) {
                            %>
                            <thead>
                            <tr>
                                <th rowspan="2">User Details</th>
                            </tr>
                            </thead>

                            <tbody>

                            <%
                                for (Map.Entry<String, String> entry:saml2SSOAttributes.entrySet()) {
                            %>
                            <tr>
                                <td><%=entry.getKey()%></td>
                                <td><%=entry.getValue()%></td>
                            </tr>

                            <%
                                    }
                                } else {
                            %>
                            <tr>
                                <p align="center"> Please configure claim mapping in SP configurations.</p>
                            </tr>
                            <%
                                    }
                            %>
                            </tbody>
                        </table>

                    </div>
                </div>
                <!--</div>-->
            </div>
        </div>
        </section>
    </div>
</main><!-- /.container -->
<footer class="text-muted footer text-center">
    <span>Copyright  &copy; <a href="http://wso2.com/" target="_blank">
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
