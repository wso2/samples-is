<!DOCTYPE html>
<html lang="en">
<head>
<title>Pay Here</title>
 <!-- Meta-Tags -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="utf-8">
    <meta name="keywords" content="Business Login Form a Responsive Web Template, Bootstrap Web Templates, Flat Web Templates, Android Compatible Web Template, Smartphone Compatible Web Template, Free Webdesigns for Nokia, Samsung, LG, Sony Ericsson, Motorola Web Design">

	
    <!-- //Meta-Tags -->
	
	<!-- css files -->
	<link href="css/cibacss.css" rel="stylesheet" type="text/css" media="all"/>
	<link href="css/xcss.css" rel="stylesheet" type="text/css" media="all"/>
	 
  	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
 	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<link href="css/bootstrap.css" rel="stylesheet" type="text/css" media="all"/>
<link href="scss/_variables.scss" rel="stylesheet" type="text/css" media="all"/>
<link href="scss/_bootswatch.scss" rel="stylesheet" type="text/css" media="all"/>

<script src="//cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/hmac-sha256.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/components/enc-base64-min.js"></script>
  	
 <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
<link href="css/cibahome.css" rel="stylesheet" type="text/css" media="all"/>
<link href="css/split.css" rel="stylesheet" type="text/css" media="all"/>
<link href="css/payhere.css" rel="stylesheet" type="text/css" media="all"/>
<link href="css/nowterminal.css" rel="stylesheet" type="text/css" media="all"/>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<!------ Include the above in your HEAD tag ---------->
 <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
	<!------ Include the above in your HEAD tag ----------

	<!-- //css files -->
	
	<!-- google fonts -->
	<link href="//fonts.googleapis.com/css?family=Raleway:100,100i,200,200i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">
	<!-- //google fonts -->
	
</head>
<script>
var poll_count=0;
var setinterval;
var request;
var auth_reponse;
var token_request;
var token_response;
var user;

function base64url(source) {
  // Encode in classical base64
  encodedSource = CryptoJS.enc.Base64.stringify(source);
  
  // Remove padding equal characters
  encodedSource = encodedSource.replace(/=+$/, '');
  
  // Replace characters according to base64url specifications
  encodedSource = encodedSource.replace(/\+/g, '-');
  encodedSource = encodedSource.replace(/\//g, '_');
  
  return encodedSource;
}


function sendRequest() {
	console.log("Identity Received");
	var data = null;
        var xmlhttp = new XMLHttpRequest();

const urlParams = new URLSearchParams(window.location.search);
 user = urlParams.get('user'); 	
document.getElementById("user").innerHTML=("User :  "+ user);

 interlockingID = urlParams.get('binding_message'); 	
document.getElementById("interlockingID").innerHTML=("InterlockingID :  "+ interlockingID);

amount = urlParams.get('amount'); 	

var transactionContext = {
"user":user,
"amount":amount,
"shop": "WSO2 CIBA DEMO CONSOLE",
"application":"PayHere"

};

var iat = Math.floor(Date.now() / 1000);
console.log(iat);
var nbf = iat;
var exp = iat+3600;

var header = {
  "alg": "HS256",
  "typ": "JWT"
};

var data = {

 "iss": "ZzxmDqqK8YYfjtlOh9vw85qnNVoa",
 "aud": "https://localhost:9443/oauth2/ciba",
 "exp": exp,
 "iat": iat,
 "nbf": nbf,
 "jti": "4LTCqACC2ESC5BWCnN3j58EnA",
 "scope": "openid email",
 "client_notification_token": "8d67dc78-7faa-4d41-aabd-67707b374255",
"transaction_context" : transactionContext,
 "binding_message": interlockingID,
 "login_hint": user
};

var secret = "My very confidential secret!!!";

var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
var encodedHeader = base64url(stringifiedHeader);


var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
var encodedData = base64url(stringifiedData);


var signature = encodedHeader + "." + encodedData;
signature = CryptoJS.HmacSHA256(signature, secret);
signature = base64url(signature);

  request = encodedHeader+"."+encodedData+"."+signature ;

	var url = 'https://localhost:9443/oauth2/ciba';
	var params = 'request='+request;
	xmlhttp.open('POST', url, true);
	
document.getElementById("CIBAauthRequest").innerHTML=("Authentication Request sent. "+" <br />" + " <br />" +"Authentication Request : "+"https://localhost:9443/oauth2/ciba?request="+request);


	//Send the proper header information along with the request
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    	xmlhttp.onreadystatechange = function() {
		
        if (this.readyState === 4 && this.status === 200) {
			console.log("Authentication Response Received")
			var response = this.responseText;
			var json = JSON.parse(response);
			var auth_req_id = json.auth_req_id;
			var interval = json.interval;


			console.log("Auth_req ID",auth_req_id)
                        //document.getElementById("CIBAauthRequest").innerHTML=("");	
			document.getElementById("CIBAauthResponse").innerHTML=("Authentication Response received. "+" <br />"  + " <br />" +"Authentication Response : "+response);	
			 auth_reponse = response;
			setinterval= setInterval(function(){tokenRequest(auth_req_id)},5000);

		} else{
			document.getElementById("CIBAauthResponse").innerHTML=("ErrorResponse  : "+this.responseText);

			console.log(this.responseText);
        }
};
console.log("Authentication Request Sent.");
   
xmlhttp.send(params);

};

	function tokenRequest(auth_req_id){
token_request = "https://localhost:9443/oauth2/token?auth_req_id="+auth_req_id+"&grant_type=urn:openid:params:grant-type:ciba" ;
		document.getElementById("polling_status").innerHTML=("");
		document.getElementById("tokenRequest").innerHTML=("");
		document.getElementById("tokenResponse").innerHTML=("");
		poll_count++;
		console.log("Token Request posted");
		document.getElementById("polling_status").innerHTML=("Initiated Polling. "+" <br />" + " <br />" +"Polling Status : ("+poll_count +"). Polling for Token . . .");
		document.getElementById("tokenRequest").innerHTML=("Token Request Sent."+" <br />" + " <br />" +" Token Request : https://localhost:9443/oauth2/token?auth_req_id="+auth_req_id+"&grant_type=urn:openid:params:grant-type:ciba&redirect_uri=http://10.10.10.134:8080/CallBackEndpoint");

		var data1=null
		
		var xmlhttp = new XMLHttpRequest();
		var url = 'https://localhost:9443/oauth2/token';
	var params1 = 'auth_req_id='+auth_req_id+'&grant_type=urn:openid:params:grant-type:ciba&redirect_uri=http://10.10.10.134:8080/CallBackEndpoint';
	xmlhttp.open('POST', url, true);
xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
xmlhttp.setRequestHeader('Authorization', 'Basic ' + btoa(unescape(encodeURIComponent('ZzxmDqqK8YYfjtlOh9vw85qnNVoa' + ':' + 'ZkaeWpAW3RztIm4hKAgmf251LdAa'))));

		xmlhttp.onreadystatechange = function() {
        		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText)
			var response = this.responseText;
			var json = JSON.parse(response);
			var id_token = json.ID_token;

			if (response.includes("id_token")){
				clearInterval(setinterval);
				console.log("Token received");
				document.getElementById("tokenResponse").innerHTML=("Token Response recieved."+" <br />" + " <br />" +"Token Response : " +response);
				token_response = response;
                               window.location.replace("https://localhost/CIBA/resultpage.php?CIBAauthRequest="+request+"&CIBAauthResponse="+auth_reponse+"&tokenRequest="+token_request+"&tokenResponse="+token_response+"&user="+user+"&interlockinID="+interlockingID);

			}else{
				document.getElementById("tokenResponse").innerHTML=("Pending Authentication . . .");
				};

			
			}else{
				//window.open("ErrorPage.php);
				console.log(this.responseText);
				document.getElementById("tokenResponse").innerHTML=(this.responseText);
			}	
        	};
		xmlhttp.send(params1);
	};

    </script>
<body onload="sendRequest()">
<section class="container">
  <div class="left-half">
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <a class="navbar-brand" href="#">WSO2 CIBA DEMO Console</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
</nav>

                    <div>
                         
        			<img src="/CIBA/Images" alt="Logo" height=100px; width=100px>
                     </div>       
   
 
            <div style = "position:absolute; left:20px; top:200px;  color=#FFA500 height=400px; width=400px;">
                    <h3 class="card-title" id = "user"> </h3> 
                   <p id="interlockingID"></p>
	<p>Waiting for Authentication......</p>

                </div>
       
      

       <div id="circle">

<img src="/CIBA/home.png" alt="PayHere" height=400px; width=400px ; style = "position:absolute; left:10px; top:180px;" >
  <div class="loader"  style = "position:absolute; left:10px; top:150px;" >
				    <div class="loader">
					<div class="loader">
					   <div class="loader">

					   </div>
					</div>
				    </div>
				  </div>
			   </div> 
                    


  </div>
  <div class="right-half">
	<div class="window">
	  <div class="terminal">
	<h1>Developer Mode </h1>
	    <p class="log">
	<span>
	<p> Location: PayHere Console</br>
	    State: Waiting for User authentication...</p>
	<p class="log"id="CIBAauthRequest"></p>
	<p class="log" id="CIBAauthResponse"></p>
	<p class="log" id="polling_status"></p>
	<p class="log" id="tokenRequest"></p>
	<p class="log" id="tokenResponse"></p>
      </span>
	    </p>
	  </div>
	</div>
 </div>
</section>
 
</body>
</html>
