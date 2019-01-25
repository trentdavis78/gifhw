$(document).ready(function(){
    var api = "EFpmfS0tkulMhfgMKidEgbG0MutwWY6A";
    // Create a request variable and assign a new XMLHttpRequest object to it.
   
      //jquery ajax method with query url and method (GET, UPDATE, DELETE) as parameters
      $.ajax({
        url: queryURL,
        method: "GET"
      })

      //promise that returns the api response
        .then(function(response) {

        //dot notation of the object that returns the imageURL
          var imageUrl = response.data.image_original_url;

          //create a new IMG element
          var catImage = $("<img>");

          //attaches two attributes to the IMG tag
          catImage.attr("src", imageUrl);
          catImage.attr("alt", "cat image");

          //prepends the img elem to the div with id images
          $("#images").prepend(catImage);
        });
});
