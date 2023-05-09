
function login(event) {

  event.preventDefault(); // prevent default form submission behavior

  console.log("login")
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;

 
 
  if ( !email || !password) {
    alert("Please fill in all fields");
    return;
  }


  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch("http://192.168.1.192:8082/Cycling/login?email="+email+"&password="+password, requestOptions)   
    .then(response => {      
      if (response.status === 200) {
            // handle successful response
            console.log('User Logged In Successfully.');
          // alert('User  Successfully.')
            //window.location.pathname = "../CyclingMonitoring/home.html";

            //console.log(response.json().username);
            response.json().then(async(json) =>{
              //console.log(json[0].username);
              localStorage.setItem("username",json[0].username);
              window.location.pathname = "../CyclingMonitoring/record.html";
            })
            //console.log(response.json());
            //localStorage.setItem("username",response.json().username);
           // window.localStorage.email(email);

            console.log(window.localStorage.email);
            console.log(localStorage.getItem("username"));
            window.location.pathname = "../CyclingMonitoring/record.html";

            // do something with response data
            //return response.json();
        } else if (response.status === 400) {
            // handle error response
            console.log('Login Failed')
            //throw new Error("User already exists");
        } else {
            // handle other error response
            console.log('Something Went Wrong.');
            throw new Error("Something Went Wrong");
        }
    })

}

function logout(event) {

  window.localStorage.removeItem("username");
  window.location.pathname = "../CyclingMonitoring/login.html";
  
}