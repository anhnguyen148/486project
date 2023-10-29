// var front = "https://anhnguyen148.github.io/savory-journey-website/";
// var back = "https://qanguyen.net/recipes-backend/";
var front = "http://localhost:5500/";
var back = "http://localhost/recipes-backend/";

$(document).ready(function() {
  console.log("Savory Journey v1.0.0");
  
  updateNavbar();

  var userToken = JSON.parse(localStorage.getItem('token'));
  

    
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
  fetch(back + "getRecipe.php?Id=${id}")
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
                <div class="heart-container" title="Like">
                  <input type="checkbox" class="checkbox" id="favClick" onchange="isChecked(${recipe.recipeId})"/>
                  <div class="svg-container">
                    <svg viewBox="0 0 24 24" class="svg-outline" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z">
                      </path>
                    </svg>
                    <svg viewBox="0 0 24 24" class="svg-filled" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z">
                      </path>
                    </svg>
                    <svg class="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="10,10 20,20"></polygon>
                      <polygon points="10,50 20,50"></polygon>
                      <polygon points="20,80 30,70"></polygon>
                      <polygon points="90,10 80,20"></polygon>
                      <polygon points="90,50 80,50"></polygon>
                      <polygon points="80,80 70,70"></polygon>
                    </svg>
                  </div>
                </div>
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

// handle save checkbox click on recipe modal
function isChecked(id) {
  $("#favClick").on("click", function() {
    if($(this).is(":checked")){
      console.log("recipe id: " + id);
    }
    else if($(this).is(":not(:checked)")){
      console.log("Checkbox is unchecked.");
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





