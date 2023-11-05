const front = "https://qanguyen.net/savory-journey/";
const back = "https://qanguyen.net/recipes-backend/";

$(document).ready(function() {
  console.log("Savory Journey v1.0.0");
  
  updateNavbar();

  fetch(back + "getAllRecipes.php")
    .then(response => response.json())
    .then(json => {
      // RECIPES (recipes.html)
      allRecipes = json.data;
      for (var i = allRecipes.length - 1; i >= 0; i--) {
        $(".recipes-list-container").append(`
          <div class="col-lg-4 col-md-6 col-sm-12">
            <div class="card recipe">
              <div class="card-image">
                <img src="assets/${allRecipes[i].image}">
              </div>
              <div class="card-text">
                <p class="card-meal-type">${allRecipes[i].type}</p>
                <h2 class="recipe-name">${allRecipes[i].recipeName}</h2>
                <p>${allRecipes[i].intro}</p>
                <button class="btn-small" onclick="openModal(${allRecipes[i].recipeId})">Details</button>
              </div>
            </div>
          </div>
        `);
      };
      // SPECIAL RECIPE (recipes.html)
      let recipe = allRecipes[Math.floor(Math.random() * json.data.length)];
      $(".special-recipe-container").append(`
        <div class="row justify-content-center">
          <h3 class="h3-header">Special Recipe</h3>
          <hr class="thin-line">
          </hr>
          <div class="special-recipe-container row justify-content-center">
            <div class="col-4 text-center">
              <img class="special-recipe-img" src="assets/${recipe.image}" alt="${recipe.recipeName}">
            </div>
            <div class="col-4 text-center">
              <div class="special-recipe-box">
                <h2 class="special-recipe-name">${recipe.recipeName}</h2>
                <p class="level">Level: ${recipe.level}</p>
              </div>
              <div class="special-recipe-detail">
                <p>${recipe.intro}</p>
                <button class="btn-small" role="button" onclick="openModal(${recipe.recipeId})">Try this out</button>
              </div>
            </div>
          </div>
        </div>
      `);
      // TODAY'S RECIPE (index.html)
      $(".todays-recipe-container").append(`
        <div class="row justify-content-center">
          <div class="card latest-recipe">
            <div class="col">
              <h2 id="todays-recipe-header">Recipe of the day</h2>
              <div class="container row mt-5">
                <div class="food-img col-lg-6 col-md-6 col-sm-12">
                  <img id="todays-recipe-img" src="assets/${recipe.image}" alt="${recipe.recipeName}">
                </div>
                <div class="recipe-text col-lg-4 col-md-6 col-sm-12 mt-3 pt-5">
                  <h2 class="recipe-name">${recipe.recipeName}</h2>
                  <p style="font-size: 1.2rem;">${recipe.intro}</p>
                  <button class="button-87" role="button" onclick="openModal(${recipe.recipeId})">Try this out</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);
      // LATEST RECIPES (index.html)
      for (var i = allRecipes.length - 1; i >= allRecipes.length - 6; i--) {
        let recipe = allRecipes[i];
        $(".latest-recipe-container").append(`
          <div class="col col-lg-4 col-md-6 col-sm-6 p-1">
            <div class="card row">
              <div class="content">
                <div class="back">
                  <div class="back-content">
                    <img class="image" src="assets/${recipe.image}" alt="${recipe.recipeName}" style="border-radius: 5px;">
                  </div>
                </div>
                <div class="front">                
                  <div class="img">
                    <div class="circle">
                    </div>
                    <div class="circle" id="right">
                    </div>
                    <div class="circle" id="bottom">
                    </div>
                  </div>          
                  <div class="front-content">
                    <small class="badge">Level: ${recipe.level}</small>
                    <div class="description">
                      <div class="title">
                        <p class="title">
                          <strong>${recipe.recipeName}</strong>
                        </p>
                      </div>
                      <button class="btn-small" onclick="openModal(${recipe.recipeId})">Explore the recipe!</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `);
      };
      // console.log(allRecipes);
    });
    
    
});

function getStarted() {
  window.location.href = front + "recipes.html";
}

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
        <div class="modal-footer"></div>
      </div>
    `);
    $("#ingredientsList").append(recipe.ingredientList.map(ingredient => `<li>${ingredient.ingredientDetail}</li>`));
    $("#directionsList").append(recipe.directionList.map(direction => `<li>${direction.directionDetail}</li>`));
    updateButtons(id);
  });  
  // load data then show the modal
  $(".myModal").modal("show");
}
  
function updateButtons(id) {
  if (localStorage.getItem("user") === null) {
    $(".modal-footer").append(`
      <button role="button" class="button-close" id="saveRecipe" data-dismiss="modal" onclick="saveRecipe(${userId}, ${id})">Add to your list</button>
      <button role="button" class="button-close" data-dismiss="modal" onclick="closeModal()">Close</button>
    `);
  } else if (localStorage.getItem("user") !== null) {
    var userId = JSON.parse(localStorage.getItem('user')).userId;
    fetch(back + `getFavRecipe.php?Id=${userId}`)
    .then(response => response.json())
    .then(json => {
      if (json.status === "OK") {
        let favRecipeIds = json.data.map(Number);
        if (favRecipeIds.includes(id)) {
          console.log("matched");
          $(".modal-footer").append(`
            <button role="button" class="button-close" id="removeRecipe" data-dismiss="modal" onclick="removeRecipe(${userId}, ${id})">Remove from your list</button>
            <button role="button" class="button-close" data-dismiss="modal" onclick="closeModal()">Close</button>
          `);
        } else {
          console.log("not matched");
          $(".modal-footer").append(`
            <button role="button" class="button-close" id="saveRecipe" data-dismiss="modal" onclick="saveRecipe(${userId}, ${id})">Add to your list</button>
            <button role="button" class="button-close" data-dismiss="modal" onclick="closeModal()">Close</button>
          `);
        }
      } else {
        console.log("no fav recipe");
        $(".modal-footer").append(`
          <button role="button" class="button-close" id="saveRecipe" data-dismiss="modal" onclick="saveRecipe(${userId}, ${id})">Add to your list</button>
          <button role="button" class="button-close" data-dismiss="modal" onclick="closeModal()">Close</button>
        `);
      }
    })
  };
}

function saveRecipe(userId, recipeId) {
  if (localStorage.getItem("user") === null) {
    window.location.href = front + "login.html";
  } else {
    let token = JSON.parse(localStorage.getItem("user")).token;
    let username = JSON.parse(localStorage.getItem('user')).username;
    let data = new FormData();
    data.append('userId', userId);
    data.append('recipeId', recipeId);
    fetch(back + "saveRecipe.php", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Username": username
      },
      body: data
    }).then(response => response.json())
    .then(json => {
      alert(json.message);
      $(".modal-footer").empty();
      updateButtons(recipeId);
    });
  }
}

function removeRecipe(userId, recipeId) {
  if (localStorage.getItem("user") === null) {
    window.location.href = front + "login.html";
  } else {
    let token = JSON.parse(localStorage.getItem("user")).token;
    let username = JSON.parse(localStorage.getItem('user')).username;
        
    let data = new FormData();
    data.append('userId', userId);
    data.append('recipeId', recipeId);
    fetch(back + "removeRecipe.php", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token,
        "Username": username
      },
      body: data
    }).then(response => response.json())
    .then(json => {
      alert(json.message);
      $(".modal-footer").empty();
      updateButtons(recipeId);
    });
  }
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

// Type Search
function typeSearch(type) {
  if (type !== "all") {
    $(".recipes-list-container").empty();
    fetch(back + "getAllRecipes.php")
    .then(response => response.json())
    .then(json => {
      // RECIPES (recipes.html)
      allRecipes = json.data;
      for (var i = allRecipes.length - 1; i >= 0; i--) {
        if (allRecipes[i].type === type) {
          $(".recipes-list-container").append(`
          <div class="col-lg-4 col-md-6 col-sm-12">
            <div class="card recipe">
              <div class="card-image">
                <img src="assets/${allRecipes[i].image}">
              </div>
              <div class="card-text">
                <p class="card-meal-type">${allRecipes[i].type}</p>
                <h2 class="recipe-name">${allRecipes[i].recipeName}</h2>
                <p>${allRecipes[i].intro}</p>
                <button class="btn-small" onclick="openModal(${allRecipes[i].recipeId})">Details</button>
              </div>
            </div>
          </div>
        `);
        } 
      };
    });
  
    $('html, body').animate({
      scrollTop: $(".recipes-list-container").offset().top
    }, 200);
  } else {
    window.location.reload();
  }
}

function moveToRecipes() {
  window.location.href = front + "recipes.html";
}

// handle logout
$('.logoutLink').on('click', function() {
  localStorage.removeItem('user');
  updateNavbar();
  alert("You have logged out!");
  window.location.href = front;
});





