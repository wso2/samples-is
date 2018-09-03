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
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.sample.identity.oauth2.OAuth2Constants" %>
<%@ page import="org.apache.oltu.oauth2.client.request.OAuthClientRequest" %>
<%@ page import="org.apache.oltu.oauth2.client.OAuthClient" %>
<%@ page import="org.apache.oltu.oauth2.client.URLConnectionClient" %>
<%@ page import="org.apache.oltu.oauth2.common.message.types.GrantType" %>
<%@ page import="org.apache.oltu.oauth2.client.response.OAuthClientResponse" %>
<%@ page import="com.nimbusds.jwt.SignedJWT" %>
<%@ page import="java.util.Properties" %>
<%@ page import="org.wso2.sample.identity.oauth2.SampleContextEventListener" %>
<%@ page import="com.nimbusds.jwt.ReadOnlyJWTClaimsSet" %>

<%
    String code = null;
    String idToken = null;
    String sessionState = null;
    String error;
    String name = null;
    Properties properties;
    properties = SampleContextEventListener.getProperties();
    ReadOnlyJWTClaimsSet claimsSet = null;

    try {
        sessionState = request.getParameter(OAuth2Constants.SESSION_STATE);
        if (StringUtils.isNotBlank(sessionState)) {
            session.setAttribute(OAuth2Constants.SESSION_STATE, sessionState);
        }
        session.setAttribute(OAuth2Constants.CONSUMER_KEY, properties.getProperty("consumerKey"));
        session.setAttribute(OAuth2Constants.OIDC_SESSION_IFRAME_ENDPOINT, properties.getProperty("sessionIFrameEndpoint"));
        session.setAttribute(OAuth2Constants.OAUTH2_AUTHZ_ENDPOINT, properties.getProperty("authzEndpoint"));
        session.setAttribute(OAuth2Constants.OAUTH2_GRANT_TYPE, properties.getProperty("authzGrantType"));
        session.setAttribute(OAuth2Constants.CALL_BACK_URL, properties.getProperty("callBackUrl"));
        session.setAttribute(OAuth2Constants.SCOPE, properties.getProperty("scope"));

        error = request.getParameter(OAuth2Constants.ERROR);
        if (StringUtils.isNotBlank(error)) { // User has been logged out
            session.invalidate();
            response.sendRedirect("index.jsp");
            return;
        }
        if (request.getParameter(OAuth2Constants.CODE) != null) {
            code = request.getParameter(OAuth2Constants.CODE);
        }

        if (code != null) {
            OAuthClientRequest.TokenRequestBuilder oAuthTokenRequestBuilder =
                    new OAuthClientRequest.TokenRequestBuilder(properties.getProperty("tokenEndpoint"));

            OAuthClientRequest accessRequest = oAuthTokenRequestBuilder.setGrantType(GrantType.AUTHORIZATION_CODE)
                    .setClientId(properties.getProperty("consumerKey"))
                    .setClientSecret(properties.getProperty("consumerSecret"))
                    .setRedirectURI(properties.getProperty("callBackUrl"))
                    .setCode(code)
                    .buildBodyMessage();

            //create OAuth client that uses custom http client under the hood
            OAuthClient oAuthClient = new OAuthClient(new URLConnectionClient());

            OAuthClientResponse oAuthResponse = oAuthClient.accessToken(accessRequest);

            idToken = oAuthResponse.getParam("id_token");
            if (idToken == null) {
                idToken = request.getParameter("id_token_hint");
            }
            if (idToken != null) {
                try {
                    name = SignedJWT.parse(idToken).getJWTClaimsSet().getSubject();
                    claimsSet= SignedJWT.parse(idToken).getJWTClaimsSet();
                    session.setAttribute(OAuth2Constants.NAME, name);
                } catch (Exception e) {
                    System.console().printf("Error in retrieving values from JWT");
                }
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

<body class="app-home">

<nav class="navbar navbar-expand-lg navbar-dark app-navbar justify-content-between">
    <a class="navbar-brand" href="home.jsp"><i class="fas fa-taxi"></i> PICKUP MANAGER</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav flex-row ml-md-auto ">
            <li class="nav-item dropdown ">
                <a class="nav-link dropdown-toggle user-dropdown" href="#" id="navbarDropdownMenuLink"
                   data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-user-circle"></i> <span><%=(String)session.getAttribute(OAuth2Constants.NAME)%></span></span>
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" href="profile.jsp?id_token=<%=idToken%>&session_state=<%=sessionState%>">Profile</a>
                    <a class="dropdown-item" href='<%=properties.getProperty("OIDC_LOGOUT_ENDPOINT")%>?post_logout_redirect_uri=<%=properties.getProperty("post_logout_redirect_uri")%>&id_token_hint=<%=idToken%>&session_state=<%=sessionState%>'>
                        Logout</a>
                </div>
            </li>
        </ul>
    </div>
</nav>

<main role="main" class="main-content">
    <section class="jumbotron text-center">
        <div class="container">
            <div class="jumbotron-heading">PICKUP MANAGER</div>
            <p class="lead text-muted">Management Application</p>
        </div>
    </section>
    <div class="container">
        <section id="tabs">
            <div class="row">
                <div class="col-md-12">
                    <nav>
                        <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                            <a class="nav-item nav-link active" id="nav-overview-tab" data-toggle="tab"
                               href="#nav-overview" role="tab" aria-controls="nav-overview" aria-selected="true">Overview</a>
                            <a class="nav-item nav-link" id="nav-drivers-tab" data-toggle="tab" href="#nav-drivers"
                               role="tab" aria-controls="nav-drivers" aria-selected="false">Drivers</a>
                            <a class="nav-item nav-link" id="nav-vehicles-tab" data-toggle="tab" href="#nav-vehicles"
                               role="tab" aria-controls="nav-vehicles" aria-selected="false">Vehicles</a>
                            <a class="nav-item nav-link" id="nav-passengers-tab" data-toggle="tab"
                               href="#nav-passengers"
                               role="tab" aria-controls="nav-passengers" aria-selected="false">Passengers</a>
                        </div>
                    </nav>
                    <div class="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
                        <div class="tab-pane fade show active" id="nav-overview" role="tabpanel"
                             aria-labelledby="nav-overview-tab">
                            <div class="row">
                                <div class="col-md-4 mb-5 mt-5 text-center">
                                    <i class="fas fa-users fa-3x green-text"></i>
                                    <h4 class="my-4 tab-title">Drivers</h4>
                                    <h4 class="grey-text">30</h4>
                                </div>
                                <div class="col-md-4 mb-1 mt-5 text-center">
                                    <i class="fa fa-car fa-3x green-text"></i>
                                    <h4 class="my-4 tab-title">Vehicles</h4>
                                    <h4 class="grey-text">40</h4>
                                </div>
                                <div class="col-md-4 mb-1 mt-5 text-center">
                                    <i class="fa fa-users fa-3x green-text"></i>
                                    <h4 class="my-4 tab-title">Passengers</h4>
                                    <h4 class="grey-text">250</h4>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="nav-drivers" role="tabpanel" aria-labelledby="nav-drivers-tab">
                            <div class="table-responsive content-table">
                                <table class="table">
                                    <thead>
                                    <tr>
                                        <th>Driver ID</th>
                                        <th>Name</th>
                                        <th>Age</th>
                                        <th>Registration date</th>
                                        <th>Salary</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>D0072</td>
                                        <td>Tiger Nixon</td>
                                        <td>40</td>
                                        <td class="date-time"></td>
                                        <td>$120,800</td>
                                        <td><a href="#" data-toggle="modal" data-target="#sampleModal"><i
                                                class="fas fa-trash-alt"></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>D0053</td>
                                        <td>Joshua Winters</td>
                                        <td>33</td>
                                        <td class="date-time"></td>
                                        <td>$110,750</td>
                                        <td><a href="#" data-toggle="modal" data-target="#sampleModal"><i
                                                class="fas fa-trash-alt"></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>D0046</td>
                                        <td>Lucas Thiyago</td>
                                        <td>23</td>
                                        <td class="date-time"></td>
                                        <td>$106,000</td>
                                        <td><a href="#" data-toggle="modal" data-target="#sampleModal"><i
                                                class="fas fa-trash-alt"></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>D0027</td>
                                        <td>Woo Jin</td>
                                        <td>22</td>
                                        <td class="date-time"></td>
                                        <td>$113,060</td>
                                        <td><a href="#" data-toggle="modal" data-target="#sampleModal"><i
                                                class="fas fa-trash-alt"></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>D0013</td>
                                        <td>Airi Satou</td>
                                        <td>43</td>
                                        <td class="date-time"></td>
                                        <td>$112,700</td>
                                        <td><a href="#" data-toggle="modal" data-target="#sampleModal"><i
                                                class="fas fa-trash-alt"></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>D0009</td>
                                        <td>Brielle Williamson</td>
                                        <td>34</td>
                                        <td class="date-time"></td>
                                        <td>$107,000</td>
                                        <td><a href="#" data-toggle="modal" data-target="#sampleModal"><i
                                                class="fas fa-trash-alt"></i></a></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button type="button" class="btn btn-outline-primary content-btn d-block mx-auto"
                                    data-toggle="modal" data-target="#sampleModal">Add
                            </button>
                        </div>
                        <div class="tab-pane fade" id="nav-vehicles" role="tabpanel" aria-labelledby="nav-contact-tab">
                            <div class="table-responsive content-table">
                                <table class="table">
                                    <thead>
                                    <tr>
                                        <th>Vehicle No</th>
                                        <th>Owner</th>
                                        <th>Vehicle Type</th>
                                        <th>Registration date</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>CAS 234</td>
                                        <td>Tiger Nixon</td>
                                        <td>Car</td>
                                        <td class="date-time"></td>
                                        <td><a href="#" data-toggle="modal" data-target="#sampleModal"><i
                                                class="fas fa-trash-alt"></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>KNW 456</td>
                                        <td>Lucas Thiyago</td>
                                        <td>Van</td>
                                        <td class="date-time"></td>
                                        <td><a href="#" data-toggle="modal" data-target="#sampleModal"><i
                                                class="fas fa-trash-alt"></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>JDQ 887</td>
                                        <td>Joshua Winters</td>
                                        <td>Car</td>
                                        <td class="date-time"></td>
                                        <td><a href="#" data-toggle="modal" data-target="#sampleModal"><i
                                                class="fas fa-trash-alt"></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>HGY 423</td>
                                        <td>Woo Jin</td>
                                        <td>Car</td>
                                        <td class="date-time"></td>
                                        <td><a href="#" data-toggle="modal" data-target="#sampleModal"><i
                                                class="fas fa-trash-alt"></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>DBL 090</td>
                                        <td>Airi Satou</td>
                                        <td>Car</td>
                                        <td class="date-time"></td>
                                        <td><a href="#" data-toggle="modal" data-target="#sampleModal"><i
                                                class="fas fa-trash-alt"></i></a></td>
                                    </tr>
                                    <tr>
                                        <td>SAH 5555</td>
                                        <td>Brielle Williamson</td>
                                        <td>Van</td>
                                        <td class="date-time"></td>
                                        <td><a href="#" data-toggle="modal" data-target="#sampleModal"><i
                                                class="fas fa-trash-alt"></i></a></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button type="button" class="btn btn-outline-primary content-btn d-block mx-auto"
                                    data-toggle="modal" data-target="#sampleModal">Add
                            </button>
                        </div>
                        <div class="tab-pane fade" id="nav-passengers" role="tabpanel"
                             aria-labelledby="nav-passengers-tab">
                            <div class="table-responsive content-table">
                                <table class="table">
                                    <thead>
                                    <tr>
                                        <th>Passenger ID</th>
                                        <th>Name</th>
                                        <th>Registration Date</th>
                                        <th>No of Trips</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>P0064</td>
                                        <td>James Easton</td>
                                        <td class="date-time"></td>
                                        <td>03</td>
                                    </tr>
                                    <tr>
                                        <td>P0052</td>
                                        <td>Ryan Martin</td>
                                        <td class="date-time"></td>
                                        <td>10</td>
                                    </tr>
                                    <tr>
                                        <td>P0048</td>
                                        <td>Zofia Cox</td>
                                        <td class="date-time"></td>
                                        <td>08</td>
                                    </tr>
                                    <tr>
                                        <td>P0037</td>
                                        <td>Kelly Carter</td>
                                        <td class="date-time"></td>
                                        <td>03</td>
                                    </tr>
                                    <tr>
                                        <td>P0022</td>
                                        <td>Xing Wu</td>
                                        <td class="date-time"></td>
                                        <td>15</td>
                                    </tr>
                                    <tr>
                                        <td>P0015</td>
                                        <td>Mariana Davis</td>
                                        <td class="date-time"></td>
                                        <td>21</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <button type="button" class="btn btn-outline-primary content-btn d-block mx-auto"
                                    data-toggle="modal" data-target="#sampleModal">Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</main>
<footer class="text-muted footer text-center">
    <span>Copyright &copy;  <a href="http://wso2.com/" target="_blank">
        <img src="img/wso2-dark.svg" class="wso2-logo" alt="wso2-logo"></a> &nbsp;<span class="year"></span>
    </span>
</footer>

<!-- sample application actions message -->
<div class="modal fade" id="sampleModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="myModalLabel">You cannot perform this action</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p>Sample application functionalities are added for display purposes only.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>


<!-- JQuery -->
<script src="libs/jquery_3.3.1/jquery.min.js"></script>
<!-- Popper -->
<script src="libs/popper_1.12.9/popper.min.js"></script>
<!-- Bootstrap Material Design JavaScript -->
<script src="libs/bootstrap-material-design_4.0.0/js/bootstrap-material-design.min.js"></script>
<!-- Moment -->
<script src="libs/moment_2.11.2/moment.min.js"></script>
<!-- Custom Js -->
<script src="js/custom.js"></script>
<iframe id="rpIFrame" src="rpIFrame.jsp" frameborder="0" width="0" height="0"></iframe>

</body>
</html>
<%
    } catch (Exception e) {
        error = e.getMessage();
        System.console().printf(error);
    }

%>