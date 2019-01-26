$(document).ready(function () {
  var api = "EFpmfS0tkulMhfgMKidEgbG0MutwWY6A";
  var query = "netflix";
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    query + "&limit=10&api_key=" + api;

  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // After data comes back from the request
    .then(function (response) {
      console.log(queryURL);

      console.log(response);
      // storing the data from the AJAX request in the results variable
      var results = response.data;

      // Looping through each result item
      for (var i = 0; i < results.length; i++) {

        // Creating and storing a div tag
        var newLi = $("<li>");
        newLi.addClass("d-inline pr-1");
        // Creating a paragraph tag with the result item's rating
        // var p = $("<p>").text("Rating: " + results[i].rating);

        // Creating and storing an image tag
        var newImg = $("<img>");
        // Setting the src attribute of the image to a property pulled off the result item

        newImg.attr("data-still", results[i].images.fixed_height_still.url);
        newImg.attr("data-animated", results[i].images.fixed_height.url);
        var stillSrc = newImg.attr("data-still");
        newImg.attr("src", stillSrc);
        newImg.addClass("newImgs");


        // Appending the paragraph and image tag to the animalDiv
        // newDiv.append(p);
        newLi.append(newImg);

        // Prependng the animalDiv to the HTML page in the "#gifs-appear-here" div
        $("#gifRow1").prepend(newLi);
      }
    });
  $(document.body).on('mouseenter', '.newImgs', function () {
    $(this).addClass('transition');
    newSrc = $(this).attr("data-animated");
    $(this).attr("src", newSrc)
  });
  $(document.body).on('mouseleave', '.newImgs', function () {
    $(this).removeClass('transition');
    newSrc = $(this).attr("data-still");
    $(this).attr("src", newSrc)
  });

});
