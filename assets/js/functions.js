const initMap = () => {
  let myPosition;
  getLocation();
  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: myPosition
  });
};

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      myPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }
    });
  } else {
    alert(`Geolocation is not supported by this browser.`);
  }
};