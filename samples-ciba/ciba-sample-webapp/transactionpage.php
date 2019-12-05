<!DOCTYPE html>
<html lang="en">
<head>
<title>Pay Here</title>
 <!-- Meta-Tags -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="css/bootstrap.css" rel="stylesheet" type="text/css" media="all"/>

<link href="css/cibahome.css" rel="stylesheet" type="text/css" media="all"/>
<link href="css/split.css" rel="stylesheet" type="text/css" media="all"/>
<link href="css/payhere.css" rel="stylesheet" type="text/css" media="all"/>
<link href="css/rotate.css" rel="stylesheet" type="text/css" media="all"/>
<link href="scss/_variables.scss" rel="stylesheet" type="text/css" media="all"/>
<link href="scss/_bootswatch.scss" rel="stylesheet" type="text/css" media="all"/>
<link href="css/nowterminal.css" rel="stylesheet" type="text/css" media="all"/>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<!------ Include the above in your HEAD tag ---------->
<!------ Include the above in your HEAD tag ---------->
 <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">

</head>

<script>
	 
	// Random number from 0 to length
const randomNumber = (length) => {
  return Math.floor(Math.random() * length)
}

// Generate Pseudo Random String, if safety is important use dedicated crypto/math library for less possible collisions!
const generateID = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(randomNumber(possible.length));
  }
  
oFormObject = document.forms['cibaForms'];
oFormObject.elements["binding_message"].value=text;




};

		 
	 
</script>
<body onload=" generateID(16)">
<section class="container">
  <div class="left-half">

	
 <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <a class="navbar-brand" href="#" >WSO2 CIBA DEMO Console</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
</nav>
<div class="container h-100" style = "position:absolute; left:100px; top:200px;>
		<div class="d-flex justify-content-center h-100" >
			<div class="user_card1" >
				<div class="d-flex justify-content-center">
					
				<div class= "brand_logo"> 
						<img src="/CIBA/Images" alt="Logo"  height=150px; width=150px style = "position:absolute; left:225px; top:10px;">
					</div>
				</div>
		
					<div  style = "position:relative; left:175px; top:20px;>
						
							<span class="input-group-text"><i class="fas fa-user">Transaction details</i></span>
						
					</div>
						<div class="d-flex justify-content-center form_container">
	                                      <form action=authenticationpage.php id="cibaForms" method="get">

<div style = "position:absolute; left:180px; top:250px;">

					
				<input type="text" name="binding_message" id="binding_message" class="form-control input_user" value="" placeholder="" readonly >

					
							<input type="text" name="user" id="user" class="form-control input_user" value=""  placeholder="User Identity">
						
							<input type="text" name="amount" id="amount" class="form-control input_user" value="" placeholder="Transaction Amount">
						
						</div>
				
						

					<button type="submit" value="Submit" class="btn login_btn">PayHere</button>
				
					 </form>
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
	    State: Waiting for User identity...</p>
	      </span>
	    </p>
	  </div>
	</div>
	  </div>
</section>
 
</body>
</html>
