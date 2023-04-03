import { ip } from './serverAddress';


function registerUser() {
  const username = document.querySelector('#username').value;
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  const mdHash = md5(password);

  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', mdHash);

  fetch(ip()+'/Cycling/signup', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
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