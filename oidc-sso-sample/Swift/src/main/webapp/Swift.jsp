<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.apache.oltu.oauth2.client.OAuthClient" %>
<%@ page import="org.apache.oltu.oauth2.client.URLConnectionClient" %>
<%@ page import="org.apache.oltu.oauth2.client.request.OAuthClientRequest" %>
<%@ page import="org.apache.oltu.oauth2.client.response.OAuthClientResponse" %>
<%@ page import="org.apache.oltu.oauth2.common.message.types.GrantType" %>
<%@ page import="org.wso2.sample.identity.oauth2.OAuth2Constants" %>
<%@ page import="org.wso2.sample.identity.oauth2.SampleContextEventListener" %>
<%@ page import="java.util.Properties" %>
<%@ page import="com.nimbusds.jwt.SignedJWT" %>
<%
    String code = null;
    String idToken = null;
    String sessionState = null;
    String error;
    String name = null;
    Properties properties;
    properties = SampleContextEventListener.getProperties();
    
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
            if (idToken != null) {
                try {
                    name = SignedJWT.parse(idToken).getJWTClaimsSet().getSubject();
                    session.setAttribute(OAuth2Constants.NAME, name);
                } catch (Exception e) {
//ignore
                }
            }
        }
    } catch (Exception e) {
        error = e.getMessage();
    }
%>
<!DOCTYPE html>
<html lang="en">

<head>
    
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    
    <title> Swift</title>
    
    <!-- Bootstrap Core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link href="css/stylish-portfolio.css" rel="stylesheet">
    
    <!-- Custom Fonts -->
    <link href="font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700,300italic,400italic,700italic"
          rel="stylesheet" type="text/css">
    
    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body class="swift">

<nav id="top" class="navbar navbar-inverse navbar-custom-swift">
    <div class="container-fluid">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#"><img src="img/logo.png" height="30"/> Swift</a>
        </div>
        <div class="collapse navbar-collapse" id="myNavbar">
            <ul class="nav navbar-nav navbar-right">
                <!--<li><button class="btn btn-dark custom-primary-swift btn-login"><strong>Login</strong></button></li>-->
                <li class="dropdown user-name">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <img class="img-circle" height="30" width=30" src="img/Admin-icon.jpg"> <span
                            class="user-name"><%=(String)session.getAttribute(OAuth2Constants.NAME)%><i class="fa fa-chevron-down"></i></span>
                    </a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a
                                href='<%=properties.getProperty("OIDC_LOGOUT_ENDPOINT")%>?post_logout_redirect_uri=<%=properties.getProperty("post_logout_redirect_uri")%>&id_token_hint=<%=idToken%>&session_state=<%=sessionState%>'>
                            Logout</a>
                        </li>
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
                <h2><strong>PickUp Swift</strong></h2>
                <p class="lead">Management Application</p>
            </div>
        </div>
        <!-- /.row -->
    </div>
    <!-- /.container -->
</section>
<div class="container">
    <div class="row">
        <div class="col-lg-10 col-lg-offset-1 bhoechie-tab-container">
            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-3 bhoechie-tab-menu">
                <div class="list-group">
                    <a href="#" class="list-group-item active text-center">
                        <h4 class="fa fa-desktop"></h4><br/>Overview
                    </a>
                    <a href="#" class="list-group-item text-center">
                        <h4 class="fa fa-users"></h4><br/>Drivers
                    </a>
                    <a href="#" class="list-group-item text-center">
                        <h4 class="fa fa-cab"></h4><br/>Vehicles
                    </a>
                    <a href="#" class="list-group-item text-center">
                        <h4 class="fa fa-book"></h4><br/>Bookings
                    </a>
                    <a href="#" class="list-group-item text-center">
                        <h4 class="fa fa-money"></h4><br/>Finance
                    </a>
                </div>
            </div>
            <div class="col-lg-11 col-md-11 col-sm-11 col-xs-9 bhoechie-tab">
                <!-- flight section -->
                <div class="bhoechie-tab-content active">
                    <div class="tile-container">
                        <div class="row">
                            <div class="col-sm-3">
                                <div class="hero-widget well well-sm">
                                    <div class="icon">
                                        <i class="fa fa-users"></i>
                                    </div>
                                    <div class="text">
                                        <var>30</var>
                                        <span class="text-muted">Drivers</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-3">
                                <div class="hero-widget well well-sm">
                                    <div class="icon">
                                        <i class="fa fa-cab"></i>
                                    </div>
                                    <div class="text">
                                        <var>40</var>
                                        <span class="text-muted">Vehicles</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-3">
                                <div class="hero-widget well well-sm">
                                    <div class="icon">
                                        <i class="fa fa-book"></i>
                                    </div>
                                    <div class="text">
                                        <var>730</var>
                                        <span class="text-muted">YTD Bookings</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-3">
                                <div class="hero-widget well well-sm">
                                    <div class="icon">
                                        <i class="fa fa-money"></i>
                                    </div>
                                    <div class="text">
                                        <var>$92,000</var>
                                        <span class="text-muted">YTD Earnings</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- train section -->
                <div class="bhoechie-tab-content">
                    <h4 class="text-left"><strong>Drivers</strong></h4>
                    <div class="table-responsive">
                        <table class="table table-bordered" width="100%" id="dataTable" cellspacing="0">
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
                                <td>0023</td>
                                <td>Tiger Nixon</td>
                                <td>40</td>
                                <td>2011/04/25</td>
                                <td>$120,800</td>
                                <td><i class="fa fa-trash"></i></td>
                            </tr>
                            <tr>
                                <td>0056</td>
                                <td>Garrett Winters</td>
                                <td>63</td>
                                <td>2011/07/25</td>
                                <td>$170,750</td>
                                <td><i class="fa fa-trash"></i></td>
                            </tr>
                            <tr>
                                <td>0012</td>
                                <td>Ashton Cox</td>
                                <td>23</td>
                                <td>2009/01/12</td>
                                <td>$86,000</td>
                                <td><i class="fa fa-trash"></i></td>
                            </tr>
                            <tr>
                                <td>0087</td>
                                <td>Cedric Kelly</td>
                                <td>22</td>
                                <td>2012/03/29</td>
                                <td>$133,060</td>
                                <td><i class="fa fa-trash"></i></td>
                            </tr>
                            <tr>
                                <td>0045</td>
                                <td>Airi Satou</td>
                                <td>33</td>
                                <td>2008/11/28</td>
                                <td>$162,700</td>
                                <td><i class="fa fa-trash"></i></td>
                            </tr>
                            <tr>
                                <td>0046</td>
                                <td>Brielle Williamson</td>
                                <td>34</td>
                                <td>2012/12/02</td>
                                <td>$172,000</td>
                                <td><i class="fa fa-trash"></i></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class=" add-padding-bottom-3x">
                        <a href="javascript:;" class="btn btn-default"><i class="fa fa-plus"></i> Add</a>
                    </div>
                </div>
                
                <!-- hotel search -->
                <div class="bhoechie-tab-content">
                    
                    <h4 class="text-left"><strong>Vehicles</strong></h4>
                    <div class="table-responsive">
                        <table class="table table-bordered" width="100%" id="dataTable" cellspacing="0">
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
                                <td>CA-1234</td>
                                <td>Tiger Nixon</td>
                                <td>Car</td>
                                <td>2011/04/25</td>
                                <td><i class="fa fa-trash"></i></td>
                            </tr>
                            <tr>
                                <td>KN-4536</td>
                                <td>Garrett Winters</td>
                                <td>Van</td>
                                <td>2011/07/25</td>
                                <td><i class="fa fa-trash"></i></td>
                            </tr>
                            <tr>
                                <td>JD-8877</td>
                                <td>Ashton Cox</td>
                                <td>Car</td>
                                <td>2009/01/12</td>
                                <td><i class="fa fa-trash"></i></td>
                            </tr>
                            <tr>
                                <td>HG-3423</td>
                                <td>Cedric Kelly</td>
                                <td>Car</td>
                                <td>2012/03/29</td>
                                <td><i class="fa fa-trash"></i></td>
                            </tr>
                            <tr>
                                <td>DB-9090</td>
                                <td>Airi Satou</td>
                                <td>Car</td>
                                <td>2008/11/28</td>
                                <td><i class="fa fa-trash"></i></td>
                            </tr>
                            <tr>
                                <td>SA-5555</td>
                                <td>Brielle Williamson</td>
                                <td>Van</td>
                                <td>2012/12/02</td>
                                <td><i class="fa fa-trash"></i></td>
                            </tr>
                            
                            </tbody>
                        </table>
                    </div>
                    <div class=" add-padding-bottom-3x">
                        <a href="javascript:;" class="btn btn-default"><i class="fa fa-plus"></i> Add</a>
                    </div>
                </div>
                <div class="bhoechie-tab-content">
                    <h4 class="text-left"><strong>Bookings</strong></h4>
                    <div class="table-responsive">
                        <table class="table table-bordered" width="100%" id="dataTable" cellspacing="0">
                            <thead>
                            <tr>
                                <th>Booking ID</th>
                                <td>Driver</td>
                                <th>Vehicle No</th>
                                <th>Date</th>
                                <th>Time</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>B0034</td>
                                <td>Tiger Nixon</td>
                                <td>HG-3423</td>
                                <td>2011/04/25</td>
                                <td>04:00</td>
                            </tr>
                            <tr>
                                <td>B0042</td>
                                <td>Garrett Winters</td>
                                <td>JD-8877</td>
                                <td>2011/07/25</td>
                                <td>17:50</td>
                            </tr>
                            <tr>
                                <td>B0178</td>
                                <td>Ashton Cox</td>
                                <td>DB-9090</td>
                                <td>2009/01/12</td>
                                <td>09:25</td>
                            </tr>
                            <tr>
                                <td>B0097</td>
                                <td>Cedric Kelly</td>
                                <td>SA-5555</td>
                                <td>2012/03/29</td>
                                <td>13:30</td>
                            </tr>
                            <tr>
                                <td>B0022</td>
                                <td>Airi Satou</td>
                                <td>KN-4536</td>
                                <td>2008/11/28</td>
                                <td>04:10</td>
                            </tr>
                            <tr>
                                <td>B0045</td>
                                <td>Brielle Williamson</td>
                                <td>CA-1234</td>
                                <td>2012/12/02</td>
                                <td>12:34</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class=" add-padding-bottom-3x">
                        <a href="javascript:" class="btn btn-default"><i class="fa fa-plus"></i> Add</a>
                    </div>
                </div>
                <div class="bhoechie-tab-content">
                    <h4 class="text-left"><strong>Finance</strong></h4>
                    <div class="table-responsive">
                        <table class="table table-bordered" width="100%" id="dataTable" cellspacing="0">
                            <thead>
                            <tr>
                                <th></th>
                                <th>YTD Values</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Investment</td>
                                <td>$32300</td>
                            </tr>
                            <tr>
                                <td>Expenses</td>
                                <td>$16500</td>
                            </tr>
                            <tr>
                                <td>Revenue</td>
                                <td>$22700</td>
                            </tr>
                            <tr>
                                <td>Balance</td>
                                <td>$66400</td>
                            </tr>
                            
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<footer id="footer">
    <div class="container">
        <div class="row">
            <div class="col-xs-12">
                <a href="http://wso2.com/" target="_blank"><img src="img/wso2logo.svg" height="20"/></a>
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
    $(function () {

        $("div.bhoechie-tab-menu>div.list-group>a").click(function (e) {
            e.preventDefault();
            $(this).siblings('a.active').removeClass("active");
            $(this).addClass("active");
            var index = $(this).index();
            $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
            $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
        });
    });
</script>
<iframe id="rpIFrame" src="rpIFrame.jsp" frameborder="0" width="0" height="0"></iframe>

</body>
</html>

