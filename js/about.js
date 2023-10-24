$(document).ready(function() {

  if (localStorage.getItem("user") === null) {
    $(".loginLink").show();
    $(".logoutLink").hide();
    $(".profileLink").hide();
  } else {
    $(".loginLink").hide();
    $(".logoutLink").show();
    $(".profileLink").show();
  };
});

  




