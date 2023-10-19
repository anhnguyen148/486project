$(document).ready(function () {
  console.log("Savory Journey v1.0.0");

  fetch("http://localhost:3001/recipes")
    .then(response => response.json())
    .then(json => {
      // RECIPES (recipes.html)
      json.data.forEach(recipe => {
        $(".recipes-list-container").append(`
            <div class="col-lg-4 col-md-6 col-sm-12">
              <div class="card recipe">
                <div class="card-image">
                  <img src="assets/${recipe.image}">
                </div>
                <div class="card-text">
                  <p class="card-meal-type">${recipe.type}</p>
                  <h2 class="recipe-name">${recipe.recipeName}</h2>
                  <p>${recipe.intro}</p>
                  <button class="btn-small" onclick="openModal(${recipe.recipeId})">Details</button>
                </div>
              </div>
            </div>
          `);
      });
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
      for (var i = json.data.length - 1; i >= json.data.length - 3; i--) {
        let recipe = json.data[i];
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
    });



});





