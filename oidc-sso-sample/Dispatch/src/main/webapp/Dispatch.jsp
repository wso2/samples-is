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

    <title> Dispatch</title>

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
                        <a href="" class=" allocations" >
                            <div class="service-item">
                                    <span class="fa-stack fa-3x">
                                    <i class="fa fa-circle fa-stack-2x circle "></i>
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
                        <a href="" class="allocations">
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

<!-- Create -->
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

<!-- Map -->
<section id="view" class="view content hide">
    <div class="container">
        <div class="row">
            <div class="col-lg-10 col-lg-offset-1">
                <!--<hr class="custom-hr">-->
                <h4 class="text-center">View Allocations</h4>
                </br>
                <div class="table-responsive">
                    <table class="table table-bordered" width="100%" id="dataTable" cellspacing="0">
                        <thead>
                        <tr>
                            <th>Driver</th>
                            <th>Vehicle</th>
                            <th>Vehicle No</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Period</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Tiger Nixon</td>
                            <td>Car</td>
                            <td>CN-1234</td>
                            <td>2017/04/15</td>
                            <td>07:00</td>
                            <td>7 days</td>
                            <td><i class="fa fa-trash"></i></td>
                        </tr>
                        <tr>
                            <td>Garrett Winters</td>
                            <td>Van</td>
                            <td>KC-3543</td>
                            <td>2017/04/25</td>
                            <td>02:30</td>
                            <td>5 days</td>
                            <td><i class="fa fa-trash"></i></td>
                        </tr>
                        <tr>
                            <td>Ashton Cox</td>
                            <td>Car</td>
                            <td>CA-8877</td>
                            <td>2017/01/12</td>
                            <td>05:30</td>
                            <td>10 days</td>
                            <td><i class="fa fa-trash"></i></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Footer -->
<footer id="footer">
    <div class="container">
        <div class="row">
            <div class="col-lg-10 col-lg-offset-1 text-center">
                <a href="http://wso2.com/" target="_blank" ><img src="img/wso2logo.svg" height="20" /></a>
                <p class="text-muted">Copyright &copy; WSO2 2018</p>
            </div>
        </div>
    </div>
    <a id="to-top" href="#top" class="btn btn-dark btn-lg"><i class="fa fa-chevron-up fa-fw fa-1x"></i></a>
</footer>

<!-- jQuery -->
<script src="js/jquery.js"></script>

<!-- Bootstrap Core JavaScript -->
<script src="js/bootstrap.min.js"></script>

<!-- Custom Theme JavaScript -->
<script>
    // Closes the sidebar menu
    $(".allocations").first().addClass('active');
    $(".allocations .circle").first().addClass('custom-primary-color');

    $("#menu-close").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
    });
    // Opens the sidebar menu
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
    });

    $(".allocations").click(function(e) {
        e.preventDefault();
        $(".allocations").removeClass('active');
        $('.circle').removeClass('custom-primary-color');
        $(this).toggleClass("active");
        $('.content').toggleClass('hide');
        $(this).find('.circle').toggleClass('custom-primary-color');
    });

    // Scrolls to the selected menu item on the page
    $(function() {
        $('a[href*=#]:not([href=#],[data-toggle],[data-target],[data-slide])').click(function() {
            if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                    return false;
                }
            }
        });

        $("div.bhoechie-tab-menu>div.list-group>a").click(function(e) {
            e.preventDefault();
            $(this).siblings('a.active').removeClass("active");
            $(this).addClass("active");
            var index = $(this).index();
            $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
            $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");
        });
    });
    //#to-top button appears after scrolling
    var fixed = false;
    $(document).scroll(function() {
        if ($(this).scrollTop() > 250) {
            if (!fixed) {
                fixed = true;
                // $('#to-top').css({position:'fixed', display:'block'});
                $('#to-top').show("slow", function() {
                    $('#to-top').css({
                        position: 'fixed',
                        display: 'block'
                    });
                });
            }
        } else {
            if (fixed) {
                fixed = false;
                $('#to-top').hide("slow", function() {
                    $('#to-top').css({
                        display: 'none'
                    });
                });
            }
        }
    });
</script>
<iframe id="rpIFrame" src="rpIFrame.jsp" frameborder="0" width="0" height="0"></iframe>
</body>

</html>
