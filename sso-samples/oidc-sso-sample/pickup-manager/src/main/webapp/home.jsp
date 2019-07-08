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
<%@page import="java.util.ArrayList"%>
<%@page import="java.util.logging.Level"%>
<%@page import="com.nimbusds.jwt.SignedJWT"%>
<%@page import="com.nimbusds.jwt.ReadOnlyJWTClaimsSet"%>
<%@page import="org.json.JSONObject"%>
<%@page import="org.wso2.sample.identity.oauth2.OAuth2Constants"%>
<%@page import="java.util.Properties"%>
<%@page import="org.wso2.sample.identity.oauth2.SampleContextEventListener"%>
<%@page import="org.wso2.sample.identity.oauth2.CommonUtils"%>
<%@page import="java.util.logging.Logger"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
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
    <meta name="description" content="PICKUP MANAGER - Management Application">

    <title>PICKUP MANAGER</title>

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
</head>

<body class="app-home">

<div id="wrapper" class="wrapper"></div>

<div id="actionContainer">
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
                        <i class="fas fa-user-circle"></i> <span><%=name%></span></span>
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <a class="dropdown-item" href="#" id="profile">Profile</a>
                        <a class="dropdown-item" href='<%=properties.getProperty("OIDC_LOGOUT_ENDPOINT")%>?post_logout_redirect_uri=<%=properties.getProperty("post_logout_redirect_uri")%>&id_token_hint=<%=idToken%>&session_state=<%=sessionState%>'>
                            Logout</a>
                    </div>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="toggleView" href="#" data-toggle="tooltip" data-placement="bottom" title="Console">
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
        </div>
        <div id="profile-content">
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
                            <%if (!oidcClaimDisplayValueMap.isEmpty()) { %>
                                <table class="table">
                                    <thead>
                                    <tr>
                                        <th rowspan="2">User Details</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <% for(String claim:oidcClaimDisplayValueMap.keySet()) { %>
                                            <tr>
                                                <td><%=oidcClaimDisplayValueMap.get(claim)%> </td>
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
                                            <pre><code class="copy-target1 JSON pt-3 pb-3"><%=requestObject.toString(4)%></code></pre>
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
                                            <pre><code class="copy-target3 JSON pt-3 pb-3 requestContent"><%=responseObject.toString(4)%></code></pre>
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
<iframe id="rpIFrame" src="rpIFrame.jsp" frameborder="0" width="0" height="0"></iframe>
<script>hljs.initHighlightingOnLoad();</script>

</body>
</html>
