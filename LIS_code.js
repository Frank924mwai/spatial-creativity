// Global Variables
	let map;
	let searchMarkers=[];
// Global Help Function
	function clearSearchMarkers() {
    if (!Array.isArray(searchMarkers) || searchMarkers.length === 0) {
		return;
	}
        searchMarkers.forEach(marker => {
            if (map) map.removeLayer(marker);
        });
        searchMarkers.length = 0; // Reset the array
    }
//Create the map object and set the centre point and zoom level 
    function initialize()   {
        map = L.map('mapdiv',{
		zoomControl:false // Disable the default zoom control
		});
		// Set the view
        map.setView([-15.80337498,35.0385198], 15.5);
		//Add zoom control at bottom left
		L.control.zoom({
			position:'bottomleft'
		}).addTo(map);
		// Add Locate Me button
		L.control.locate({
			locateOptions:{
				enableHighAccuracy:true,
				maxZoom:16,
				watch:true
			}
		}).addTo(map);
		//Add measurement tool
		var measureControl=new
		L.Control.Measure({
			primaryLengthUnit: 'meters',
			secondaryLengthUnit:'kilometers',
			primaryAreaUnit:'sqmeters',
			secondaryAreaUnit:'hectares',
			activeColor:'#db4a44',
			completedColor:'#8b2412'
		});
		measureControl.addTo(map);
        //Load tiles from open street map
        var osm = L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:'Map data ©OpenStreetMap contributors, CC-BY-SA, Imagery ©CloudMade',
            maxZoom: 100
		}).addTo(map);// Add OSM by default
		var Google = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
		attribution: '© Google Maps',maxZoom:100
		}).addTo(map);//Add the basetiles to the map object

		var GoogleSat = L.tileLayer('https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
		attribution: '© Google Maps',maxZoom:100
		}).addTo(map);//Add the basetiles to the map object

		console.log("Raw GeoJSON Data:",BTBoundary);
        //Add the BTBoundary GeoJSON directly from the variable
		const geo =
		L.geoJSON(BTBoundary,{
			style: {
				color:"red",
				weight: 5,
			fillOpacity:0}
		}).addTo(map); // Add BTBoundary by default
		// Define a function to process each boundary feature
		function onEachFeature(feature,layer)
		{// Check if the feature has properties
		    if(feature.properties){
				const props = feature.properties;
				//Build the content for the pop-up using key attributes
				let popupContent = `<h3>Property Information</h3>
									<p>
									<b>Plot Number:</b> ${props.plot_no}<br>
									<b>Area(Ha):</b> ${props.ACRES.toFixed(4)}<br>
									<b>Perimeter(m):</b> ${props.PERIMETER.toFixed(2)}<br>
									</p>
									`;
		//Bind the pop-up to the layer
		layer.bindPopup(popupContent);
			}
		}
		// Add the BTProperties GeoJSON directly from the variable
		const property =
		L.geoJSON(BTProperties,{
			style: {
				color:"black",
				weight: 1,
			fillOpacity: 0
		},
	    onEachFeature: onEachFeature})
		.addTo(map);// Add BTProperties to the map by default
		// Plot Number Autocomplete
		const plotList = document.getElementById("plot-list");
		const plotSet = new Set();

		property.eachLayer(function(layer) {
			const plotNo = layer.feature.properties?.plot_no;
			if (plotNo) {
				plotSet.add(String(plotNo));
			}
		});

		plotSet.forEach(plot => {
			const option = document.createElement("option");
			option.value = plot;
			plotList.appendChild(option);
		});
		// Define a function to process each constituency feature
		function onEachConstituency(feature,layer)
		{// Check if the feature has properties
		    if(feature.properties){
				const conprop = feature.properties;
				//Build the content for the pop-up using key attributes
				let popupContent = `<h3>Constituency Information</h3>
									<p>
									<b>Name:</b> ${conprop.Constituen}<br>
									<b>MP:</b> ${conprop.MP_Name}<br>
									<b>Political Party:</b> ${conprop.Party}<br>
									</p>
									`;
		//Bind the pop-up to the layer
		layer.bindPopup(popupContent);
			}
		}
		//Add the BTConstituency GeoJSON directly from the variable
		const constituency =
		L.geoJSON(BTConstituency,{
			style: {
				color:"RED",
				weight: 1,
				fillOpacity:0
			},
		onEachFeature: onEachConstituency})
		.addTo(map);
		// Define a function to process each ward feature
		function onEachWard(feature,layer)
		{// Check if the feature has properties
		    if(feature.properties){
				const wardprop = feature.properties;
				//Build the content for the pop-up using key attributes
				let popupContent = `<h3>Ward Information</h3>
									<p>
									<b>Name:</b> ${wardprop.Ward_Name}<br>
									<b>Councillor:</b> ${wardprop.Councillor}<br>
									<b>Political Party:</b> ${wardprop.Party}<br>
									</p>
									`;
		//Bind the pop-up to the layer
		layer.bindPopup(popupContent);
			}
		}
		//Add the BTWard GeoJSON directly from the variable
		const ward =
		L.geoJSON(BTWards,{
			style: {
				color:"RED",
				weight: 1,
				fillOpacity:0
			},
		onEachFeature: onEachWard})
		.addTo(map);
		// Define a function to process each road feature
		function onEachRoad(feature,layer)
		{// Check if the feature has properties
		    if(feature.properties){
				const roadprop = feature.properties;
				//Build the content for the pop-up using key attributes
				let popupContent = `<h3>Road Information</h3>
									<p>
									<b>Name:</b> ${roadprop.Road_Name}<br>
									</p>
									`;
		//Bind the pop-up to the layer
		layer.bindPopup(popupContent);
			}
		}
		//Add the BTWard GeoJSON directly from the variable
		const road =
		L.geoJSON(BTRoads,{
			style: {
				color:"#999",
				weight: 5,
				fillOpacity:0
			},
		onEachFeature: onEachRoad})
		.addTo(map);
		map.fitBounds(geo.getBounds());
		// Define Layer Groups for Control
		var Basemaps = {
			        "Open Street Map": osm,
					"Google Satellite":Google,
					"Google Satellite Hybrid":GoogleSat
		};
		var Layers = {
					"BT City Roads": road,
					"Land Parcels": property,
					"Ward Boundaries":ward,
					"Constituency Boundaries":constituency,
					"BT City Boundary": geo		
		};
		// Add the Layer Control
		L.control.layers(Basemaps,Layers).addTo(map);
		// Plot Number Search Functionality
		const highlightingStyle = {
			color:'#ffff00',// Yellow Boundary
			weight:3, // Thicker Boundary
		};
		let previousHighlightLayer=null;
		// -----------------------
		//Define the key property name for searching
		const PLOT_KEY = 'plot_no';
		//Get the search elements
		const searchInput = document.getElementById('plot-search-input');
		const searchButton = document.getElementById('search-button');
		//Search Logic
		function performSearch() {

		const rawSearchTerm = searchInput.value.trim();

		if (!rawSearchTerm) {
			alert("Please enter a plot number or coordinates.");
			return;
		}
		// WGS84 LAT, LON SEARCH
		const latLonMatch = rawSearchTerm.match(/^([-+]?\d{1,3}\.\d+),\s*([-+]?\d{1,3}\.\d+)$/);
		if (latLonMatch) {
			const lat = parseFloat(latLonMatch[1]);
			const lon = parseFloat(latLonMatch[2]);

		clearSearchMarkers(); // Clear previous marker on the map 

            const marker = L.marker([lat, lon])
                .addTo(map)
                .bindPopup(`WGS84 Coordinates<br>${lat}, ${lon}`)
                .openPopup();
            
            searchMarkers.push(marker);
            map.flyTo([lat, lon], 18);
            return;
		}
	// Defining EPSG 32736 
	proj4.defs("EPSG:32736", "+proj=utm +zone=36 +south +datum=WGS84 +units=m +no_defs");

	// Search Block
	const utmMatch = rawSearchTerm.match(/^(\d{6,7}(?:\.\d+)?),\s*(\d{6,7}(?:\.\d+)?)$/);

	if (utmMatch) {
    // Using parseFloat ensures decimals are preserved
    const easting = parseFloat(utmMatch[1]);
    const northing = parseFloat(utmMatch[2]);

    // DEBUG: Open your browser console (F12) to check these numbers!
    console.log("Input Easting:", easting, "Input Northing:", northing);

    try {
        // Convert UTM 36S -> WGS84
        const coords = proj4("EPSG:32736", "WGS84", [easting, northing]);
        
        const lon = coords[0]; // Proj4 returns Longitude first
        const lat = coords[1]; // Then Latitude

        console.log("Converted Lat/Lon:", lat, lon);

        // Malawi Bounds Check (Widened slightly to be safe)
        if (lat < -18.0 || lat > -9.0 || lon < 32.0 || lon > 36.5) {
            alert(`Coordinates (${lat.toFixed(4)}, ${lon.toFixed(4)}) are outside Malawi.`);
            return;
        }

        clearSearchMarkers(); // Clear previous marker on the map

        const marker = L.marker([lat, lon])
            .addTo(map)
            .bindPopup(`<b>UTM 36S</b><br>E: ${easting}<br>N: ${northing}`)
            .openPopup();

        searchMarkers.push(marker);
        map.flyTo([lat, lon], 18);

		} 
		catch (err) {
        console.error("Projection error:", err);
    }
    return;
}
		// PLOT NUMBER SEARCH
		const cleanSearchTerm = rawSearchTerm.replace(/\s/g, '').toLowerCase();

		let found = false;

		// Reset previous highlight
		if (previousHighlightLayer) {
			property.resetStyle(previousHighlightLayer);
			previousHighlightLayer = null;
		}

		property.eachLayer(function (layer) {
			if (layer.feature.properties) {
				const plotValue = layer.feature.properties[PLOT_KEY];

				if (plotValue) {
					const cleanPlotValue = String(plotValue).replace(/\s/g, '').toLowerCase();

					if (cleanPlotValue === cleanSearchTerm) {

						layer.setStyle(highlightingStyle);
						previousHighlightLayer = layer;

						map.invalidateSize();

						map.fitBounds(layer.getBounds(), {
							padding: [50, 50],
							maxZoom: 18
						});

						layer.openPopup();
						found = true;
						return;
					}
				}
			}
		});

		if (!found) {
			alert(`No matching plot or coordinates found for "${rawSearchTerm}".`);
		}
	}
	// End of performSearch function
		// Event listener 1: Search Button click
		searchButton.addEventListener('click',performSearch);
		// Event listener 1: Enter Key Press in the input field
		searchInput.addEventListener('keydown',function(e) {
			//Check if the pressed key is 'Enter'
			if(e.key === 'Enter'){
				e.preventDefault();// Prevents default form submission if input was in a form
				performSearch();
		}
		});
	document.getElementById("full-extent-btn").addEventListener("click", function() {
    map.fitBounds(geo.getBounds());
});
	// --- CLEAR HIGHLIGHT WHEN CLICKING ANYWHERE ON MAP ---
	map.on("click", function () {
    
    // Close any open popup
    map.closePopup();
	
	// Remove the UTM/WGS84 search markers
    clearSearchMarkers();
    // Remove highlight from previously selected feature
    if (previousHighlightLayer) {
        property.resetStyle(previousHighlightLayer);
        previousHighlightLayer = null;
    }
});
}