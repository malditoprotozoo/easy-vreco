// Definir estas variables fuera de la función para que sean globales
let map;
let infoWindow;
let myPosition;

/*
* Función que comenzará cuando se cargue el documento. Normalmente Google
* la agrega dentro del script como &callback=initMap, pero dado que estamos
* trabajando con jQuery parecía mejor hacer que se iniciara al cargar el sitio.
* La función también ha sido "traducida" a ES6, por cuestiones de aprendizaje.
*/
const initMap = () => {
  $('#inputs-container').append(`<input id="origin-input" class="controls" type="text" placeholder="Enter an origin location">
    <input id="destination-input" class="controls" type="text" placeholder="Enter a destination location">
    <div id="mode-selector" class="controls"> <input type="radio" name="type" id="changemode-walking" checked="checked">
    <label for="changemode-walking">Walking</label> <input type="radio" name="type" id="changemode-transit">
    <label for="changemode-transit">Transit</label> <input type="radio" name="type" id="changemode-driving">
    <label for="changemode-driving">Driving</label>`);
  // La variable map será el mapa que creará el script de Google en nuestro ID map
  let map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,
    zoom: 18,
    center: {lat: -34.397, lng: 150.644}
  });

  var image = {
    url: "https://i.imgur.com/FrfPvsG.png",
    scaledSize: new google.maps.Size(82, 82)
  };
  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    icon: image,
    animation: google.maps.Animation.DROP,
    position: {
      lat: 59.909144,
      lng: 10.7436936
    }
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
      myPosition = pos;
      let geocoder = new google.maps.Geocoder;
      geocodeLatLng(geocoder, map, infoWindow);
      marker.setPosition(pos);
      marker.setTitle('Location found');
      //infoWindow.open(map);
      map.setCenter(pos);
    }, function() {
      const handleLocationError = (browserHasGeolocation, infoWindow, pos) => {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
          'Error: The Geolocation service failed.' :
          'Error: Your browser doesn\'t support geolocation.');
          infoWindow.open(map);
      };
      
      handleLocationError(true, infoWindow, map.getCenter());
    });
  };
  new AutocompleteDirectionsHandler(map);
};

// No usamos funciones flecha porque generaba conflicto con this
function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'WALKING';
  let originInput = document.getElementById('origin-input');
  let destinationInput = document.getElementById('destination-input');
  let modeSelector = document.getElementById('mode-selector');
  this.directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;
  this.directionsDisplay.setMap(map);

  let originAutocomplete = new google.maps.places.Autocomplete(
      originInput, {placeIdOnly: true});
  let destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput, {placeIdOnly: true});

  this.setupClickListener('changemode-walking', 'WALKING');
  this.setupClickListener('changemode-transit', 'TRANSIT');
  this.setupClickListener('changemode-driving', 'DRIVING');

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(destinationInput);
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
}

// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function(id, mode) {
  let radioButton = document.getElementById(id);
  let me = this;
  radioButton.addEventListener('click', function() {
    me.travelMode = mode;
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
  let me = this;
  autocomplete.bindTo('bounds', this.map);
  autocomplete.addListener('place_changed', function() {
    let place = autocomplete.getPlace();
    if (!place.place_id) {
      window.alert("Please select an option from the dropdown list.");
      return;
    }
    if (mode === 'ORIG') {
      me.originPlaceId = place.place_id;
    } else {
      me.destinationPlaceId = place.place_id;
    }
    me.route();
  });

};

AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  let me = this;

  this.directionsService.route({
    origin: {'placeId': this.originPlaceId},
    destination: {'placeId': this.destinationPlaceId},
    travelMode: this.travelMode
  }, function(response, status) {
    if (status === 'OK') {
      me.directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
};

const geocodeLatLng = (geocoder, map, infowindow) => {
  let posStr = myPosition.lat + ',' + myPosition.lng;
  let latlngStr = posStr.split(',', 2);
  var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        $('#origin-input').val(results[0].formatted_address);
        //infowindow.open(map, marker);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
};