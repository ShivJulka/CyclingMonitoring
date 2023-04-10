
function login() {

  console.log("login")
  let xhr = new XMLHttpRequest();
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let params = "username=" + username + "&password=" + password;

  console.log(username);
  console.log(password);

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
 /* fetch("192.168.1.192:8082/Cycling/login?email=test@gmail.com&password=123", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
*/


  xhr.open("GET","192.168.1.192:8082/Cycling/login", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (xhr.status == 200) {
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
  xhr.open("get", "logout.php", true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onreadystatechange = function() {
    if (xhr.status == 200) {
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