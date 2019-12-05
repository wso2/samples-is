<!DOCTYPE html>
<html lang="en">
<head>
<title>Pay Here</title>
 <!-- Meta-Tags -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="utf-8"><link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">

<link href="css/cibahome.css" rel="stylesheet" type="text/css" media="all"/>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<!------ Include the above in your HEAD tag ---------->
 <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
<link href="css/bootstrap.css" rel="stylesheet" type="text/css" media="all"/>
<link href="scss/_variables.scss" rel="stylesheet" type="text/css" media="all"/>
<link href="scss/_bootswatch.scss" rel="stylesheet" type="text/css" media="all"/>


  	
 <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
<link href="css/cibahome.css" rel="stylesheet" type="text/css" media="all"/>
<link href="css/tick.css" rel="stylesheet" type="text/css" media="all"/>
<link href="css/split.css" rel="stylesheet" type="text/css" media="all"/>
<link href="css/payhere.css" rel="stylesheet" type="text/css" media="all"/>
<link href="css/nowterminal.css" rel="stylesheet" type="text/css" media="all"/>
</head>

<script>
const urlParams = new URLSearchParams(window.location.search);
var user = urlParams.get('user'); 
var interlockingID = urlParams.get('interlockingID'); 
document.getElementById("interlockingID").innerHTML = ("InterLockingID : " +interlockingID);
document.getElementById("user").innerHTML = ("User : " +user +" authenticated!!");
</script>
<body>
<section class="container">
  <div class="left-half">
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <a class="navbar-brand" href="#">WSO2 CIBA DEMO Console</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarColor01">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Features</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Pricing</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Sales</a>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="text" placeholder="Search">
      <button class="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>
</nav>

                    <div>
                         
        			<img src="/CIBA/Images" alt="Logo" height=100px; width=100px>
                     </div>       
   
 
            <div style = "position:absolute; left:10px; top:150px;  color=#FFA500 height=400px; width=400px;">
                    <h3 class="card-title" id="user"></h3>
                   <p id = "interlockingID"></p>
		<p>Authenticated. Transaction Done !!!</p>
<img src="/CIBA/last.png" alt="PayHere" height=500px; width=400px ; style = "position:absolute; left:150px; top:200px;" >

<div class="swal2-icon swal2-success swal2-animate-success-icon" style="position:absolute; left:255px; top:255px; display: flex;">
 <div class="swal2-success-circular-line-left" style="background-color: rgb(255, 255, 255);"></div>
   <span class="swal2-success-line-tip"></span>
   <span class="swal2-success-line-long"></span>
   <div class="swal2-success-ring"></div> 
   <div class="swal2-success-fix" style="background-color: rgb(255, 255, 255);"></div>
   <div class="swal2-success-circular-line-right" style="background-color: rgb(255, 255, 255);"></div>
  </div>
  
                </div>
      
      
	


  </div>
   <div class="right-half">
	<div class="window">
	  <div class="terminal">
	<h1>Developer Mode </h1>
	    <p class="log">
	<span>
<script>
const CIBAauthenticationRequest = urlParams.get('CIBAauthRequest'); 
const CIBAauthenticationResponse = urlParams.get('CIBAauthResponse'); 
const TokenRequest = urlParams.get('tokenRequest'); 
const TokenResponse = urlParams.get('tokenResponse'); </script>
	<p> Location: PayHere Console</br>
	    State: User Authentication Sucess !</p>
	<p class="log" id="CIBAauthRequest"> <script> document.getElementById("CIBAauthRequest").innerHTML = ("CIBAAuth Request : " +CIBAauthenticationRequest); </script> </p>
	<p class="log" id="CIBAauthResponse"> <script> document.getElementById("CIBAauthResponse").innerHTML = ("CIBAAuth Response : " +CIBAauthenticationResponse); </script></p>
	<p class="log" id="tokenRequest"><script> document.getElementById("tokenRequest").innerHTML= ("Token Request : " + TokenRequest); </script></p>
	<p class="log" id="tokenResponse"> <script> document.getElementById("tokenResponse").innerHTML= ("Token Response : " +TokenResponse); </script></p>
      </span>
	    </p>
	  </div>
	</div>
 </div>
</section>
</body>
</html>
