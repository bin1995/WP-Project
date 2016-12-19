var map;
var jsonObject;
var myLatLng= {lat: 25.047729, lng: 121.516951};
var sitesArray;
var currentSite;
var endLocation;
var recommendNumber=5;
$(document).ready(function(){
  //jsonData = '{"state":0,"message":"Success.","sites":[{"sno":"0001","sna":"","tot":"180","sbi":"125","sarea":"","mday":"20161026135920","lat":"25.0408578889","lng":"121.567904444","ar":"","sareaen":"Xinyi Dist.","snaen":"MRT Taipei City Hall Stataion(Exit 3)-2","aren":"The S.W. side of Road Zhongxiao East Road & Road Chung Yan.","bemp":"48","act":"1"},{"sno":"0002","sna":"","tot":"48","sbi":"17","sarea":"","mday":"20161026135926","lat":"25.041254","lng":"121.55742","ar":"","sareaen":"Daan Dist.","snaen":"MRT S.Y.S Memorial Hall Stataion(Exit 2.)","aren":"Sec,4. Zhongxiao E.Rd\/GuangFu S. Rd","bemp":"30","act":"1"}]}';
  var url = location.href;
  var temp = url.split("?(");
  if(temp[1]!=null){
    var values=temp[1].split(",%20");

    myLatLng={lat: parseFloat(values[0]), lng: parseFloat(values[1])};
  }
  else{
    var watchID = navigator.geolocation.watchPosition(function(position) {
      myLatLng={lat:position.coords.latitude, lng:position.coords.longitude};
      initMap();
    });
  }

  $.getJSON('', function(jsonData) {                       
    jsonObject = jsonData;
    initMap();
  });

  
});

function initMap() {

  if(jsonObject!=null && jsonObject.state == 0){
    var distance;
    sitesArray=jsonObject.sites;

    sitesArray.sort(function(a,b){
      var aDistance = calculateDistance(myLatLng , {lat: a.lat, lng: a.lng} );
      var bDistance = calculateDistance(myLatLng , {lat: b.lat, lng: b.lng} );
      return aDistance - bDistance;
    });
    currentSite={lat: parseFloat(sitesArray[0].lat), lng: parseFloat(sitesArray[0].lng)};

  }

  drawMap();

  if(jsonObject!=null){
    var rows = document.getElementById("recommendTable").rows.length;
    if(rows > 1){
      for (var i = 0; i < recommendNumber; i++) {
        document.getElementById('recommendTable').deleteRow(1);
      }
    }
      
    for (var i = 0; i < recommendNumber; i++) {
      var table=document.getElementById('recommendTable').insertRow(i+1);
      var number=table.insertCell(0);
      var name=table.insertCell(1);
      var button=table.insertCell(2);
      number.innerHTML=i+1;
      name.innerHTML=sitesArray[i].snaen;
      button.innerHTML = ' <input type= "submit" value="go" style="color:black" onclick="goClick('+i+')" />';
    }
    
  }
  

}

function drawMap(){
  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 16
  });
  var user_marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon:"usermarker.png"
  });

  var marker ,i;
  var infowindow = new google.maps.InfoWindow();

  //draw marker
  if(sitesArray != null){
    var markerArray=["parkingplaceone.png","parkingplacetwo.png","parkingplacethree.png","parkingplacefour.png","parkingplacefive.png"];

    for (var i = 0; i < sitesArray.length; i++) {

      var siteLatLng = {lat: parseFloat(sitesArray[i].lat), lng: parseFloat(sitesArray[i].lng)};

      if(i<5){
        marker = new google.maps.Marker({
          position: siteLatLng,
          map: map,
          icon: markerArray[i]
        });
      }
      else{
        marker = new google.maps.Marker({
          position: siteLatLng,
          map: map
        });        
      }

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(sitesArray[i].snaen+"<br><br>bikeNumber: "+sitesArray[i].sbi+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; total: "+sitesArray[i].tot);
          infowindow.open(map, marker);
          map.setCenter(marker.getPosition());
        }
      })(marker, i));


    }
  }
  
}

function calculateDistance(placeStart,placeEnd){
  var radLatitude1 = placeStart.lat * Math.PI / 180;
  var radLatitude2 = placeEnd.lat * Math.PI / 180;
  var l = radLatitude1 - radLatitude2;
  var p = placeStart.lng * Math.PI / 180 - placeEnd.lng * Math.PI / 180;
  var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(l / 2), 2)+ Math.cos(radLatitude1) * Math.cos(radLatitude2)* Math.pow(Math.sin(p / 2), 2)));
  distance = distance * 6378137.0;
  distance = Math.round(distance * 10000) / 10000;

  return distance;
}

function directions(start,end) {
  var directionsService = new google.maps.DirectionsService();

  var request = {
    origin: start, 
    destination: end, 
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };
  
  directionsService.route(request, function(response, status) {
    var directionsLineArray = new Array();
    directionsLineArray.push(start);

    if (status == google.maps.DirectionsStatus.OK) {
      var stepsArray = response.routes[0].legs[0].steps;

      for (var i = 0; i < stepsArray.length; i++) {
        directionsLineArray.push(stepsArray[i].end_location);
      }
      directionsPath = new google.maps.Polyline({
        path: directionsLineArray,
        strokeColor: '#660077',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });

      directionsPath.setMap(map);

    }
  });
  
}

function endToLatlng(addr){
  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: addr },
  function (result, status) {
    if (status == google.maps.GeocoderStatus.OK) {

      endLocation = result[0].geometry.location;

      directions(myLatLng,currentSite);
      directions(currentSite,endLocation);

    } else {
      alert("搜索不到該地名!!");
      
    }
  });

}

function endClick(){
  drawMap();
  var address=document.getElementById("end").value;
  console.log(address);
  endToLatlng(address);

}

function startClick(){
  var start=document.getElementById("start").value;
  console.log(start);

  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: start },
  function (result, status) {
    if (status == google.maps.GeocoderStatus.OK) {

      var location = result[0].geometry.location;

      window.location.href="ubike.html?"+location;
      
    } else {
      alert("搜索不到該地名!!");
      
    }
  });
}

function goClick(number){
  drawMap();
  currentSite={lat: parseFloat(sitesArray[number].lat), lng: parseFloat(sitesArray[number].lng)};
  directions(myLatLng,currentSite);
  directions(currentSite,endLocation);
}
