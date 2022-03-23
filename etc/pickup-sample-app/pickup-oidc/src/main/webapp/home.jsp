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
<%@ page import="com.nimbusds.jwt.JWTClaimsSet" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>
<%
    String code = null;
    String idToken;
    String sessionState;
    String error;
    String name = null;
    Properties properties;
    properties = SampleContextEventListener.getProperties();
    JWTClaimsSet claimsSet = null;

    try {
        sessionState = request.getParameter(OAuth2Constants.SESSION_STATE);
        if (StringUtils.isNotBlank(sessionState)) {
            session.setAttribute(OAuth2Constants.SESSION_STATE, sessionState);
        }

        error = request.getParameter(OAuth2Constants.ERROR);
        if (StringUtils.isNotBlank(request.getHeader(OAuth2Constants.REFERER)) &&
                request.getHeader(OAuth2Constants.REFERER).contains("rpIFrame")) {
            /*
             * Here referer is being checked to identify that this is exactly is an response to the passive request
             * initiated by the session checking iframe.
             * In this sample, every error is forwarded back to this page. Thus, this condition is added to treat
             * error response coming for the passive request separately, and to identify that as a logout scenario.
             */
            if (StringUtils.isNotBlank(error)) { // User has been logged out
                session.invalidate();
                response.sendRedirect("index.jsp");
                return;
            }
        }

        if (request.getParameter(OAuth2Constants.CODE) != null) {
            code = request.getParameter(OAuth2Constants.CODE);
        }

        if (code != null) {
            OAuthClientRequest.TokenRequestBuilder oAuthTokenRequestBuilder = new
                    OAuthClientRequest.TokenRequestBuilder(properties.getProperty("tokenEndpoint"));

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
            if (idToken != null) {
                try {
                    name = SignedJWT.parse(idToken).getJWTClaimsSet().getSubject();
                    claimsSet= SignedJWT.parse(idToken).getJWTClaimsSet();
                    session.setAttribute("name", name);
                } catch (Exception e) {
                    System.console().printf("Values are not populated in JWT properly");
                }
            }
        }

    } catch (Exception e) {
        error = e.getMessage();
    }
%>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="PickUp Application">

    <title>PickUp</title>

    <!-- Bootstrap Material Design CSS -->
    <link rel="stylesheet" type="text/css" href="libs/bootstrap-material-design_4.0.0/css/bootstrap-material-design.min.css">
    <!-- Font Awesome icons -->
    <link rel="stylesheet" type="text/css" href="libs/fontawesome-5.2.0/css/solid.min.css">
    <link rel="stylesheet" type="text/css" href="libs/fontawesome-5.2.0/css/fontawesome.min.css">
    <!-- Golden Layout styles -->
    <link rel="stylesheet" type="text/css" href="libs/goldenlayout/css/goldenlayout-base.css">
    <!-- Highlight styles -->
    <link rel="stylesheet" type="text/css" href="libs/highlight_9.12.0/styles/atelier-cave-light.css">

    <!-- Custom styles -->
    <link rel="stylesheet" type="text/css" href="css/spinner.css">
    <link rel="stylesheet" type="text/css" href="css/custom.css">
    <link rel="stylesheet" type="text/css" href="css/pickup.css">
</head>

<body class="app-home pickup">
<div id="wrapper" class="wrapper"></div>
<div id="actionContainer">
    <nav class="navbar navbar-expand-lg navbar-dark app-navbar justify-content-between">
        <a class="navbar-brand" id="back-home" href="#"><i class="fas fa-taxi"></i> PICKUP </a>
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
                        <a class="dropdown-item" href="#" id="profile">Profile</a>
                        <a class="dropdown-item" href='<%=properties.getProperty("OIDC_LOGOUT_ENDPOINT")%>'>Logout</a>
                    </div>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="toggleView" href="#" data-toggle="tooltip" data-placement="bottom"
                       title="Console">
                        <i class="fa fa-cogs"></i>
                    </a>
                </li>
            </ul>
        </div>
    </nav>

    <main role="main" class="main-content" >
        <div id="main-content">
            <div class="container">
                <section id="tabs" class="mt-5">
                    <div class="row">
                        <div class="col-md-12 tabs">
                            <nav>
                                <div class="col-md-4 d-block mx-auto">
                                    <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                        <a class="nav-item nav-link active" id="nav-book-tab" data-toggle="tab"
                                           href="#nav-book" role="tab" aria-controls="nav-book" aria-selected="true"><i
                                                class="fas fa-edit"></i> &nbsp;Book</a>
                                        <a class="nav-item nav-link" id="nav-rides-tab" data-toggle="tab"
                                           href="#nav-rides"
                                           role="tab" aria-controls="nav-rides" aria-selected="false"><i
                                                class="fas fa-list"></i> &nbsp;Rides</a>
                                    </div>
                                </div>
                            </nav>
                            <div class="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
                                <div class="tab-pane fade show active" id="nav-book" role="tabpanel"
                                     aria-labelledby="nav-book-tab">
                                    <div class="row">
                                        <div class="col-sm-9 col-md-4 col-lg-4 mx-auto">
                                            <div>
                                                <img src="img/pickup-book.png" class="taxi-book mt-3">
                                            </div>
                                            <a class="btn btn-primary mt-3 pickup-btn book-btn text-center" href="#">
                                                Book a Taxi
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="nav-rides" role="tabpanel"
                                     aria-labelledby="nav-rides-tab">
                                    <div class="col-md-12 col-lg-8 mx-auto">
                                        <div class="ride-content">
                                            <div class="no-rides-msg text-secondary text-center mt-4 mb-2">
                                                <i class="fas fa-info-circle"></i> Could not find any registered
                                                rides.
                                            </div>
                                            <div class="rides">
                                                <div class="row mb-3">
                                                    <div class="col-md-3 text-md-right mt-1 mt-md-3">
                                                        <img src="img/driver.png" class="driver mt-3">
                                                    </div>
                                                    <div class="col-md-3 mt-1 mt-md-5 text-md-left">
                                                        <div class="driver-name">Tiger Nixon</div>
                                                        <div class="driver-vehicle text-secondary">CAS 234</div>
                                                    </div>
                                                    <div class="col-md-6 mt-md-5 ">
                                                        <button type="button" class="btn btn-outline-primary share">
                                                            Share my ride
                                                        </button>
                                                        <button type="button" class="btn btn-outline-secondary cancel">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-12 d-block mx-auto text-center">
                                                        <div class="action-response" class="mt-2">
                                                            <i class="fas fa-2x fa-check"></i> <span class="action-text">
                                                             You have successfully shared your ride.</span>
                                                        </div>
                                                        <div class="loading-icon fa-3x text-center"><i
                                                                class="fas fa-spinner fa-spin"></i></div>
                                                    </div>
                                                </div>
                                                <hr/>
                                            </div>
                                            <div class="past-rides">
                                                <div class="row">
                                                    <div class="col-md-12">
                                                        <div class="pickup-heading pickup-heading pt-4 pb-3">PAST
                                                            RIDES
                                                        </div>
                                                        <div class="table-responsive">
                                                            <table class="table past-rides-table">
                                                                <tbody>
                                                                <tr>
                                                                    <td class="date-time"></td>
                                                                    <td>Joshua Winters</td>
                                                                    <td>JDQ 887</td>
                                                                    <td>Car</td>
                                                                    <td><a href="#" data-toggle="modal"
                                                                           data-target="#sampleModal"
                                                                           class="pickup-route"><i
                                                                            class="fas fa-route"></i> ROUTE</a></td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="date-time"></td>
                                                                    <td>Lucas Thiyago</td>
                                                                    <td>KNW 456</td>
                                                                    <td>Van</td>
                                                                    <td><a href="#" data-toggle="modal"
                                                                           data-target="#sampleModal"
                                                                           class="pickup-route"><i
                                                                            class="fas fa-route"></i> ROUTE</a></td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="date-time"></td>
                                                                    <td>Woo Jin</td>
                                                                    <td>HGY 423</td>
                                                                    <td>Car</td>
                                                                    <td><a href="#" data-toggle="modal"
                                                                           data-target="#sampleModal"
                                                                           class="pickup-route"><i
                                                                            class="fas fa-route"></i> ROUTE</a></td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

        <div id="profile-content" style="display: none">
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
                                        hashmap = claimsSet.getClaims();
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

            </div>
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
</div>

<div id="viewContainer">
    <section class="actions">
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-12 console-headers">
                    <span id="console-close" class="float-right console-action">
                        <span data-toggle="tooltip" data-placement="bottom" title="Close"><i
                                class="fas fa-times"></i></span>
                    </span>
                    <span id="toggleLayout" class="float-right console-action">
                        <span data-toggle="tooltip" data-placement="bottom" title="Dock to bottom"><i
                                class="fas fa-window-maximize"></i></span>
                    </span>
                    <span id="clearAll" class="float-right console-action">
                        <span data-toggle="tooltip" data-placement="bottom" title="Clear All"><i class="fas fa-ban"></i></span>
                    </span>
                </div>
                <div class="col-md-12">
                    <div id="timeline-content">
                        <ul class="timeline">
                            <li class="event sent event1-sent" style="display: none;">
                                <div class="request-response-infos">
                                    <h1 class='request-response-title'>Get Token Request <span class="float-right"><i
                                            class="fas fa-angle-down"></i></span></h1>
                                    <div class="request-response-details mt-3">
                                        <h2>cURL:</h2>
                                        <div class="code-container mb-3">
                                            <button class="btn btn-primary btn-clipboard"
                                                    data-clipboard-target=".copy-target1"><i
                                                    class="fa fa-clipboard"></i></button>
                                            <p class="copied">Copied..!</p>
                                            <pre><code class="copy-target1 JSON pt-3 pb-3"> Request data </code></pre>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li class="event sending event1-sending" style="display: none;">
                                <div class="request-response-infos">
                                    <h1 class='request-response-title'>Sending...
                                        <div class="spinner">
                                            <div class="bounce1"></div>
                                            <div class="bounce2"></div>
                                            <div class="bounce3"></div>
                                        </div>
                                    </h1>
                                </div>
                            </li>
                            <li class="event received event1-received" style="display: none;">
                                <div class="request-response-infos">
                                    <h1 class='request-response-title'>Get Token Response <span class="float-right"><i
                                            class="fa fa-angle-down"></i></span></h1>
                                    <div class="request-response-details mt-3">
                                        <h2>Data:</h2>
                                        <div class="code-container mb-3">
                                            <button class="btn btn-primary btn-clipboard"
                                                    data-clipboard-target=".copy-target3"><i
                                                    class="fa fa-clipboard"></i></button>
                                            <p class="copied">Copied..!</p>
                                            <pre><code class="copy-target3 JSON pt-3 pb-3"> Response data </code></pre>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li class="event sent event3-sent" style="display: none;">
                                <div class="request-response-infos">
                                    <h1 class='request-response-title'>API Request <span class="float-right"><i
                                            class="fas fa-angle-down"></i></span></h1>
                                    <div class="request-response-details mt-3">
                                        <h2>Data:</h2>
                                        <div class="code-container mb-3">
                                            <button class="btn btn-primary btn-clipboard"
                                                    data-clipboard-target=".copy-target1"><i
                                                    class="fa fa-clipboard"></i></button>
                                            <p class="copied">Copied..!</p>
                                            <pre><code class="copy-target1 JSON pt-3 pb-3"> Request data </code></pre>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li class="event sending event3-sending" style="display: none;">
                                <div class="request-response-infos">
                                    <h1 class='request-response-title'>Sending...
                                        <div class="spinner">
                                            <div class="bounce1"></div>
                                            <div class="bounce2"></div>
                                            <div class="bounce3"></div>
                                        </div>
                                    </h1>
                                </div>
                            </li>

                            <li class="event sent event2-sent" style="display: none;">
                                <div class="request-response-infos">
                                    <h1 class='request-response-title'>Validate Token Request <span class="float-right"><i
                                            class="fas fa-angle-down"></i></span></h1>
                                    <div class="request-response-details mt-3">
                                        <h2>cURL:</h2>
                                        <div class="code-container mb-3">
                                            <button class="btn btn-primary btn-clipboard"
                                                    data-clipboard-target=".copy-target1"><i
                                                    class="fa fa-clipboard"></i></button>
                                            <p class="copied">Copied..!</p>
                                            <pre><code class="copy-target1 JSON pt-3 pb-3"> Request data </code></pre>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li class="event sending event2-sending" style="display: none;">
                                <div class="request-response-infos">
                                    <h1 class='request-response-title'>Sending...
                                        <div class="spinner">
                                            <div class="bounce1"></div>
                                            <div class="bounce2"></div>
                                            <div class="bounce3"></div>
                                        </div>
                                    </h1>
                                </div>
                            </li>
                            <li class="event received event2-received" style="display: none;">
                                <div class="request-response-infos">
                                    <h1 class='request-response-title'>Validate Token Response <span class="float-right"><i
                                            class="fa fa-angle-down"></i></span></h1>
                                    <div class="request-response-details mt-3">
                                        <h2>Data:</h2>
                                        <div class="code-container mb-3">
                                            <button class="btn btn-primary btn-clipboard"
                                                    data-clipboard-target=".copy-target3"><i
                                                    class="fa fa-clipboard"></i></button>
                                            <p class="copied">Copied..!</p>
                                            <pre><code class="copy-target3 JSON pt-3 pb-3"> Response data </code></pre>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li class="event received event3-received" style="display: none;">
                                <div class="request-response-infos">
                                    <h1 class='request-response-title'>API Response <span class="float-right"><i
                                            class="fa fa-angle-down"></i></span></h1>
                                    <div class="request-response-details mt-3">
                                        <h2>Data:</h2>
                                        <div class="code-container mb-3">
                                            <button class="btn btn-primary btn-clipboard"
                                                    data-clipboard-target=".copy-target3"><i
                                                    class="fa fa-clipboard"></i></button>
                                            <p class="copied">Copied..!</p>
                                            <pre><code class="copy-target3 JSON pt-3 pb-3"> Response data </code></pre>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
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
<script src="js/REST_calls.js"></script>
<script src="js/pickup.js"></script>
<iframe id="rpIFrame" src="rpIFrame.jsp" frameborder="0" width="0" height="0"></iframe>


</body>
</html>

