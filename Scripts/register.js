//import { ip } from './serverAddress';


function registerUser(event) {
  
  event.preventDefault(); // prevent default form submission behavior

  console.log("registerUser");
  const username = document.querySelector('input[name="username"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;
  const age = document.querySelector('input[name="age"]').value;
  const height = document.querySelector('input[name="height"]').value;
  const weight = document.querySelector('input[name="weight"]').value;

  if (!username || !email || !password) {
    alert("Please fill in all fields");
    return;
  }

  var requestOptions = {
    method: 'POST',
    redirect: 'follow'
  };

  fetch("http://192.168.1.192:8082/Cycling/signup?username="+username+"&email="+email+"&password="+password+"&age="+age+"&height="+height+"&weight="+weight, requestOptions)
    .then(response => {
        if (response.status === 200) {
            // handle successful response
            console.log('User Created Successfully.');
            alert('User Created Successfully.');
            //console.log(response.json().username);
            
            //console.log(response.json());
            //localStorage.setItem("username",response.json().username);
           // window.localStorage.email(email);

           localStorage.setItem("username",username);
           window.location.pathname = "../CyclingMonitoring/record.html";

            // do something with response data
            return response.json();
        } else if (response.status === 400) {
            // handle error response
            console.log('User Registration Failed. User already exists');
            alert('User Registration Failed. User already exists')
            throw new Error("User already exists");
        } else {
            // handle other error response
            console.log('Something Went Wrong.');
            throw new Error("Something Went Wrong");
        }
    })
    .then(data => {
        // handle response data
        console.log(data);
    })
    .catch(error => console.log('error', error));

    /*

    

  const formData = new FormData();
  formData.username= username;
  formData.email= email;
  formData.password= password;
  formData.age= age;
  formData.height= height;
  formData.weight= weight;


  fetch("http://192.168.1.192:8082/Cycling/signup", {
  method: 'POST', // Change method from GET to POST
  body: formData
})
.then(response => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error("Network response was not ok");
  }
})
.then(data => {
  if (data.success) {
    alert('User Created Successfully.');
  } else {
    alert('User Registration Failed.');
  }
})
.catch(error => {
  console.error(error);
  alert('An error occurred while processing your request.');
});
*/
}
