var searchRequest = null;
var minlength = 3;
var count = 1;
var i = 1;
var timeout;

$(document).ready(function() {
    $("#showMore").hide();
    $("#backtrackBtn").hide();
    $("#movieinformation").empty();
    $("#searchBar").keyup(function() {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        i = 1;
        timeout = setTimeout(myAjaxCall, 1500);
    });
});

var myAjaxCall = function ajaxCall() {
    var keyword = document.getElementById("searchBar").value.replace(/\s/g, "&");
    var that = document.getElementById("searchBar");

    if (i == 1) {
        $("#showMore").hide();
        $("#movieinformation").empty();
        $("#showMoreDiv").show();
        $("ol").empty();
        $("#searchResults").removeAttr("style");
        $("#searchResults img").remove();
    }

    if (keyword.length >= minlength) {

        if (searchRequest != null) {
            searchRequest.abort();
        }

        searchRequest = $.ajax({
            url: 'http://www.omdbapi.com/?apikey=2d704e8c&r=json&page=' + i + "&s=" + keyword,
            type: 'GET',
            success: function(result) {
                if (result.Response == "True") {
                    for (let j = 0; j < 10; j++) {

                        if (result.Search == undefined) {
                            break;
                        }

                        if (i >= result.totalResults / 10) {
                            if (j == result.totalResults % 10) {
                                break;
                            }
                        }

                        $.ajax({
                            url: 'http://www.omdbapi.com/?apikey=2d704e8c&r=json&i=' + result.Search[j.toString()].imdbID + '&plot=short',
                            type: 'GET',
                            beforeSend: function() {},
                            complete: function() {},
                            success: function(movie) {
                                let tempID = movie.imdbID;
                                let smallTitle = movie.Title[0];
                                let flag = false;
                                if (movie.Title.length >= 35) {
                                    flag = true;
                                    for (let k = 0; k < movie.Title.length; k++) {
                                        if (movie.Title[k] == " ") {
                                            smallTitle = smallTitle + movie.Title[k + 1] + ".";
                                        }
                                    }
                                    smallTitle = "<abbr title=\"" + movie.Title + "\">" + smallTitle + "</abbr>"
                                }

                                if (!flag) {
                                    smallTitle = movie.Title;
                                }
                                $("ol").append("<li class=\"movieList\"><ul id=ul" + count + ">" +
                                    "<li style=\"font-weight:bold\">" + smallTitle + " (" + movie.Year + ")</li>" +
                                    "<li><img class=\"posterImage\" src=\"" + movie.Poster + "\"  onerror=\"imgError(this)\";></li>" +
                                    "<li class=\"more\" ><button class=\"morebtn\" id=" + tempID + ">More</button></li>" +
                                    "</ul></li>");
                                count++;
                            }
                        });
                    }
                    if (++i < result.totalResults / 10 + 1) {
                        $("#showMore").show();
                    } else {
                        $("#showMore").hide();
                    }
                } else {
                    $("#showMore").hide();
                    $("#searchResults").css({ "text-align": "center", "width": "100%" });
                    $("#searchResults").prepend("<img src=\"nomoviesfound.jpg\" width=\"400px\" max-height=\"600px\"></img>");
                }
            }
        });
    }
}

$(document).ready(function() {
    $("#showMore").click(function() {
        myAjaxCall();
    });
    $("#movielist").on('click', 'button', function() {
        let movieID = $(this).attr('id');
        $("#backtrackBtn").show();
        $.ajax({
            url: 'http://www.omdbapi.com/?apikey=2d704e8c&r=json&i=' + movieID + '&plot=full',
            type: 'GET',
            beforeSend: function() {},
            complete: function() {},
            success: function(movie) {
                $("#searchResults").hide();
                $("#showMoreDiv").hide();
                $("#movieinformation").append("<h2 class=\"onShowMore_Title\">Title: " + movie.Title + " (" + movie.Year + ")</h2>" +
                    "<p class=\"onShowMore_BasicInfo\">" + movie.Rated + " &nbsp;|&nbsp; " + movie.Runtime + " &nbsp;|&nbsp; " + movie.Genre + " &nbsp;|&nbsp; " + movie.Released + "</p><br>" +
                    "<div class=\"onShowMore_Poster\"><img src=\"" + movie.Poster + "\"></div>" +
                    "<div class=\"onShowMore_AllInfo\">" +
                    "<p><b>Plot:</b> " + movie.Plot + "</p>" +
                    "<p><b>Director:</b> " + movie.Director + "</p>" +
                    "<p><b>Writers:</b> " + movie.Writer + "</p>" +
                    "<p><b>Stars:</b> " + movie.Actors + "</p>" +
                    "<p><b>Production:</b> " + movie.Production + "</p>" +
                    "<b>Metascore:</b> " + "<span><b>" + movie.Metascore + "</span></b><p></p>" +
                    "<b>Imdb Rating:</b> " + "<span><b>" + movie.imdbRating + "/10</span></b>" +
                    "<p><b>Awards:</b> " + movie.Awards + "</p>"
                );
                if (movie.Website) {
                    $(".onShowMore_AllInfo").append("<p><a href=\"" + movie.Website + "\">" + " Visit the Website here</a></p></div>");
                }
            }
        });
    });
});

$(document).ready(function() {
    $("#backtrackBtn").click(function() {
        $("#searchResults").show();
        $("#showMoreDiv").show();
        $("#movieinformation").empty();
        $("#backtrackBtn").hide();
    });
});

function imgError(image) {
    image.onerror = "";
    image.src = "default.jpg";
    return true;
}