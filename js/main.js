$(function(){
  
  $(".btn-small").on("click", function(){
    $("#myModal").modal("show");
  });

  $(".button-close").on("click", function(){
    $("#myModal").modal("hide");
  });
});