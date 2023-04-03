
<html>
<head>

    <title>Login Page</title>
	
<link rel="stylesheet" href="mystyle.css">
  
  <meta charset="UTF-8">
  <title>Activity Tracker</title>

</head>

<body>
  <script type="text/javascript" src="Scripts/login&out.js"></script>


<div class="fixedBar">
            <a href="index.html" style="float: left; margin-left: 20px; font-size: 30px; font-weight: bold;">Cycling</a>
            <a href="settings.html">Settings</a>
            <a href="home.php">Record</a>
            <a href="login.php">Account</a>
            <a href="progress.php">Progress</a>
            <a href="index.html">Home</a>
        </div>

<div class="Logincontainer">
     <a href="/Website/index.html" class="titleIcon">Cycling<font color="#3cbc8c">Monitoring</font></a>
     
      <form class="loginSubContain" method="POST">

      <div class="alert alert-danger" role="alert"><span id="msg"> </span></div>

        <h2 class="">Login To Your Account</h2>

	      <input type="text" class="inputLogin"  id="username" name="username" class="" placeholder="Email" required>
        <input type="password" name="password" id="password" class="inputLogin" placeholder="Password" required>
        
        <button class="loginButton" type="button" onclick="login()">Sign In </button>
        
      </form>

</div>



<div class="signUpContainer">
	<form class="loginSubContain">
	<h1 class="h2_login">New Here?</h1>
	<p>Sign Up For Free And Expereince Flow Track</p>
	<button onclick="window.location.href='register.php'" class="signupButton" type="button">Sign Up</button>
	
	</form>
</div>



</body>

</html>
	