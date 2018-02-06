$(document).ready(function() {
  initMap();
});

function initMap() {
  let mapProp = {
    center: new google.maps.LatLng(51.508742,-0.120850),
    zoom: 5
  };
  let map = new google.maps.Map(document.getElementById("google-map"), mapProp);
}