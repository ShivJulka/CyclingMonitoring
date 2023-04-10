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

  console.log("Registering User");
  console.log(username);
  console.log(email);
  console.log(password);
  console.log(age);
  console.log(height);
  console.log(weight);

  const formData = new FormData();
  formData.username= username;
  formData.email= email;
  formData.password= password;
  formData.age= age;
  formData.height= height;
  formData.weight= weight;
  /*
  formData.append('email', email);
  formData.append('password', password);
  formData.append('age', age);
  formData.append('height', height);
  formData.append('weight', weight); */


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
}
