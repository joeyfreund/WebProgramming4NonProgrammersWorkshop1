var map;
var markers = [];


function load_map(div) {
  var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(43.647314, -79.386783)
  };
  map = new google.maps.Map(document.getElementById(div), mapOptions);
}


function clear_map(){
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function clear_list(){
  $('.vehicle_list_item').remove();
}


function put_marker_in_center(){
  markers.push(new google.maps.Marker({
    position: map.getCenter(),
    map: map,
    icon: 'http://maps.google.com/mapfiles/arrow.png',
    animation: google.maps.Animation.DROP,
    title: 'You are here!'
  }));  
}


function show_vehicles_on_map(vehicles){
  // Do stuff with each vehicle ...
  $.each(vehicles, function(i, vehicle){
    var vehicleLocation = new google.maps.LatLng(vehicle.lat, vehicle.lng);

    // Add the marker to the map
    markers.push(new google.maps.Marker({
      position: vehicleLocation,
      map: map,
      icon: get_marker_icon(i),
      animation: google.maps.Animation.DROP,
      title: vehicle.long_name
    }));
  });
}


function get_marker_icon(index){
  // We'll label our markers as A,B,C ...
    var letter = String.fromCharCode("A".charCodeAt(0) + index);
    return "http://maps.google.com/mapfiles/marker" + letter + ".png";
}


function show_vehicles_in_list(vehicles){
  // For each vehicle in vehicles ...
  $.each(vehicles, function(i, vehicle){

    // Build the list-item for this vehicle
    var html = '<div class="vehicle_list_item">';
    html += '<img src="' + get_marker_icon(i) + '" class="float-left"/>';
    html += '<p>' + vehicle.long_name + '<br />'
    html += '<span class="time-estimate">' + calculate_distance_in_minutes(map.getCenter(), vehicle) + ' min</span></p>';
    html += '</div>';
    // Append the list-item to the list
    $('#list-container').append($(html).fadeIn());
  });
}


function calculate_distance_in_minutes(from, vehicle){
    var vehicleLocation = new google.maps.LatLng(vehicle.lat, vehicle.lng);
    var vehicleSpeed = vehicle.velocity; // In KM/h
    var distance = google.maps.geometry.spherical.computeDistanceBetween(vehicleLocation, map.getCenter());  // In meters
    return Math.ceil(distance / ((vehicleSpeed * 1000) / 60));
}


function get_nearby_vehicle_info_and(data_handler){
  // Construct the URL used to ask MyTTC for vehicles around the center of our map
  var url ='http://myttc.ca/vehicles/near/' + map.getCenter().lat() + ',' + map.getCenter().lng() + '.json?callback=?';

  $.getJSON(url)
  .done(function(data){
    data_handler(data.vehicles);
  });

}


