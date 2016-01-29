// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .

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
  window.setInterval(CheckIdleTime, 100);
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



  $('body').on('click', 'li a', function(event) {
    event.preventDefault();
    $('#player *').remove();
    var song_id = $(this).attr('id');
    var template = Handlebars.compile($('#player-template').html());
    $('#player').append(template({spotify_uri: song_uri}))
  })
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
  var template = Handlebars.compile($('#song-template').html());
  var i
  $('div#results').append('<ul></ul>');
  for (i = 0; i < resultsToShow; i++) {
    // $('ul').append("<li>" + json.tracks.items[i].name + "</li>")
    console.log(json.tracks.items[i])
    song = {artist: json.tracks.items[i].artists[0].name,
            title: json.tracks.items[i].name,
            song_uri: encodeURIComponent(json.tracks.items[i].id)}
    $('ul').append(template(song));
  }
}

function removeResults() {
  $('#results *').remove();
}

function Song(artist, name, spotify_id) {
  this.artist = artist;
  this.name = name;
  this.spotify_id = spotify_id;
}
