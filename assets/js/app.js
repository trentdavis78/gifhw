$(document).ready(function () {
  var api = "EFpmfS0tkulMhfgMKidEgbG0MutwWY6A";
  //initial array of categories 
  var categoryArray = ["Movies", "Television", "Music", "Sports", "Geography", "Animals"];
  // prints out categories when called
  function printCategories(arr) {
    for (i = 0; i < arr.length; i++) {
      newLi = $("<li>");
      var cleanString = removeSpecialChars(arr[i]);
      cleanString = cleanString.toLowerCase();
      newLi.text(cleanString);
      newLi.attr("data-array-index", i);
      divId = camelize(cleanString);      
      newLi.attr("data-div-id", divId)
      $("#exploreUl").append(newLi);
    }
  }
  // api query to pull images for rows 
  function queryAPI(query) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
      query + "&limit=20&api_key=" + api;
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // After data comes back from the request
      .then(function (response) {        
        var results = response.data;
        query = camelize(query);
        query = query.toLowerCase();
        cleanString = removeSpecialChars(query);
        
        // write title to HTML
        var titleRow =  '<div id="' + cleanString + '" class="row px4pc pt-5">';
            titleRow += '<div class="col-12 row-title">';
            titleRow += '<h4>' + cleanString + '</h4>';
            titleRow +=  '</div></div>';
        var sliderSection = $("<section>");
            sliderSection.addClass("center slider");
        var fullscreenSection = $("<section class='fullscreen' id='" + cleanString + "FS'>");
        var fssHtml = "<i data-section-id='" + cleanString + "' class='fas fa-times'></i>";
            fssHtml += "<div id='fssMainContent'></div>";
            fullscreenSection.html(fssHtml);

        // Looping through each result item and spitting out HTML
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
          var overlayDiv = $("<div>");
          overlayDiv.addClass("overlayDiv");
          var width =  results[i].images.fixed_height.width;
          overlayDiv.css({"width": width});
          var title = cleanTitle(results[i].title);
          var html = "<div class='overlayContent'><h5>" + title + "</h5>";   
          html += "<span class='maturity'>" +  results[i].rating  + "</span>";
          html += "<svg class='down-arrow' data-gif-id='" + results[i].id + "' data-section-id='" + cleanString + "' width='45px' height='15px'><polyline fill='none' stroke='#FFFFFF' stroke-width='1' stroke-miterlimit='10' points='0.846,1.404 21.783,13.537 42.833,1.404 '/></svg>";
          html += "</div>";
          overlayDiv.html(html);          
          newDiv.append(overlayDiv);
          $(sliderSection).prepend(newDiv);
          
        }
        // attach slick slider to the row
        $(sliderSection).slick({          
          infinite: true,
          speed: 300,
          slidesToShow: 1,
          variableWidth: true
        });
        // prepend all HTML to divs
        $("#gifWrapper").prepend(fullscreenSection);
        $("#gifWrapper").prepend(sliderSection);
        $("#gifWrapper").prepend(titleRow);
      });
      
  }  
  // camelize search strings 
  function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }
  // remove special chars from strings
  function removeSpecialChars(str) {
    str = str.replace(/[^a-zA-Z 0-9]+/g,"");
    return str;
    }
  // remove "GIF" and "By.." from Title
  function cleanTitle(str) {
    if(str.indexOf("by ") > 0){
      str = str.substr(0, str.lastIndexOf("by "));
    }          
    str = str.replace(/gif/gi, " ");
    return str;
  }
  // mouse hover effects 
  $(document.body).on('mouseenter', '.overlayDiv', function () {       
    $(this).addClass('transition fadeIn');
    $(this).siblings().addClass('transition');
    newSrc = $(this).siblings().attr("data-animated");
    $(this).siblings().attr("src", newSrc);    
    
  });  
  $(document.body).on('mouseleave', '.overlayDiv', function () {       
    $(this).removeClass('transition fadeIn');
    $(this).siblings().removeClass('transition');
    newSrc = $(this).siblings().attr("data-still");
    $(this).siblings().attr("src", newSrc);        
     
  });
  $(document.body).on('click', '.down-arrow', function () {    
    $(".fullscreen").fadeOut();
    $(".overlayDiv").addClass("transitionDisable");   
    $(".slick-slide").addClass("transitionDisable");  
    var gifID =  $(this).attr("data-gif-id");      
    var sectionID = $(this).attr("data-section-id");    
    fullscreenQuery(gifID, sectionID);
    $("#" + sectionID + "FS").fadeIn();
    var targetOffset = $("#" + sectionID ).offset().top + 200;
      $('html, body').animate({
        scrollTop: targetOffset
    }, 500);
  });
  $(document.body).on('click', '.fa-times', function () {      
    $(".overlayDiv").removeClass("transitionDisable");   
    $(".slick-slide").removeClass("transitionDisable");      
    var sectionID = $(this).attr("data-section-id");
    $("#" + sectionID + "FS").fadeOut();
  });
  $(document.body).on('click', '#exploreUl li', function () {      
    var divId = $(this).attr("data-div-id");
    var targetOffset = $("#" + divId).offset().top - 60;
      $('html, body').animate({
        scrollTop: targetOffset
    }, 500);
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
  // fullscreen api call 
  function fullscreenQuery(gifID, sectionID) {
    var queryURL = "https://api.giphy.com/v1/gifs/" +
    gifID + "?api_key=" + api;
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    // After data comes back from the request
    .then(function (response) { 
      var result = response.data;
      var title = cleanTitle(result.title);
      var size =parseInt(result.images.original.size)/1000000;
      size = Math.round(size * 100) / 100;
      var options = { year: 'numeric', month: 'long', day: 'numeric' };
      var date = new Date(result.import_datetime);
      date = date.toLocaleDateString("en-US", options);
      console.log(result);
      var fssMCHtml = "<div id='fssMCDesc'><h1>" + title +"</h1>";
          fssMCHtml += "<h2>Rated <span class='maturity fsMaturity'>" + result.rating + "</span>"
          fssMCHtml += "<h4>Source: ";
          fssMCHtml += "<a href='" + result.source_post_url + "' target='_blank'>" + result.source_tld +"</a></h4>";
          fssMCHtml += "<h6>Uploaded: " + date  + "</h6>";
          fssMCHtml += "<h6>Dimensions: " + result.images.original.width + " x " +  result.images.original.height + " px</h6>";
          fssMCHtml += "<h6>Size: " + size + " MB</h6>";          
          fssMCHtml += "</div>";
          fssMCHtml += "<div id='fssMCImg'><div id='ImgGradient'></div><img src='" + result.images.original.url+ "'></div>";
      $("#" + sectionID + "FS").find("#fssMainContent").html(fssMCHtml);
    });
    
  }
  // initialize 
  function initCategories() {
    for(i=0;i<categoryArray.length;i++){
      queryAPI(categoryArray[i]);
    }
  }
  initCategories();
  printCategories(categoryArray);    
});
