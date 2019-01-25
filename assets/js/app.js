$(document).ready(function(){
    var api = "EFpmfS0tkulMhfgMKidEgbG0MutwWY6A";

    //javascript, jQuery
var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=" + api + "&limit=5");
xhr.done(function(data) { console.log("success got data", data); });
});
