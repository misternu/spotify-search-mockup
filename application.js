$(function() {
  $('button').on("click", function() {
    var query = $('input').val();
    var response = $.ajax({url: "https://api.spotify.com/v1/search",
                           method: 'GET',
                           data: {q: query,
                                type: 'artist'}
                           })
      .done(function(json) {
        var response = json
        // console.log(response.artists.items[0].images[0].url)
        $('body').append("<img src='" + response.artists.items[0].images[0].url + "'>")
      })
  })
})
