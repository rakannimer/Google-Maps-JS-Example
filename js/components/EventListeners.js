drawNetwork = document.getElementById("DrawNetwork");
putPassenger = document.getElementById("PutPassenger");
passRegion = document.getElementById("PutPassengerRegion");
putTaxi = document.getElementById("PutTaxi");
submit = document.getElementById("submit");

google.maps.event.addDomListener(drawNetwork, 'click',drawNetworkClicked);

google.maps.event.addDomListener(putPassenger, 'click',putPassengerClicked);

google.maps.event.addDomListener(passRegion, 'click',passRegionClicked);

google.maps.event.addDomListener(putTaxi, 'click',putTaxiClicked);

google.maps.event.addListener(drawingManager, 'rectanglecomplete',rectangleComplete);

google.maps.event.addListener(drawingManager, 'circlecomplete',circleComplete);
