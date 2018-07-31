
<%@ page import="org.wso2.sample.identity.oauth2.OAuth2Constants" %>
<%

    session.removeAttribute(OAuth2Constants.OAUTH2_GRANT_TYPE);
    session.removeAttribute(OAuth2Constants.ACCESS_TOKEN);
    session.removeAttribute(OAuth2Constants.CODE);

%>


<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title> PickUp</title>

    <!-- Bootstrap Core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="css/stylish-portfolio.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,700,300italic,400italic,700italic" rel="stylesheet" type="text/css">


</head>
<!-- ===================================== END HEADER ===================================== -->
<body>
    <section id="login">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <div class="form-wrap">
                        <img src="img/logo.png" class="center-block" height="60"/>
                        <!--<h1 class="pickup-primary-color">Log in with your email account</h1>-->
                        </br>
                        <form role="form" action="oauth2-authorize-user.jsp?reset=true" method="post" id="login-form"
                autocomplete="off">
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

</body>
</html>

