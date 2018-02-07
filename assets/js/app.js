$(document).ready(function() {
  initMap();
  findMee();
});

function initMap() {
  let mapProp = {
    center: new google.maps.LatLng(51.508742,-0.120850),
    zoom: 5
  };
  let map = new google.maps.Map(document.getElementById("google-map"), mapProp);
}

function findMe(){
  var output = document.getElementById('google-map');
  // verificar si soporta geolocalizacion
  if(navigator.geolocation){
    output.innerHTML = "<p>Tu navegador soporta Geolocalizacion</p>";
  }else{
    output.innerHTML = "<p>Tu navegador no soporta Geolocalizacion</p>";
  }
  // obtener latitud y longitud
  function localizacion(posicion){
    var latitude = posicion.coords.latitude;
    var longitude = posicion.coords.longitude;

    output.innerHTML = "<p>Latitud: "+latitude+" <br> Longitud: "+longitude+"</p>";
  }
  function error(){
    output.innerHTML = "<p>No se pudo obtener tu ubicación</p>"
  }
  navigator.geolocation.getCurrentPosition(localizacion,error);
}