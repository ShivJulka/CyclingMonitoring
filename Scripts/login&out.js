import { ip } from './serverAddress';


function login() {
  let xhr = new XMLHttpRequest();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let params = "username=" + username + "&password=" + password;
  xhr.open("POST", ip()+"/Cycling/login", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let response = xhr.responseText;
      if (response == "success") {
        window.location.href = "home.php";
      } else {
        alert("Invalid Login Credentials.");
      }
    }
  }
  xhr.send(params);
}

function logout() {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "logout.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let response = xhr.responseText;
      if (response == "success") {
        window.location.href = "login.php";
      } else {
        alert("Logout Failed.");
      }
    }
  }
  xhr.send();
}