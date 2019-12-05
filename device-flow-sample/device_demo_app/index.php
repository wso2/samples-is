<!DOCTYPE html>
<html>
<title>Device_Log</title>

<head>

<!-- css files -->

<meta name="viewport" content="width=device-width, initial-scale=1">
<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
<link href="css/deviceflow.css" rel="stylesheet" type="text/css" media="all"/>

</head>

<script type="text/javascript">
    function generateBarCode() {
      var nric = $('#text').val();
      var url = 'https://api.qrserver.com/v1/create-qr-code/?data=' + nric + '&amp;size=50x50';
      $('#barcode').attr('src', url);
   }
</script>


<script>
function deviceAuthorization() {


	console.log("Identity Received");
	var data = null;
        var xmlhttp = new XMLHttpRequest();
		
    xmlhttp.open("POST", "https://localhost:9443/oauth2/device_authorize?client_id=8xlu351YUiW6sNStsKAfZoScRUEa&scope=email profile name");
            xmlhttp.onreadystatechange = function() {
            
            if (this.readyState === 4 && this.status === 200) {
                console.log("Authorization Response Received")
                var response = this.responseText;
                var json = JSON.parse(response);
                var user_code = json.user_code;
                var verification_uri = json.verification_uri;
		var verification_uri_complete = json.verification_uri_complete;
                var deviceCode = json.device_code;

		document.getElementById("tvblock1").style.display="none";
                document.getElementById("tvblock2").style.display="block";
		document.getElementById("tvblock2").style.display="none";

                document.getElementById("deviceAuthReq").innerHTML=("Request : "+"https://localhost:9443/oauth2/device_authorize?client_id=8xlu351YUiW6sNStsKAfZoScRUEa&scope=email profile name");
                document.getElementById("deviceAuthResponse").innerHTML=("Response : "+response);
                document.getElementById("usercode").innerHTML=(user_code);
                document.getElementById("veriuri").innerHTML=(verification_uri);
		document.getElementById("barcode").src="https://api.qrserver.com/v1/create-qr-code/?data="+verification_uri_complete+"&amp;size=100x100";

		poll(tokenRequest,240000,6000,deviceCode)


                
            } else{
                console.log(this.responseText);
            }
    };
    console.log("Authorization Request Sent");
    
    xmlhttp.send(data);	
        
}

function tokenRequest(deviceCode) {


	console.log("Identity Received");
	var data1 = null;
        var xmlhttp1 = new XMLHttpRequest();
		
    xmlhttp1.open("POST", "https://localhost:9443/oauth2/token?client_id=8xlu351YUiW6sNStsKAfZoScRUEa&device_code="+deviceCode+"&grant_type=urn:ietf:params:oauth:grant-type:device_code");
        xmlhttp1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp1.onreadystatechange = function() {
            
            if (this.readyState === 4 && this.status === 200) {
                console.log("Token Response Received")
                var response1 = this.responseText;
                var json1 = JSON.parse(response1);
                var access_token = json1.access_token;
                console.log(access_token)
                document.getElementById("tokenResponse").innerHTML=("Response : "+response1);
                document.getElementById("tvblock1").style.display="none";
                document.getElementById("tvblock2").style.display="none";
                document.getElementById("tvblock3").style.display="block";
                

                
            } else{
                console.log(this.responseText);
                var response1 = this.responseText;
                var json2 = JSON.parse(response1);
                var resp = json2.error_description;
                if (resp == "authorization_pending") {
                    document.getElementById("tokenResponse").innerHTML=("Response :  "+response1);
		    document.getElementById("authresp").innerHTML=("Authorization Pending")
		    document.getElementById("tvblock1").style.display="none";
                    document.getElementById("tvblock2").style.display="block";
                    document.getElementById("tvblock3").style.display="none";
                }else if (resp == "slow_down") {
                    document.getElementById("tokenResponse").innerHTML=("Response :  "+response1); 
		    document.getElementById("authresp").innerHTML=("slow_down")
		    document.getElementById("tvblock1").style.display="none";
                    document.getElementById("tvblock2").style.display="block";
                    document.getElementById("tvblock3").style.display="none";
                }
            }
    };
    console.log("Token has Request Sent");
    
        xmlhttp1.send(data1);
}

// The polling function
function poll(fn, timeout, interval,code) {
    var endTime = Number(new Date()) + (timeout || 2000);
    interval = interval || 100;

    var checkCondition = function(resolve, reject) {
        // If the condition is met, we're done! 
        var result = fn(code);
        if(result) {
            resolve(result);
        }
        // If the condition isn't met but the timeout hasn't elapsed, go again
        else if (Number(new Date()) < endTime) {
            setTimeout(checkCondition, interval, resolve, reject);
        }
        // Didn't match and too much time, reject!
        else {
            reject(new Error('timed out for ' + fn + ': ' + arguments));
        }
    };

    return new Promise(checkCondition);
};

</script>

<body>
<div class="row">
  <div class="column" id="appside" style="background-image: url(tv1.png); background-repeat: no-repeat; background-size: 98% 100%;"">
            <div id="div1" class="row">
                <div style="text-align: center;">
                    <div id="tvblock1" style="display:block; ">
                            <h2 id="topic1" style="text-align:center; vertical-align:center">Device Flow Login</h2>
                            <p id="topic2"style="text-align:center;" class="lead">Login to your device </p>
			    <hr id="topic3" class="m-t-30 m-b-30">
                            <p id="topic4"style="text-align:center;">You can use verification URI and user code for login or you can scan the QR code for login.</p>
                            <p id="topic5"style="text-align:center;">Please use your secondary device to login.</p>
                            <button id="button1" class="button" onClick="deviceAuthorization()">Login</button>
			    <p id="topic6"style="text-align:center;"> Powered by WSO2</p>
                    </div>
		    <div id="tvblock2" style="display:none;">
			<h2 id="topic1" style="text-align:center; vertical-align:center">Device Flow Login</h2>
			<p id="topic3"style="text-align:center;">You can use verification URI and user code for login or you can scan the QR code for login.</p>
			<div class="row">
			<div id="user" class="column" style="height: 35vh;">
			    <p style="color: black">User Code :</p>
			    <p id="usercode" style="background-color: #3CBC8D; color: white;"></p>
			    <p style="color: black">Verification URI :</p>
			    <p id="veriuri" style="background-color: #3CBC8D; color: white;"></p>
			</div>
			<div id="QR" class="column" style="height: 35vh;">
			    <img id='barcode' 
            			src="" 
            			alt="" 
            			title="Verification URI complete" /> 
			</div>
			</div>
			<div class="row">
				<div id="load" class="loader"></div>
				<p id="authresp"style="text-align:center;"></p>
			</div>
		    </div>
		    <div id="tvblock3" style="display:none;">
			<h2 id="topic1" style="text-align:center; vertical-align:center">Device Flow Login</h2>
			<p id="topic7"style="text-align:center;">Login successfull.</p>
		    </div>
		</div>
	    </div>
  	</div>
  <div id="devMode"class="column" style="background-color:black;">
    <p style="color:white; text-align: center; font-size: 25px;">Developer Mode</p>
    <p id="deviceAuthReq" style="color:white;"></p>
    <p id="deviceAuthResponse" style="color:gray;"></p>
    <p id="tokenResponse" style="color:white;"></p>
  </div>
</div>
</body>
</html>

