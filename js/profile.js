// const front = "https://qanguyen.net/savory-journey/";
// const back = "https://qanguyen.net/recipes-backend/";
const front = "http://localhost:5500/";
const back = "http://localhost/recipes-backend/";

$(document).ready(function() {
  
  updateNavbar();

  var fname = JSON.parse(localStorage.getItem('user')).first_name;
  $('.profile-h1').append(fname);

  // load all faverite recipes
  var userId = JSON.parse(localStorage.getItem('user')).userId;
  fetch(back + `getFavRecipe.php?Id=${userId}`)
  .then(response => response.json())
  .then(json => {
    let favRecipeIds = json.data.map(Number);
    console.log(favRecipeIds);
    fetch(back + "getAllRecipes.php")
    .then(response => response.json())
    .then(json => {
      const recipes = json.data;

      favRecipeIds.forEach(id => {
        for (let i = 0; i < recipes.length; i++) {
          if (recipes[i].recipeId == id) {
            let recipe = recipes[i];
            $(".fav-list-container").append(`
              <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="card recipe">
                  <div class="card-image">
                    <img src="assets/${recipe.image}">
                  </div>
                  <div class="card-text">
                    <p class="card-meal-type">${recipe.type}</p>
                    <h2 class="recipe-name">${recipe.recipeName}</h2>
                    <p>${recipe.intro}</p>
                    <button class="btn-small" onclick="openModal(${id})">Details</button><button class="btn-rmv" onclick="removeRecipe(${userId}, ${id})">Remove</button>
                  </div>
                </div>
              </div>
            `);
          }
        }
      })
    });
  });
});

// function for updating navbar, if user loged in, show logout and profile link, otherwise show login link
function updateNavbar() {
  if (localStorage.getItem("user") === null) {
    $(".loginLink").show();
    $(".logoutLink").hide();
    $(".profileLink").hide();
  } else {
    $(".loginLink").hide();
    $(".logoutLink").show();
    $(".profileLink").show();
  };
}

function openModal(id) {
  fetch(back + `getRecipe.php?Id=${id}`)
  .then(response => response.json())
  .then(json => {
    let recipe = json.data;
    $(".modal-dialog").append(`
      <div class="modal-content">
        <div class="modal-body mt-5">
          <div class="row justify-content-center">
            <div class="col-lg-5 col-md-12 col-sm-12">
              <div class="modal-header">
                <h4 class="modal-title">${recipe.recipeName}</h4>
              </div>
              <img class="modal-img" src="assets/${recipe.image}" alt="${recipe.recipeName}">
              <hr class="sub-line">
              </hr>
            </div>
            <div class="col-lg-5 col-md-12 col-sm-12">
              <div class="recipe-direction">
                <div class="row">
                  <div class="col-6 text-center">
                    <p><i class="fa-solid fa-paper-plane"></i><strong> ${recipe.type}</strong></p>
                  </div>
                  <div class="col-6 text-center">
                    <p><i class="fa-solid fa-fire"></i><strong> Level: ${recipe.level}</strong></p>
                  </div>
                </div>
                <hr class="yellow-line">
                </hr>
                <div class="row">
                  <div class="col-12">
                    <h3 class="modal-subheader">Ingredients</h4>
                      <ul id="ingredientsList"></ul>
                  </div>
                  <div class="col-12">
                    <h3 class="modal-subheader">Direction</h3>
                    <ol id="directionsList"></ol>
                  </div>
                  <hr class="yellow-line">
                  <div class="col-12">
                    <h3 class="modal-savory">Savory Journey <i class="fa-solid fa-heart" style="font-size: small;"></i></h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button role="button" class="button-close" data-dismiss="modal" onclick="closeModal()">Close</button>
        </div>
      </div>
    `);
    $("#ingredientsList").append(recipe.ingredientList.map(ingredient => `<li>${ingredient.ingredientDetail}</li>`));
    $("#directionsList").append(recipe.directionList.map(direction => `<li>${direction.directionDetail}</li>`));
  });  
  // load data then show the modal
  $(".myModal").modal("show");
}

function closeModal() {
  $(".myModal").modal("hide");  
  // empty the modal dialo when closing
  $(".modal-dialog").empty();
}

// if user clicks outside of modal, empty modal
$("#myModal").on("click", function (e) {
  if (e.target.id === "myModal") {  
    $(".modal-dialog").empty();
  }
});

function removeRecipe(userId, recipeId) {
  let token = JSON.parse(localStorage.getItem("user")).token;
  let username = JSON.parse(localStorage.getItem('user')).username;
  fetch(back + "tokenValidation.php", {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
      "Username": username
    }
  }).then(response => response.json())
  .then(json => {
    if (json.status === "OK") {
      let data = new FormData();
      data.append('userId', userId);
      data.append('recipeId', recipeId);
      fetch(back + "removeRecipe.php", {
        method: "POST",
        body: data
      }).then(response => response.json())
      .then(json => {
        if (json.status === "OK") {
          alert(json.message);
          window.location.reload();
        } else { // status === "NOT OK"
          alert(json.message);
        }
      });
    } else { // invalid token
      $('.message').text(json.message);
    }
  });
}

// handle logout
$('.logoutLink').on('click', function() {
  localStorage.removeItem('user');
  updateNavbar();
  alert("You have logged out!");
  window.location.href = front;
});





