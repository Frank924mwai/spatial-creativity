//Create the map object and set the centre point and zoom level 
    function initialize()   {
        var map = L.map('mapdiv',{
		zoomControl:false // Disable the default zoom control
		});
		// Set the view
        map.setView([-15.80337498,35.0385198], 15.5);
		//Add zoom control at bottom left
		L.control.zoom({
			position:'bottomleft'
		}).addTo(map);
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
		// Define a function to process each feature
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
		map.fitBounds(geo.getBounds()); 
		// Define Layer Groups for Control
		var Basemaps = {
			        "Open Street Map": osm,
					"Google Satellite":Google,
					"Google Satellite Hybrid":GoogleSat
		};
		var Layers = {
			        "BT City Boundary": geo,
					"Land Parcels": property
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
		function performSearch(){
			const rawSearchTerm = searchInput.value;					
		//Remove all spaces (/\s/g) and convert user input to lowercase
		const cleanSearchTerm = rawSearchTerm.replace(/\s/g,'').toLowerCase();
		if(!cleanSearchTerm) {
			//Use a custom alert message instead of window.alert()
			alert("Please enter a plot number.");
			return;
		}
		let found = false;
		//-----Highlight Reset-----
		//If a layer was previously highlighted, reset it to the default style
		if(previousHighlightLayer){
			property.resetStyle(previousHighlightLayer);
		}
		// ---------------------------
		//Iterate through all features in the 'property' layer
		property.eachLayer(function(layer){
			if(layer.feature.properties){
				const plotValue = layer.feature.properties[PLOT_KEY];
			if(plotValue) {
				// Ensure plotValue is a string, remove all spaces,and convert to lowercase
				const cleanPlotValue=String(plotValue).replace(/\s/g,'').toLowerCase();
			//Compare the cleaned values
			if(cleanPlotValue === cleanSearchTerm){
				//Found a match! 
			// Apply Highlight style
			layer.setStyle(highlightingStyle);
			previousHighlightLayer = layer;// Store reference for future reset		
			// Mobile Fix: Force map to re-evaluate its size before or after zooming
			map.invalidateSize();
			//Zoom to the feature bounds
				map.fitBounds(layer.getBounds(),{
					padding:[50,50],//Add padding so the plot isn't right on the edge
					maxZoom:18 // Zoom in fairly close
				});
			//Force perfect centering even on Mobile
				map.once('zoomed',function(){
					map.panTo(layer.getCenter());
				});
			//Open the pop-up immediately
				layer.openPopup();
				found = true;
		//Exit the eachLayer loop once found
		return;
		}}}});
		if(!found){
			//No match found, ensure the previous highlight is cleared
			previousHighlightLayer=null;
			alert(`Plot number "${rawSearchTerm}" not found.`);
		}
		} // End of performSearch function
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

    // Remove highlight from previously selected feature
    if (previousHighlightLayer) {
        property.resetStyle(previousHighlightLayer);
        previousHighlightLayer = null;
    }
});


	}