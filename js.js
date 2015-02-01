var apiKey = "";
var photoSet = "72157650168410638";
var getSetUrl = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=" + apiKey + "&photoset_id=" + photoSet + "&format=json&nojsoncallback=1";

$(document).ready(function() {
  // getApiKey();
  updatePhoto(getSetUrl);
  setInterval(function () {
    updatePhoto(getSetUrl);
  }, 30000);
});

function updatePhoto(setUrl) {
  $.get(setUrl)
    .success(function(data) {
      var photos = data.photoset.photo;
      var randomPhoto = selectRandomPhoto(photos);
      replacePhoto(randomPhoto.id);
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

function getApiKey() {
  $.get('secrets.txt', function(data) {
      console.log(data);
    });
}
