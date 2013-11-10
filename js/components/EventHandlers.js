/**
 * Changes UI when element in toolbox is clicked
 */
function clickLi(li)
{
	li.style.borderWidth = "2px";
}

/**
 * Makes all UI elements in toolbox look unclicked
 */
function unclickAll()
{
	$("#toolList").children('li').each(function(i){
		$(this).css('border','solid 1px #A6BDE1')
	});
}

/**
 * Event handler fired after the draw rectangle icon in the toolbox on the left is clicked to start drawing a rectangle. 
 * Event wired in EventListeners.js
 */

function drawRectangleClicked()
{
	unclickAll();
	clickLi(this);
	drawingManager.setDrawingMode('rectangle');
}

/**
 * Event handler executed when you double click on a rectangle after it is done being drawn.
 * Attached on a rectangle in rectangleComplete function
 * @param Rectangle rectangle
 */

function rectangleSet()
{
	unclickAll();
	map.currentRectangle.setOptions({
		fillOpacity:0.1,
		strokeWeight:2,
		strokeColor:"#58cbf4",
		editable: false
	});
	rectBounds = map.currentRectangle.getBounds();	
	//map.panToBounds(map.currentRectangle.getBounds());
}

/**
 * Event handler fired after a rectangle is done being drawn. Event wired in EventListeners.js
 * @param  Circle circle
 */
function rectangleComplete(rectangle)
{

	google.maps.event.addListener(rectangle, 'dblclick',rectangleSet);
	drawingManager.setDrawingMode(null);
	map.currentRectangle = rectangle;
}

/**
 * Event handler fired after the draw circle icon in the toolbox on the left is clicked to start drawing a circle. 
 * Event wired in EventListeners.js
 */
function drawCircleClicked()
{
	unclickAll();
	clickLi(this);
	drawingManager.setDrawingMode('circle');
}

/**
 * Event handler fired after a circle is done being drawn wired in EventListeners.js
 * @param  Circle circle
 */
function circleComplete(circle)
{
	google.maps.event.addListener(circle, 'dblclick',circleSet);
	drawingManager.setDrawingMode(null);
	map.currentCircle =circle;
}

/**
 * Event handler executed when you double click on a circle after it is done being drawn.
 * Attached on a circle in circleComplete function
 * @param Circle circle
 */

function circleSet(circle)
{
	map.currentCircle.setOptions({
		editable : false,
		draggable: false		
	});
	// Store circle data and Send circle data to server
}

/**
 * Event Handler executed when you click on the toolbox element to position a passenger on the map.
 * It positions the marker in the center of the map and makes him draggable.
 * The passenger is fixed when he is double clicked. 
 * Then you need to position the destination of that passenger.
 */

function putPassengerClicked()
{
	// If you're not already positioning a passenger
	if (this.style.borderWidth != "2px")
	{	
		unclickAll();
		clickLi(this);
		var passImage = "img/person.png";
		pos = map.getCenter();

		var currentPassenger = new google.maps.Marker({
			position:pos,
			map:map,
			icon:passImage,
			draggable: true
		});

		google.maps.event.addListener(currentPassenger, 'dblclick',passengerSourceSet);
		map.currentPassengerSource = currentPassenger;
	}
	else
	{
		alert("Finish this passenger before starting another one");
	}
}




/**
 * Event Handler triggered after double clicking on a passenger you set his position and create his destination 
 * @param  google.maps.Marker passenger
 */
function passengerSourceSet(passenger)
{
	firstDest = map.currentPassengerSource.getDraggable()
	if (firstDest == true)
	{
		map.currentPassengerSource.setOptions({
			draggable : false
		});
	
		var passImage = "img/dropoff.png";
		pos = map.getCenter();
		test = 'a'
			currentPassengerDest = new google.maps.Marker({
				position:pos,
				map:map,
				icon:passImage,
				draggable: true,
				title : test 
			});
		map.currentPassengerDest = currentPassengerDest;
		google.maps.event.addListener(currentPassengerDest, 'dblclick',passengerDestSet);
	}
}


/**
 * Event Handler triggered after double clicking on the destination marker 
 * Fixes the marker on the map, computes shortest path between source and destination by driving and renders it on map
 * @param  google.maps.Marker passenger
 */
function passengerDestSet(passenger)
{
	map.currentPassengerDest.setOptions({
			draggable : false
		});
	var start = map.currentPassengerSource.getPosition();
	var destination = map.currentPassengerDest.getPosition();

  	var request = {
    	origin:start,
    	destination:destination,
    	travelMode: google.maps.TravelMode.DRIVING
  	};
  	
  	directionsService.route(request, function(result, status) {
    	if (status == google.maps.DirectionsStatus.OK) {
      		directionsDisplay.setDirections(result);
    	}
  	});
  	unclickAll();
}



