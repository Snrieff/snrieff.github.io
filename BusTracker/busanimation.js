var map;
var markers = [];

function boston(){
	var myOptions = {
		zoom      : 14,
		center    : {lat:42.353350, lng:-71.091525},
		mapTypeId : google.maps.MapTypeId.SATELLITE
	};
	var element = document.getElementById('map');
  	map = new google.maps.Map(element, myOptions);
  	addMarkers();
}

async function addMarkers(){
	var locations = await getBusLocations();
	locations.forEach(function(bus){
		var marker = getMarker(bus.id);		
		if (marker){
			moveMarker(marker,bus);
		}
		else{
			addMarker(bus);			
		}
	});

	console.log(new Date());
	setTimeout(addMarkers,15000);
}

async function getBusLocations(){
	var url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';	
	var response = await fetch(url);
	var json     = await response.json();
	return json.data;
}

function addMarker(bus){
	var icon = getIcon(bus);
	var marker = new google.maps.Marker({
	    position: {
	    	lat: bus.attributes.latitude, 
	    	lng: bus.attributes.longitude
	    },
	    map: map,
	    icon: icon,
	    id: bus.id
	});
	markers.push(marker);
}

function getIcon(bus){
	if (bus.attributes.direction_id === 0) {return 'red.png';}
	return 'blue.png';	
}

function moveMarker(marker,bus) {
	var icon = getIcon(bus);
	marker.setIcon(icon);
    marker.setPosition( {
    	lat: bus.attributes.latitude, 
    	lng: bus.attributes.longitude
	});
}

function getMarker(id){
	var marker = markers.find(function(item){
		return item.id === id;
	});
	return marker;
}

window.onload = boston;