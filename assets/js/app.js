$(document).ready(function () {
  var api = "EFpmfS0tkulMhfgMKidEgbG0MutwWY6A";
  var initQuery = "bird box";

  var categoryArray = ["Movies", "Television", "Music", "Sports", "Geography", "Animals"];
  function printCategories(arr) {
    for (i = 0; i < arr.length; i++) {
      newLi = $("<li>");
      newLi.text(arr[i]);
      newLi.attr("data-array-index", i)
      $("#exploreUl").append(newLi);
    }
  }
  function queryAPI(query) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
      query + "&limit=10&api_key=" + api;
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // After data comes back from the request
      .then(function (response) {
        // storing the data from the AJAX request in the results variable
        var results = response.data;
        // write title to HTML
        var titleRow =  '<div class="row px4pc mt-5">';
            titleRow += '<div class="col-12 row-title">';
            titleRow += '<h4>' + query + '</h4>';
            titleRow +=  '</div></div>';
        var newSection = $("<section id='" + query + "'>");
            newSection.addClass("center slider");

        // Looping through each result item
        for (var i = 0; i < results.length; i++) {
          var newDiv = $("<div>");
          newDiv.addClass("pr-1");
          var newImg = $("<img>");
          newImg.attr("data-still", results[i].images.fixed_height_still.url);
          newImg.attr("data-animated", results[i].images.fixed_height.url);
          var stillSrc = newImg.attr("data-still");
          newImg.attr("src", stillSrc);
          newImg.addClass("newImgs");
          newDiv.append(newImg);
          
          $(newSection).prepend(newDiv);
          
        }
        $(newSection).slick({
          
          infinite: true,
          speed: 300,
          slidesToShow: 1,
          variableWidth: true
        });
        
        $("#gifWrapper").prepend(newSection);
        $("#gifWrapper").prepend(titleRow);
        
      });
      
  }
  // mouse hover effects 
  $(document.body).on('mouseenter', '.newImgs', function () {       
    $(this).addClass('transition');
    newSrc = $(this).attr("data-animated");
    $(this).attr("src", newSrc);   
  });
  $(document.body).on('mouseleave', '.newImgs', function () {    
    $(this).removeClass('transition');
    newSrc = $(this).attr("data-still");
    $(this).attr("src", newSrc);    
  });  
  // search button 
  $("#searchButton").on("click", function () {
    var value = $("#searchField").val();
    categoryArray.push(value);
    $("#exploreUl").empty();
    printCategories(categoryArray)
    $("#searchField").val("");
    queryAPI(value);
  });
  // search field Enter
  $("#searchField").on('keypress', function (e) {
    if (e.which == 13) {
      e.preventDefault();
      $("#searchButton").click();
    }
  });
  // initialize 
  function initCategories() {
    for(i=0;i<categoryArray.length;i++){
      queryAPI(categoryArray[i]);
    }
  }
  initCategories();
  printCategories(categoryArray);    
});
