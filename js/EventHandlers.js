function clickLi(me)
{
	me.style.borderWidth = "2px";
}
function unclickAll()
{
	$("#toolList").children('li').each(function(i){
		$(this).css('border','solid 1px #A6BDE1')
	});
}
function networkSet(){
	
}

function drawNetworkClicked()
{
	if (!networkDrawn)
	{
		unclickAll();
		clickLi(this);
		drawingManager.setDrawingMode('rectangle');
		google.maps.event.addListener(currentPassenger, 'dblclick',networkSet);
	}
	else if (this.style.borderWidth == "2px")
	{
		x = window.confirm("Are you sure you want to use this network for your simulation ?");
		unclickAll();
		//Remove draw Network from list
		$("#toolList").children('li').each(function(i){
			if ($(this).attr('id')=="DrawNetwork")
			{
				$(this).remove();
			}
		});

		map.panToBounds(map.drawnNetwork.getBounds());
  		
  		map.drawnNetwork.setOptions({
  			fillOpacity:0.1,
  			strokeWeight:2,
  			strokeColor:"#58cbf4",
  			editable: false
  		});

  		rectBounds = map.drawnNetwork.getBounds().toUrlValue(); //Will return SouthWest and NorthEast
  		

  		SWandNEs = rectBounds.split(',');
  		SWandNE = [];
  		var i =0;
  		for (coor in SWandNEs)
  		{
  			SWandNE[i] = parseFloat(SWandNEs[coor]);
  			i++;
  		}
  		NWlat = SWandNE[2];
  		NWlon = SWandNE[1]; 
  		SElat = SWandNE[0];
  		SElon = SWandNE[3];
  		map.network = new Object();
  		map.network.left = NWlon; 
  		map.network.bottom = SElat; 
  		map.network.right = SElon ;
  		map.network.top = NWlat;
  		time = prompt("Simulation time : ");


  		map.network.time = time;		
	}
	else
	{
		alert( "You can not use more than one network at a time, refresh page if you want to start over !");
	}
}

function putPassengerClicked()
{
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
		alert("Finish this passenger");
	}
}

function passRegionClicked()
{



	unclickAll();
	clickLi(this);
	drawingManager.setDrawingMode('circle');
	// When the circle is double clicked the data is recorded.
}

function putTaxiClicked()
{
	if (this.style.borderWidth != "2px")
	{
		unclickAll();
		clickLi(this);
		var taxiImage = "img/taxi.png";
		pos = map.getCenter();

		var currentTaxi = new google.maps.Marker({
			position:pos,
			map:map,
			icon:taxiImage,
			draggable: true
		});
		google.maps.event.addListener(currentTaxi, 'dblclick',taxiSet);
		map.currentTaxi = currentTaxi;
	}
	else
	{
		alert("Put this taxi somewhere");
	}
}

function taxiSet()
{
	// Only start time is determined
	$( "#slider-range-passenger").slider({
		range: "min",
		value: 1,
		min: 1,
		max: 500,
		slide: function( event, ui ) {
			$( "#passengerTime").val( ui.value );
		}
	});
	$("#singlePassengerSlider").dialog({title: "Set Taxi Birth Time",height:"500", buttons: { "Submit Data": function() { 
		taxiTime = $("#singlePassengerSlider").find('input').val();
		map.currentTaxi.setOptions({
			title : taxiTime,
			draggable : false
		});
		taxi = {source : map.currentTaxi.getPosition().toUrlValue(),
					time : taxiTime};
		map.taxis.push(taxi);
		console.log(map.taxis);
		unclickAll();
		$(this).dialog("close"); 
	}}});
	
	
	
}

function rectangleComplete(theRectangle)
{
	map.drawnNetwork = theRectangle;
	drawingManager.setDrawingMode (null);
	networkDrawn = true;
}

function passengerSourceSet(passenger)
{
	//alert(map.currentPassengerSource.getPosition());
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



function passengerDestSet(passenger)
{


	console.log(map.currentPassengerSource.getPosition());
	console.log(map.currentPassengerDest.getPosition());

	var start = map.currentPassengerSource.getPosition();
	var destination = map.currentPassengerDest.getPosition();

  	var request = {
    	origin:start,
    	destination:destination,
    	travelMode: google.maps.TravelMode.DRIVING
  	};

  	console.log(request);

  	directionsService.route(request, function(result, status) {
    	if (status == google.maps.DirectionsStatus.OK) {
      		directionsDisplay.setDirections(result);
    	}
  	});

	$( "#slider-range-passenger").slider({
		range: "min",
		value: 1,
		min: 1,
		max: 500,
		slide: function( event, ui ) {
			$( "#passengerTime").val( ui.value );
		}
	});
	$("#singlePassengerSlider").dialog({title: "Set Passenger Birth Time",height:"500", buttons: { "Submit Data": function() { 
		passTime = $("#singlePassengerSlider").find('input').val();
		map.currentPassengerSource.setOptions({
			title : passTime,
			draggable : false
		});
		map.currentPassengerDest.setOptions({
			title : passTime,
			draggable : false
		});
		passenger = {source : map.currentPassengerSource.getPosition().toUrlValue(),
					destination : map.currentPassengerDest.getPosition().toUrlValue(),
					time : passTime};
		map.passengers.push(passenger);
		console.log(map.passengers);
		unclickAll();
		$(this).dialog("close"); 
	}}});

	





	
}

function circleComplete(circle)
{
	google.maps.event.addListener(circle, 'dblclick',pasRegionSet);
	drawingManager.setDrawingMode(null);
	map.currentCircle =circle;
}

function pasRegionSet(circle)
{
	var regionDemand = new Object;
	map.currentCircle.setOptions({
		editable : false		
	});
	
	time =100;
	$(function() {
  		$( "#slider-range" ).slider({
  			range: true,
  			value: 37,
  			min: 1,
  			max: 500,
  			values: [4000,6000],
  			slide: function( event, ui ) {
  				$( "#range" ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
  			}
  		});
  		$("#range").val( $( "#slider-range" ).slider( "values", 0 ) + $( "#slider-range" ).slider( "values", 1 ) );
  	});
	$("#rangeSliders").show();
	$("#rangeSliders").dialog({title: "Select Time Range",height:"500", buttons: { "Set Time Range": function() { 
		$(this).dialog("close"); 
		startTime= parseInt($( "#slider-range" ).slider( "values", 0 ));
		endTime = parseInt($( "#slider-range" ).slider( "values", 1 ));
		interval = parseInt($("#interval").val());
		regionDemand.center = map.currentCircle.getCenter().toUrlValue();
		regionDemand.radius = map.currentCircle.getRadius();
		regionDemand.startTime = startTime;
		regionDemand.endTime = endTime;
		regionDemand.interval = interval
		regionDemand.intervals = [];
		time = endTime - startTime;
		
		for (i = 0; i < parseInt(time/interval); i++)
		{
			clone = $("#aSlider").clone();
			clone.show();
			clone.attr("id","aSlider"+i);
			clone.find('input').attr("id","amount"+i);
			now = i*interval + startTime;
			next = i*interval + interval + startTime;
			clone.find('label').html("Time Range : " +now+ " - "+ next);
			clone.find('#slider-range-min').attr("id","slider-range-min"+i);
			clone.appendTo('#sliders');		
		}
		$('#sliders').find(".oneSlider").each(function(idx, elm) {
			$( "#slider-range-min"+idx ).slider({
				range: "min",
				value: 1,
				min: 1,
				max: 20,
				slide: function( event, ui ) {
					$( "#amount"+idx ).val( ui.value );
				}
			});
			$( "#amount"+idx ).val($( "#slider-range-min"+idx ).slider( "value" ));
		});
		$("#sliders").dialog({title: "Set Passenger Density",height:"500", buttons: { "Submit Data": function() { 
			$("#sliders").find('input').each(function(idx,elem){
				regionDemand.intervals.push($(elem).val());
			})
			$(this).dialog("close"); 
			
		} } });/**/
		
	} } });
	map.passRegions.push(regionDemand);
	console.log(map.passRegions);
}


function submitData()
{
	if (networkDrawn)
	{
		var passengerRegions = JSON.stringify(map.passRegions,null, 2);
		var passengers = JSON.stringify(map.passengers,null, 2);
		var taxis = JSON.stringify(map.taxis,null, 2);
		var network = JSON.stringify(map.network,null, 2);
		$("#network").val(network);
		$("#taxis").val(taxis);
		$("#passengers").val(passengers);
		$("#passengerRegions").val(passengerRegions);
		$("#simData").submit();
	}
	else
	{
		alert( "Please draw network on which you wish to simulate");
	}
}
