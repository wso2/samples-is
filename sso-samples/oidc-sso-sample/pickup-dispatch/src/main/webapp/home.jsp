<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<!--
~ Copyright (c) 2018 WSO2 Inc. (http://wso2.com) All Rights Reserved.
~
~ Licensed under the Apache License, Version 2.0 (the "License");
~ you may not use this file except in compliance with the License.
~ You may obtain a copy of the License at
~
~ http://www.apache.org/licenses/LICENSE-2.0
~
~ Unless required by applicable law or agreed to in writing, software
~ distributed under the License is distributed on an "AS IS" BASIS,
~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
~ See the License for the specific language governing permissions and
~ limitations under the License.
-->
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.logging.Level"%>
<%@page import="com.nimbusds.jwt.SignedJWT"%>
<%@page import="org.wso2.sample.identity.oauth2.OAuth2Constants"%>
<%@page import="org.json.JSONObject"%>
<%@page import="java.util.Properties"%>
<%@page import="org.wso2.sample.identity.oauth2.SampleContextEventListener"%>
<%@page import="org.wso2.sample.identity.oauth2.CommonUtils"%>
<%@page import="com.nimbusds.jwt.ReadOnlyJWTClaimsSet"%>
<%@page import="java.util.logging.Logger"%>
<%@page import="org.wso2.samples.claims.manager.ClaimManagerProxy"%>

<%
    final Logger logger = Logger.getLogger(getClass().getName());
    final HttpSession currentSession =  request.getSession(false);
    
    if (currentSession == null || currentSession.getAttribute("authenticated") == null) {
        // A direct access to home. Must redirect to index
        response.sendRedirect("index.jsp");
        return;
    }
    
    final Properties properties = SampleContextEventListener.getProperties();
    final String sessionState = (String) currentSession.getAttribute(OAuth2Constants.SESSION_STATE);
   
    final JSONObject requestObject = (JSONObject) currentSession.getAttribute("requestObject");
    final JSONObject responseObject = (JSONObject) currentSession.getAttribute("responseObject");
    
    final String idToken = (String) currentSession.getAttribute("idToken");
    
    String name = "";
    
    Map<String, Object> customClaimValueMap = new HashMap<>();
    Map<String, String> oidcClaimDisplayValueMap = new HashMap();
    
    if (idToken != null) {
        try {
            name = SignedJWT.parse(idToken).getJWTClaimsSet().getSubject();
            ReadOnlyJWTClaimsSet claimsSet = SignedJWT.parse(idToken).getJWTClaimsSet();
            
            ClaimManagerProxy claimManagerProxy = (ClaimManagerProxy) application.getAttribute("claimManagerProxyInstance");

            customClaimValueMap = claimsSet.getCustomClaims();
            
            oidcClaimDisplayValueMap =
                    claimManagerProxy.getOidcClaimDisplayNameMapping(new ArrayList<>(customClaimValueMap.keySet()));

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
    <meta name="description" content="PICKUP DISPATCH - Vehicle allocation application">

    <title>Pickup-Dispatch</title>

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
    <link href="css/dispatch.css" rel="stylesheet">
</head>

<body class="app-home dispatch">

<div id="wrapper" class="wrapper"></div>

<div id="actionContainer">
    <nav class="navbar navbar-expand-lg navbar-dark app-navbar justify-content-between">
        <a class="navbar-brand" href="home.jsp"><i class="fas fa-taxi"></i> PICKUP DISPATCH</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav flex-row ml-md-auto ">
                <li class="nav-item dropdown ">
                    <a class="nav-link dropdown-toggle user-dropdown" href="#" id="navbarDropdownMenuLink"
                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-user-circle"></i>
                        <span><%=name%></span>
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <a class="dropdown-item" href="#" id="profile">Profile</a>
                        <div class="dropdown-item">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="backendToggleCheckBox" onclick="toggleBackend()">
                                <label class="form-check-label" for="backendToggleCheckBox">Backend </label>
                            </div>
                        </div>
                        <a class="dropdown-item"
                           href='<%=properties.getProperty("OIDC_LOGOUT_ENDPOINT")%>?post_logout_redirect_uri=<%=properties.getProperty("post_logout_redirect_uri")%>&id_token_hint=<%=idToken%>&session_state=<%=sessionState%>'>
                            Logout</a>
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

    <main role="main" class="main-content">
        <div id="main-content">
            <section class="jumbotron text-center">
                <div class="container">
                    <div class="jumbotron-heading">PICKUP DISPATCH</div>
                    <p class="lead text-muted">Vehicle Booking Application</p>
                </div>
            </section>
            <div class="container">
                <section id="tabs">
                    <div class="row">
                        <div class="col-md-12">
                            <nav>
                                <div class="col-md-6 d-block mx-auto">
                                    <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                        <a class="nav-item nav-link active" id="nav-overview-tab" data-toggle="tab"
                                           href="#nav-overview" role="tab" aria-controls="nav-overview"
                                           aria-selected="true"><i
                                                class="fas fa-edit"></i> &nbsp;Make a Booking</a>
                                        <a class="nav-item nav-link" id="nav-drivers-tab" data-toggle="tab"
                                           href="#nav-drivers"
                                           role="tab" aria-controls="nav-drivers" aria-selected="false" onclick="fetchBookings()"><i
                                                class="fas fa-list"></i> &nbsp;View Bookings</a>
                                    </div>
                                </div>
                            </nav>
                            <div class="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
                                <div class="tab-pane fade show active" id="nav-overview" role="tabpanel"
                                     aria-labelledby="nav-overview-tab">
                                    <div class="row">
                                        <div class="col-md-6 mb-5 mt-5 d-block mx-auto">
                                            <form>
                                                <div class="form-group">
                                                    <label for="drivers" class="bmd-label-floating">Driver</label>
                                                    <select class="form-control" id="drivers">
                                                        <option selected>Select a driver</option>
                                                        <option>Tiger Nixon (D0072)</option>
                                                        <option>Joshua Winters (D0053)</option>
                                                        <option>Lucas Thiyago (D0046)</option>
                                                        <option>Woo Jin (D0027)</option>
                                                        <option>Airi Satou (D0013)</option>
                                                        <option>Brielle Williamson (D0009)</option>
                                                    </select>
                                                </div>
                                                <div class="form-group">
                                                    <label for="passenger" class="bmd-label-floating">Passenger</label>
                                                    <input type="text" class="form-control" id="passengerName">
                                                </div>
                                                <div class="form-group">
                                                    <label for="contactNumber" class="bmd-label-floating">Contact Number</label>
                                                    <input type="text" class="form-control" id="contactNumber">
                                                </div>
                                                <div class="form-group mt-5">
                                                    <button type="button"
                                                            class="btn btn-outline-primary btn-create content-btn mt-4 d-block mx-auto"
                                                            onclick="addData()">Add
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="nav-drivers" role="tabpanel"
                                     aria-labelledby="nav-drivers-tab">
                                    <div class="table-responsive content-table">
                                        <table class="table" id = "bookingTab">
                                            <thead>
                                            <tr>
                                                <th>Ref-id</th>
                                                <th>Driver</th>
                                                <th>Client</th>
                                                <th>Client phone</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <div id="profile-content">
            <section class="jumbotron text-center">
                <div class="container">
                    <div class="user-icon">
                        <i class="fas fa-user-circle fa-5x"></i>
                    </div>
                    <div class="jumbotron-heading"><%=name%>
                    </div>
                </div>
            </section>
            <div class="container">
                <div class="row">
                    <div class="col-md-6 d-block mx-auto">
                        <div class="card card-body table-container">
                            <div class="table-responsive content-table">
                            <% if (!oidcClaimDisplayValueMap.isEmpty()) { %>
                                <table class="table">
                                    <thead>
                                    <tr>
                                        <th rowspan="2">User Details</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <% for(String claim:oidcClaimDisplayValueMap.keySet()) { %>
                                            <tr>
                                                <td><%=oidcClaimDisplayValueMap.get(claim)%></td>
                                                <td><%=customClaimValueMap.get(claim).toString()%> </td>
                                            </tr>
                                        <% } %>
                                    </tbody>
                                </table>
                            <%  } else { %>
                                    <p align="center">No user details Available. Configure SP Claim Configurations.</p>
                            <%  } %>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main><!-- /.container -->
    <footer class="text-muted footer text-center">
        <span>Copyright &copy;  <a href="http://wso2.com/" target="_blank">
            <img src="img/wso2-dark.svg" class="wso2-logo" alt="wso2-logo"></a> &nbsp;<span class="year"></span>
        </span>
    </footer>
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
                            <li class="event sent">
                                <div class="request-response-infos">
                                    <h1 class='request-response-title'>Request <span class="float-right"><i
                                            class="fas fa-angle-down"></i></span></h1>
                                    <div class="request-response-details mt-3">
                                        <h2>Data:</h2>
                                        <div class="code-container mb-3">
                                            <button class="btn btn-primary btn-clipboard"
                                                    data-clipboard-target=".copy-target1"><i
                                                    class="fa fa-clipboard"></i></button>
                                            <p class="copied">Copied..!</p>
                                            <pre><code
                                                    class="copy-target1 JSON pt-3 pb-3"><%=requestObject.toString(4)%></code></pre>
                                        </div>
                                    </div>
                                </div>
                                <input type="hidden" id="request" value="<%=requestObject.toString()%>"/>
                            </li>
                            <li class="event received">
                                <div class="request-response-infos">
                                    <h1 class='request-response-title'>Response <span class="float-right"><i
                                            class="fa fa-angle-down"></i></span></h1>
                                    <div class="request-response-details mt-3">
                                        <h2>Data:</h2>
                                        <div class="code-container mb-3">
                                            <button class="btn btn-primary btn-clipboard"
                                                    data-clipboard-target=".copy-target3"><i
                                                    class="fa fa-clipboard"></i></button>
                                            <p class="copied">Copied..!</p>
                                            <pre><code
                                                    class="copy-target3 JSON pt-3 pb-3 requestContent"><%=responseObject.toString(4)%></code></pre>
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
<script src="js/custom.v1.0.js"></script>
<!-- SweetAlerts -->
<script src="libs/sweetalerts/sweetalert.2.1.2.min.js"></script>
<iframe id="rpIFrame" src="rpIFrame.jsp" frameborder="0" width="0" height="0"></iframe>
<script>
    hljs.initHighlightingOnLoad();
    loadMetadata();
</script>

</body>
</html>
