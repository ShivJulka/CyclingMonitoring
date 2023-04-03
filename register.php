<?php
/*	require('connect.php');
    // If the values are posted, insert them into the database.
    if (isset($_POST['username']) && isset($_POST['password'])){
        $username = $_POST['username'];
	    $email = $_POST['email'];
        $password = $_POST['password'];


        $mdHash = md5($password);
 
        $query = "INSERT INTO `users` (username, password, email) VALUES ('$username', '$mdHash', '$email')";
        $result = mysqli_query($connection, $query);
        if($result){
            $smsg = "User Created Successfully.";
        }else{
            $fmsg ="User Registration Failed";
        }
    }
    */?>
    
<html>
<head>

	<title>Registeration Page</title>
	

 <link rel="stylesheet" href="mystyle.css">
 
  <meta charset="UTF-8">
  <title>Activity Tracker</title>

</head>
<body>
<script src="Scripts/register.js"></script>


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
      
    <h2 class="">Please Register</h2>
       
	  <input type="text" name="username" class="inputLogin" placeholder="Username" required>
      <input type="email" name="email" id="inputEmail" class="inputLogin" placeholder="Email address" required autofocus>
      <input type="password" name="password" id="inputPassword" class="inputLogin" placeholder="Password" required>
      
		    <div class="checkbox">
          <label>
            <input type="checkbox" value="remember-me" required> 
			<a onclick="window.location.href='./settingPages/tAndC.html'">Accept Terms and Condtions</a>
          </label>
        </div>
        <button class="loginButton" type="submit" onclick="registerUser" >Register</button>
        
      </form>
</div>

<div class="signUpContainer">
	<form class="loginSubContain">
		<h1 class="h2_login">Have An Account?</h1>
		<p>Login To An Existing Account</p>
		<button onclick="window.location.href='login.php'" class="signupButton" type="button">Login</button>
	</form>
</div>


</body>

</html>