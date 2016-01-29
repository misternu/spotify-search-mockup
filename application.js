$(function() {
  $('input').focus();
  $('input').keyup(function (e) {
    var query = $('input').val()
    if (e.keyCode == 13 && query != '') {
      trackSearch(query) //Search for the track
        // .done(showFirstAlbumCover);
        .done(showFirstFiveSongs);
    } else if (e.keyCode == 27) {
      $('input').val(''); //Clear the input on escape
    }
  })
  var lastSearch = "";
  var idleCounter = 0;
  window.setInterval(CheckIdleTime, 250);
  $('input').on('input', function() {
    idleCounter = 0;
  })
  function CheckIdleTime() {
    idleCounter++;
    var query = $('input').val();
    // console.log(query);
    if (query == '') {
      removeResults();
    } else if (idleCounter > 2 && query != lastSearch) {
      lastSearch = query;
      trackSearch(query)
        .done(showFirstFiveSongs);
    }
  }
})

function trackSearch(query) {
  return $.ajax({url: "https://api.spotify.com/v1/search",
                 method: 'GET',
                 data: {q: query,
                 type: 'track'}})
}

function showFirstAlbumCover(json) {
  removeResults();
  $('div#results').append("<img src='" + json.tracks.items[0].album.images[1].url + "'>")
}

function showFirstFiveSongs(json) {
  removeResults();
  var resultsToShow = Math.min(json.tracks.items.length, 5);
  var i
  $('div#results').append('<ul></ul>');
  for (i = 0; i < resultsToShow; i++) {
    $('ul').append("<li>" + json.tracks.items[i].name + "</li>")
  }
}

function removeResults() {
  $('#results *').remove();
}
