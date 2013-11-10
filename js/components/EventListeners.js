drawNetwork = document.getElementById("DrawNetwork");
putPassenger = document.getElementById("PutPassenger");
passRegion = document.getElementById("PutPassengerRegion");
putTaxi = document.getElementById("PutTaxi");

google.maps.event.addDomListener(drawNetwork, 'click',drawRectangleClicked);

google.maps.event.addDomListener(putPassenger, 'click',putPassengerClicked);

google.maps.event.addDomListener(passRegion, 'click',drawCircleClicked);


google.maps.event.addListener(drawingManager, 'rectanglecomplete',rectangleComplete);

google.maps.event.addListener(drawingManager, 'circlecomplete',circleComplete);
