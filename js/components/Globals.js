var geocoder = new google.maps.Geocoder();
var directionsDisplay = new google.maps.DirectionsRenderer();
var map;

var Beirut = new google.maps.LatLng(33.889299,35.495479);
var networkDrawn = false;
var drawingManager;
var currentPassengerSource;