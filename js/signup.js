const front = "https://qanguyen.net/savory-journey/";
const back = "https://qanguyen.net/recipes-backend/";

$(document).ready(function () {
  $(".signup-form").on("submit", function (e) {
    e.preventDefault();

    let fname = $("#fname").val();
    let lname = $("#lname").val();
    let email = $("#email").val();
    let username = $("#username").val();
    let password = $("#password").val();
    let passwordConfirm = $("#passwordConfirm").val();

    // if (!fname) {
    //   $('.message').text('Please enter your first name.');
    //   return;
    // }
    if (!lname) {
      $('.message').text('Please enter your last name.');
      return;
    }
    if (!email) {
      $('.message').text('Please enter your email.');
      return;
    }
    if (!username) {
      $('.message').text('Please enter your username.');
      return;
    }
    if (!password) {
      $('.message').text('Please enter your password.');
      return;
    }
    if (!passwordConfirm) {
      $('.message').text('Please confirm your password.');
      return;
    }
    if (password !== passwordConfirm) {
      $('.message').text('Passwords do not match.');
      return;
    }

    let user = new FormData();
    user.append('fname', fname);
    user.append('lname', lname);
    user.append('email', email);
    user.append('username', username);
    user.append('password', password);

    fetch(back + "signup.php", {
      method: "POST",
      body: user
    }).then(response => response.json())
    .then(json => {
      // console.log(json);
      if (json.status === "OK") {
        window.location.href = front + "verify.html?email=" + email;
        console.log(json.message);
      } else { // status === "NOT OK"
        $('.message').text(json.message);
      }
    });
  });

});

function move(page) {
  window.location.href = front + page + ".html";
}