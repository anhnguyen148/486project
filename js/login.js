var front = "https://anhnguyen148.github.io/savory-journey-website/";
var back = "https://qanguyen.net/recipes-backend/";
// var front = "http://localhost:5500/";
// var back = "http://localhost/recipes-backend/";

$(document).ready(function () {

  $(".login-form").on("submit", function (e) {
    e.preventDefault();

    let username = $("#username").val();
    let password = $("#password").val();

    if (!username) {
      $('.message').text('Please enter your username.');
      return;
    } else if (!password) {
      $('.message').text('Please enter your password.');
      return;
    }

    let user = new FormData();
    user.append('username', username);
    user.append('password', password);

    fetch(back + "login.php", {
      method: "POST",
      body: user
    })
    .then(response => response.json())
    .then(json => {
      // console.log(json);
      if (json.status === "OK") {
        localStorage.setItem("user", JSON.stringify(json.data));
        localStorage.setItem('token', JSON.stringify(json.data.token));
        window.location.href = front + "profile.html";
      } else { // status === "NOT OK"
        $('.message').text(json.message);
      }
    });
  });
});

function move(page) {
  window.location.href = front + page + ".html";
}