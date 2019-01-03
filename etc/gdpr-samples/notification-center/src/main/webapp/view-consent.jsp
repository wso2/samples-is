<%@ page import="javax.servlet.http.HttpSession" %>
<%@ page import="java.util.HashMap" %>

<%
    HashMap<String,String> hmap = (HashMap<String,String>)(session.getAttribute("response"));
    String mobState = null;
    String emState = null;
%>

<!DOCTYPE html>
<html lang="en">

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
    <link href="css/promo-page.css" rel="stylesheet">

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
            <a class="navbar-brand" href="#"><img src="img/logo.png" height="30" /> Notification Center</a>
        </div>
    </div>
</nav>

<section id="about" class="about">
    <div class="container">
        <div class="row">
            <div class="col-lg-12 text-center">
                <h2><strong>PickUp Promotion Schedules</strong></h2>
                <br />
            </div>
        </div>
        <!-- /.row -->
    </div>
    <!-- /.container -->
</section>
<br />

<div class="container">
<h3><strong>50% Discount Campaign</strong></h3>
<br />
<div class="table-responsive">
    <table class="table table-bordered" width="100%" id="dataTable" cellspacing="0">
    <thead>
    <tr>
        <th>User Name</th>
        <th>SMS campaign</th>
        <th>Email campaign</th>
        <th>Date</th>
    </tr>
    </thead>

<%
    for(int i=0;i<=hmap.size();i++){
        if(hmap.get("user"+i) != null) {

        if(hmap.get("piiCatMobile"+i) == null) {
            mobState = "Not subscribed";
        }else {
            mobState = "Subscribed";
        }

        if(hmap.get("piiCatEmail"+i) == null) {
            emState = "Not subscribed";
        }else {
            emState = "Subscribed";
        }
%>
    <tbody>
        <tr>
        <td><%=hmap.get("user"+i)%></td>
        <td><%=mobState%></td>
        <td><%=emState%></td>
        <td>15/06/2018</td>
        </tr>
    </tbody>
<%
}
}
%>
</table>
</div>

<br />
<h3><strong>70% Discount Campaign</strong></h3>
<br />
<div class="table-responsive">
    <table class="table table-bordered" width="100%" id="dataTable" cellspacing="0">
    <thead>
    <tr>
        <th>User Name</th>
        <th>SMS campaign</th>
        <th>Email campaign</th>
        <td>Date</td>
    </tr>
    </thead>

<%
    for(int i=0;i<=hmap.size();i++){
        if(hmap.get("user"+i) != null) {

        if(hmap.get("piiCatMobile"+i) == null) {
            mobState = "Not subscribed";
        }else {
            mobState = "Subscribed";
        }

        if(hmap.get("piiCatEmail"+i) == null) {
            emState = "Not subscribed";
        }else {
            emState = "Subscribed";
        }
%>
    <tbody>
        <tr>
        <td><%=hmap.get("user"+i)%></td>
        <td><%=mobState%></td>
        <td><%=emState%></td>
        <td>15/07/2018</td>
        </tr>
    </tbody>
<%
}
}
%>
</table>
</div>

<br />
<h3><strong>100% Discount Campaign</strong></h3>
<br />
<div class="table-responsive">
    <table class="table table-bordered" width="100%" id="dataTable" cellspacing="0">
    <thead>
    <tr>
        <th>User Name</th>
        <th>SMS campaign</th>
        <th>Email campaign</th>
        <th>Date</th>
    </tr>
    </thead>

<%
    for(int i=0;i<=hmap.size();i++){
        if(hmap.get("user"+i) != null) {

        if(hmap.get("piiCatMobile"+i) == null) {
            mobState = "Not subscribed";
        }else {
            mobState = "Subscribed";
        }

        if(hmap.get("piiCatEmail"+i) == null) {
            emState = "Not subscribed";
        }else {
            emState = "Subscribed";
        }
%>
    <tbody>
        <tr>
        <td><%=hmap.get("user"+i)%></td>
        <td><%=mobState%></td>
        <td><%=emState%></td>
        <td>15/08/2018</td>
        </tr>
    </tbody>
<%
}
}
%>
</table>
</div>

</div>
<br />

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

</body>
</html>