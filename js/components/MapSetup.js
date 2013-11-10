
// Initialize Map

var mapDiv = document.getElementById('map_canvas');

var myOptions = {
          center: new google.maps.LatLng(33.878041,35.521769),
          zoom: 14,
          overviewMapControl: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

//Show Map        
map = new google.maps.Map(mapDiv,myOptions);

map.passengers = [];
map.passRegions = [];
map.taxis =[];

/********************
 * 
 * Drawing Manager 
 * 
 * ******************
 */

drawingManager = new google.maps.drawing.DrawingManager({
		
    drawingMode: google.maps.drawing.OverlayType.MARKER,
		
    drawingControl: true,
		
    drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_CENTER, // Change to RIGHT_CENTER
			drawingModes: [google.maps.drawing.OverlayType.MARKER]
		},

    markerOptions: {
      clickable: true,
      draggable: true,
      flat: false,
      title: 'Some Point'
    },

  rectangleOptions: {
      fillOpacity: 0.3,
      strokeWeight: 0.8,
      strokeOpacity: 1,
      fillColor : "#58cbf4",
      clickable: false,
      zIndex: 1,
      editable: true
  }  ,
  circleOptions: {
    fillOpacity : 0.2,
     strokeWeight: 0.8,
     strokeColor: '#58cbf4',
      draggable:true,
      editable: true

  },
		
    polylineOptions: {
        strokeColor:'#FF0000',
        strokeOpacity:0.3,
        strokeWeight:5,
        editable:true
  }
	});

var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers:true});
var directionsService = new google.maps.DirectionsService();

drawingManager.setMap(map);
drawingManager.setDrawingMode(null);
directionsDisplay.setMap(map);


