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
    String idToken;
    String sessionState;
    String error;
    String name = null;
    Properties properties;
    properties = SampleContextEventListener.getProperties();
    
    try {
        sessionState = request.getParameter(OAuth2Constants.SESSION_STATE);
        if (StringUtils.isNotBlank(sessionState)) {
            session.setAttribute(OAuth2Constants.SESSION_STATE, sessionState);
        }
        
        error = request.getParameter(OAuth2Constants.ERROR);
        
        if (StringUtils.isNotBlank(request.getHeader(OAuth2Constants.REFERER)) &&
                request.getHeader(OAuth2Constants.REFERER).contains("rpIFrame")) {
            /**
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
    
    <title> Pick my Book</title>
    
    <!-- Bootstrap Core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link href="css/stylish-portfolio.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css" type="text/css" media="all" />
    
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
            <a class="navbar-brand" href="#"><img src="img/logo.png" height="30"/> Pick my Book</a>
        </div>
        <div class="collapse navbar-collapse" id="myNavbar">
            <ul class="nav navbar-nav navbar-right">
                <!--<li><button class="btn btn-dark custom-primary-swift btn-login"><strong>Login</strong></button></li>-->
                <li class="dropdown user-name">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <img class="img-circle" height="30" width=30" src="img/Admin-icon.jpg"> <span
                            class="user-name"><%=name%>@pickmybook <i class="fa fa-chevron-down"></i></span>
                    </a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a
                                href='<%=properties.getProperty("OIDC_LOGOUT_ENDPOINT")%>'>Logout</a>
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
                <h2><strong>Pick my Book</strong></h2>
                <p class="lead">A Book Delivering Application</p>
            </div>
        </div>
        <!-- /.row -->
    </div>
    <!-- /.container -->
</section>

<br><br>
<div class="container">
        <div class="row">
            <div class="col-md-4">

		<!-- Sidebar -->
		<div id="sidebar">
			<ul class="categories">
				<li>
					<h4>Categories</h4>
					<ul>
						<li><a href="#">Action and Adventure</a></li>
						<li><a href="#">Romance</a></li>
						<li><a href="#">Religion, Spirituality & New Age</a></li>
						<li><a href="#">Science fiction</a></li>
						<li><a href="#">Satire</a></li>
						<li><a href="#">Mystery</a></li>
						<li><a href="#">Encyclopedias</a></li>
					</ul>
				</li>
				<li>
					<h4>Authors</h4>
					<ul>
						<li><a href="#">Suzanne Brockmann</a></li>
						<li><a href="#">Dan Brown</a></li>
						<li><a href="#">J. K. Rowling</a></li>
						<li><a href="#">Tess Gerritsen</a></li>
						<li><a href="#">Kay Hooper</a></li>
						<li><a href="#">Tom Clancy</a></li>
						<li><a href="#">John Grisham</a></li>
						<li><a href="#">Vince Flynn</a></li>
						<li><a href="#">Michael Connelly</a></li>
						<li><a href="#">Dean Koontz</a></li>
					</ul>
				</li>
                <li>
					<h4>Upcoming</h4>
					<ul>
						<li><a href="#">The Mephisto Club by Tess Gerritsen</a></li>
						<li><a href="#">The Husband by Dean Koontz</a></li>
						<li><a href="#">The DaVinci Code by Dan Brown</a></li>
						<li><a href="#">Angels Fall by Nora Roberts</a></li>
						<li><a href="#">Twelve Sharp by Janet Evanovich</a></li>
						<li><a href="#">Imperium by Robert Harris</a></li>
						<li><a href="#">Under Orders by Dick Francis</a></li>
						<li><a href="#">Act of Treason by Vince Flynn</a></li>
						<li><a href="#">The Collectors by David Baldacci</a></li>
					</ul>
				</li>
			</ul>
		</div>
		</div>

		<!-- End Sidebar -->
		<!-- Content -->
		<div class="col-md-8">
			<!-- Products -->
			<div class="products">
				<h3>Featured Products</h3>
				<ul>
					<li>
						<div class="product">
							<a href="#" class="info">
								<span class="holder">
									<img src="img/image01.png" alt="" />
									<span class="book-name">Book One</span>
									<span class="author">by Author abc</span>
                                    <span class="description">Lorem ipsum dolor sit amet, consectetuer<br /></span>
									<br />
									<button class="btn-primary">&nbsp;&nbsp;Buy Now&nbsp;&nbsp;</Button>
								</span>
							</a>
						</div>
					</li>
					<li>
						<div class="product">
							<a href="#" class="info">
								<span class="holder">
									<img src="img/image01.png" alt="" />
									<span class="book-name">Book Two</span>
									<span class="author">by Author def</span>
                                    <span class="description">Lorem ipsum dolor sit amet, consectetuer<br /></span>
									<br />
									<button class="btn-primary">&nbsp;&nbsp;Buy Now&nbsp;&nbsp;</Button>
								</span>
							</a>
						</div>
					</li>
					<li>
						<div class="product">
							<a href="#" class="info">
								<span class="holder">
									<img src="img/image01.png" alt="" />
									<span class="book-name">Book Three</span>
									<span class="author">by Author ghi</span>
                                    <span class="description">Lorem ipsum dolor sit amet, consectetuer<br /></span>
									<br />
									<button class="btn-primary">&nbsp;&nbsp;Buy Now&nbsp;&nbsp;</Button>
								</span>
							</a>
						</div>
					</li>
					<li>
						<div class="product">
							<a href="#" class="info">
								<span class="holder">
									<img src="img/image01.png" alt="" />
									<span class="book-name">Book Four</span>
									<span class="author">by Author jkl</span>
                                    <span class="description">Lorem ipsum dolor sit amet, consectetuer<br /></span>
									<br />
									<button class="btn-primary">&nbsp;&nbsp;Buy Now&nbsp;&nbsp;</Button>
								</span>
							</a>
						</div>
					</li>
					<li>
						<div class="product">
							<a href="#" class="info">
								<span class="holder">
									<img src="img/image01.png" alt="" />
									<span class="book-name">Book Five</span>
									<span class="author">by Author mno</span>
                                    <span class="description">Lorem ipsum dolor sit amet, consectetuer<br /></span>
									<br />
									<button class="btn-primary">&nbsp;&nbsp;Buy Now&nbsp;&nbsp;</Button>
								</span>
							</a>
						</div>
					</li>
					<li>
						<div class="product">
							<a href="#" class="info">
								<span class="holder">
									<img src="img/image01.png" alt="" />
									<span class="book-name">Book Six</span>
									<span class="author">by Author pqr</span>
                                    <span class="description">Lorem ipsum dolor sit amet, consectetuer<br /></span>
									<br />
									<button class="btn-primary">&nbsp;&nbsp;Buy Now&nbsp;&nbsp;</Button>
								</span>
							</a>
						</div>
					</li>
					<li>
						<div class="product">
							<a href="#" class="info">
								<span class="holder">
									<img src="img/image01.png" alt="" />
									<span class="book-name">Book Seven</span>
									<span class="author">by Author stn</span>
                                    <span class="description">Lorem ipsum dolor sit amet, consectetuer<br /></span>
									<br />
									<button class="btn-primary">&nbsp;&nbsp;Buy Now&nbsp;&nbsp;</Button>
								</span>
							</a>
						</div>
					</li>
					<li>
						<div class="product">
							<a href="#" class="info">
								<span class="holder">
									<img src="img/image01.png" alt="" />
									<span class="book-name">Book Eight</span>
									<span class="author">by Author cld</span>
                                    <span class="description">Lorem ipsum dolor sit amet, consectetuer<br /></span>
									<br />
									<button class="btn-primary">&nbsp;&nbsp;Buy Now&nbsp;&nbsp;</Button>
								</span>
							</a>
						</div>
					</li>
                    <li>
						<div class="product">
							<a href="#" class="info">
								<span class="holder">
									<img src="img/image01.png" alt="" />
									<span class="book-name">Book Nine</span>
									<span class="author">by Author thr</span>
                                    <span class="description">Lorem ipsum dolor sit amet, consectetuer<br /></span>
									<br />
									<button class="btn-primary">&nbsp;&nbsp;Buy Now&nbsp;&nbsp;</Button>
								</span>
							</a>
						</div>
					</li>
                    <li>
						<div class="product">
							<a href="#" class="info">
								<span class="holder">
									<img src="img/image01.png" alt="" />
									<span class="book-name">Book Ten</span>
									<span class="author">by Author npn</span>
                                    <span class="description">Lorem ipsum dolor sit amet, consectetuer<br /></span>
									<br />
									<button class="btn-primary">&nbsp;&nbsp;Buy Now&nbsp;&nbsp;</Button>
								</span>
							</a>
						</div>
					</li>
                    <li>
						<div class="product">
							<a href="#" class="info">
								<span class="holder">
									<img src="img/image01.png" alt="" />
									<span class="book-name">Book Eleven</span>
									<span class="author">by Author axz</span>
                                    <span class="description">Lorem ipsum dolor sit amet, consectetuer<br /></span>
									<br />
									<button class="btn-primary">&nbsp;&nbsp;Buy Now&nbsp;&nbsp;</Button>
								</span>
							</a>
						</div>
					</li>
                    <li>
						<div class="product">
							<a href="#" class="info">
								<span class="holder">
									<img src="img/image01.png" alt="" />
									<span class="book-name">Book Twelve</span>
									<span class="author">by Author gsa</span>
                                    <span class="description">Lorem ipsum dolor sit amet, consectetuer<br /></span>
									<br />
									<button class="btn-primary">&nbsp;&nbsp;Buy Now&nbsp;&nbsp;</Button>
								</span>
							</a>
						</div>
					</li>
				</ul>
				<br>
			<!-- End Products -->
        </div>
	</div>
</div>

<footer id="footer">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 text-center">
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

