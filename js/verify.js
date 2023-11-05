// const front = "https://qanguyen.net/savory-journey/";
const back = "https://qanguyen.net/recipes-backend/";
const front = "http://localhost:5500/";
// const back = "http://localhost/recipes-backend/";

$(document).ready(function () {
  $(".verify-form").on("submit", function (e) {
    e.preventDefault();

    let userCode = $("#userCode").val();
    let email = new URLSearchParams(window.location.search).get('email');

    if (!userCode) {
      $('.message').text('Please enter your verification code.');
      return;
    }

    let verification = new FormData();
    verification.append('userCode', userCode);
    verification.append('email', email);

    fetch(back + "verifyEmail.php", {
      method: "POST",
      body: verification
    }).then(response => response.json())
    .then(json => {
      if (json.status === "OK") {
        console.log(json.message);
        alert("Your email has been verified. Please login.");
        window.location.href = front + "login.html";
      } else { // status === "NOT OK"
        $('.message').text(json.message);
      }
    });
  });

});

function move(page) {
  window.location.href = front + page + ".html";
}