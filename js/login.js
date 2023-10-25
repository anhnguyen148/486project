$(document).ready(function () {
  $(".login-form").on("submit", function (e) {
    e.preventDefault();
    let username = $("#username").val();
    let password = $("#password").val();
    let user = {
      username: username,
      password: password
    };
    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(json => {
      console.log(json);
      if (json.message === "success") {
        localStorage.setItem("user", JSON.stringify(json.data));
        window.location.href = "https://anhnguyen148.github.io/savory-journey-website/profile.html";
      } else {
        alert("Invalid email or password");
      }
    });
  });
});

function move(page) {
  window.location.href = "https://anhnguyen148.github.io/savory-journey-website/" + page + ".html";
}