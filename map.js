var map;
var myLatLng= {lat: 25.047729, lng: 121.516951};

function initMap(){
  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 16
  });
  var user_marker = new google.maps.Marker({
    position: myLatLng,
    map: map
  });
  
}

