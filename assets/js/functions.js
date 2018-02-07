// Definir estas variables fuera de la función para que sean globales
let map;
let infoWindow;

/*
* Función que comenzará cuando se cargue el documento. Normalmente Google
* la agrega dentro del script como &callback=initMap, pero dado que estamos
* trabajando con jQuery parecía mejor hacer que se iniciara al cargar el sitio.
* La función también ha sido "traducida" a ES6, por cuestiones de aprendizaje.
*/
const initMap = () => {
  // La variable map será el mapa que creará el script de Google en nuestro ID map
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: {lat: -34.397, lng: 150.644}
  });

  /* InfoWindow es una función de Google que permite dibujar sobre el mapa.
  * Primero, creamos una variable que va a contener la función, para mantenerla
  * "abreviada" y luego, si el navegador cuenta con geolocalización y el usuario
  * permite que obtengamos su ubicación, le vamos pasando las opciones a la función
  * InfoWindow. 
  * Más info: https://developers.google.com/maps/documentation/javascript/infowindows?hl=es-419
  */
  infoWindow = new google.maps.InfoWindow;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }
  }
};