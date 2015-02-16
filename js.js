var defaultAlbum = "72157633136277722";
var getDefaultUrl = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=" + apiKey + "&photoset_id=" + defaultAlbum + "&format=json&nojsoncallback=1";
var getSetUrl = getDefaultUrl;

$(document).ready(function() {
  var albumNumberFromChrome = null;
  getAlbumNumberAndUpdatePhoto();

  chrome.storage.onChanged.addListener(function(response, namespace) {
    getAlbumNumberAndUpdatePhoto();
  });

  $('[name=album_number]').bind('input', function() {
    chrome.storage.sync.set({ 'albumNumber': $(this).val() }, function(){
    });
  });

  setInterval(function () {
    updatePhoto(getSetUrl);
  }, 30000);

  $('.help-button').click(function() {
    if ($('.help').css('display') === 'none') {
      $('.help').show();
    } else {
      $('.help').hide();
    }
  });
});

function updatePhoto(setUrl) {
  $.get(setUrl)
    .success(function(data) {
      if (data['stat'] === 'fail') {
        getSetUrl = getDefaultUrl;
        updatePhoto(getSetUrl);
        $('h4').show();
      } else {
        if (setUrl !== getDefaultUrl) { $('h4').hide(); }
        var photos = data.photoset.photo;
        var randomPhoto = selectRandomPhoto(photos);
        replacePhoto(randomPhoto.id);
      }
    });
}

function replacePhoto(photoId) {
  var getPhotoUrl = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + apiKey + "&photo_id=" + photoId + "&format=json&nojsoncallback=1";
  $.get(getPhotoUrl)
    .success(function(data) {
      var photoSrc = data.sizes.size[8].source;
      var imageTag = "<img src='" + photoSrc + "'>";
      $(".photo").html(imageTag);
    });
}

function selectRandomPhoto(photos) {
  return photos[Math.floor(Math.random()*photos.length)];
}

function getAlbumNumberAndUpdatePhoto() {
  chrome.storage.sync.get(['albumNumber'], function(response){
    var chromeObjest = response;
    albumNumberFromChrome = response['albumNumber'];
    if (albumNumberFromChrome) {
      $('[name=album_number]').val(albumNumberFromChrome);
      getSetUrl = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=" + apiKey + "&photoset_id=" + albumNumberFromChrome + "&format=json&nojsoncallback=1";
    } else {
      getSetUrl = getDefaultUrl;
    }
    updatePhoto(getSetUrl);
  });
}
