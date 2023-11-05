const front = "https://qanguyen.net/savory-journey/";
const back = "https://qanguyen.net/recipes-backend/";

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

    // grab a token
    fetch(back + "login.php", {
      method: "POST",
      body: user
    })
    .then(response => response.json())
    .then(json => {
      if (json.status === "OK") {
        let data = json.data;
        // validate token
        let token = json.data.token;
        fetch(back + "tokenValidation.php", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token,
            "Username": username
          }
        }).then(response => response.json())
        .then(json => {
          if (json.status === "OK") {
            localStorage.setItem("user", JSON.stringify(data));
            window.location.href = front + "index.html";
          } else { // invalid token
            $('.message').text(json.message);
          }
        });
      } else { // status === "NOT OK"
        $('.message').text(json.message);
      }
    });
  });
});

function move(page) {
  window.location.href = front + page + ".html";
}