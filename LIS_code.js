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
        searchMarkers.length = 0; // This resets the array
    }
//Create the map object and set the centre point and zoom level 
    function initialize()   {
        map = L.map('mapdiv',{
		zoomControl:false // This disables the default zoom control
		});
		// Set the map view
        map.setView([-15.80337498,35.0385198], 15.5);
		//Adding zoom control at bottom left
		L.control.zoom({
			position:'bottomleft'
		}).addTo(map);
		// Adding the Locate Me button
		L.control.locate({
			locateOptions:{
				enableHighAccuracy:true,
				maxZoom:16,
				watch:true
			}
		}).addTo(map);
		//Adding the measurement tool
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
        //Loading tiles from Open Street Map (OSM)
        var osm = L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:'Map data ©OpenStreetMap contributors, CC-BY-SA, Imagery ©CloudMade',
            maxZoom: 100
		}).addTo(map);// Adding OSM by default
		var Google = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
		attribution: '© Google Maps',maxZoom:100
		}).addTo(map);//Adding the basetiles to the map object

		var GoogleSat = L.tileLayer('https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
		attribution: '© Google Maps',maxZoom:100
		}).addTo(map);//Adding the basetiles to the map object
		
        //Adding the BTBoundary GeoJSON directly from the variable
		const geo =
		L.geoJSON(BTBoundary,{
			style: {
				color:"red",
				weight: 5,
			fillOpacity:0}
		}).addTo(map); // Adding BTBoundary by default
		// Defining a function to process each boundary feature
		function onEachFeature(feature,layer)
		{// Checking if the feature has properties
		    if(feature.properties){
				const props = feature.properties;
				//Building the content for the pop-up using key attributes
				let popupContent = `<h3>Property Information</h3>
									<p>
									<b>Plot Number:</b> ${props.plot_no}<br>
									<b>Area(Ha):</b> ${props.ACRES.toFixed(4)}<br>
									<b>Perimeter(m):</b> ${props.PERIMETER.toFixed(2)}<br>
									</p>
									`;
		//Binding the pop-up to the layer
		layer.bindPopup(popupContent);
			}
		}
		// Adding the BTProperties GeoJSON directly from the variable
		const property =
		L.geoJSON(BTProperties,{
			style: {
				color:"black",
				weight: 2,
			fillOpacity: 0
		},
	    onEachFeature: onEachFeature})
		.addTo(map);// Adding BTProperties to the map by default
		// ------------------------------------
		// Defining a function to process each constituency feature
		function onEachConstituency(feature,layer)
		{// Checking if the feature has properties
		    if(feature.properties){
				const conprop = feature.properties;
				//Building the content for the pop-up using key attributes
				let popupContent = `<h3>Constituency Information</h3>
									<p>
									<b>Name:</b> ${conprop.Constituency}<br>
									<b>MP:</b> ${conprop.MP_Name}<br>
									<b>Political Party:</b> ${conprop.Party}<br>
									</p>
									`;
		//Binding the pop-up to the layer
		layer.bindPopup(popupContent);
			}
		}
		//Adding the BTConstituency GeoJSON directly from the variable
		const constituency =
		L.geoJSON(BTConstituency,{
			style: {
				color:"#4da6ff",
				weight: 2,
				fillColor:"#4da6ff",
				fillOpacity:0.15
			},
		onEachFeature: onEachConstituency})
		.addTo(map);
		// Defining a function to process each ward feature
		function onEachWard(feature,layer)
		{// Checking if the feature has properties
		    if(feature.properties){
				const wardprop = feature.properties;
				//Building the content for the pop-up using key attributes
				let popupContent = `<h3>Ward Information</h3>
									<p>
									<b>Name:</b> ${wardprop.Ward_Name}<br>
									<b>Councillor:</b> ${wardprop.Councillor}<br>
									<b>Political Party:</b> ${wardprop.Party}<br>
									</p>
									`;
		//Binding the pop-up to the layer
		layer.bindPopup(popupContent);
			}
		}
		//Adding the BTWard GeoJSON directly from the variable
		const ward =
		L.geoJSON(BTWards,{
			style: {
				color:"#4da6ff",
				weight: 2,
				fillColor:"#4da6ff",
				fillOpacity:0.15
			},
		onEachFeature: onEachWard})
		.addTo(map);
		// Defining a function to process each address feature
		function onEachNas(feature,layer)
		{// Checking if the feature has properties
		    if(feature.properties){
				const nasprop = feature.properties;
				//Building the content for the pop-up using key attributes
				let popupContent = `<h3>NAS Information</h3>
									<p>
									<b>Street Address:</b> ${nasprop.Street_Add}<br>
									<b>Area Name:</b> ${nasprop.Area_Name}<br>
									</p>
									`;
		//Binding the pop-up to the layer
		layer.bindPopup(popupContent);
			}
		}
		//Adding the BTNas GeoJSON directly from the variable
		const nas =
		L.geoJSON(BTNas,{
			style: {
				color:"black",
				weight: 2,
				fillOpacity:0
			},
		onEachFeature: onEachNas})
		.addTo(map);
		// Defining a function to process each road feature
		function onEachRoad(feature,layer)
		{// Checking if the feature has properties
		    if(feature.properties){
				const roadprop = feature.properties;
				//Building  the content for the pop-up using key attributes
				let popupContent = `<h3>Road Information</h3>
									<p>
									<b>Name:</b> ${roadprop.Road_Name}<br>
									</p>
									`;
		//Binding the pop-up to the layer
		layer.bindPopup(popupContent);
			}
		}
		//Adding the BTWard GeoJSON directly from the variable
		const road =
		L.geoJSON(BTRoads,{
			style: {
				color:"#999",
				weight: 3,
				fillOpacity:0.08
			},
		onEachFeature: onEachRoad})
		.addTo(map);
		map.fitBounds(geo.getBounds());
		// Defining Layer Groups for Control
		var Basemaps = {
			        "Open Street Map": osm,
					"Google Satellite":Google,
					"Google Satellite Hybrid":GoogleSat
		};
		var Layers = {
					"BT City Roads": road,
					"Street Addresses": nas,
					"Land Parcels": property,
					"Ward Boundaries":ward,
					"Constituency Boundaries":constituency,
					"BT City Boundary": geo		
		};
		// Adding the Layer Control to the map
		L.control.layers(Basemaps,Layers).addTo(map);
		// --- Dynamic Search Configuration---
		const searchConfig = {
			"property": { layer: property, attributes: ["plot_no"] },
			"nas": { layer: nas, attributes: ["Street_Add","House_Numb","Road_Name","Area_Name"] },
			"ward": { layer: ward, attributes: ["Ward_Name","Councillor","Party"] },
			"constituency": { layer: constituency, attributes: ["Constituency","MP_Name","Party"] },
			"road": { layer: road, attributes: ["Road_Name"] }
		};

		const layerSelect = document.getElementById('layer-select');
		const attributeSelect = document.getElementById('attribute-select');
		const plotList = document.getElementById("plot-list");
		const valueCache = {};

		// This function updates the Attribute dropdown based on selected Layer
		function updateDropdowns() {
			const selectedKey = layerSelect.value;
			const config = searchConfig[selectedKey];

			attributeSelect.innerHTML = ''; // Clearing current options
			config.attributes.forEach(attr => {
				const opt = document.createElement('option');
				opt.value = attr;
				opt.textContent = attr.replace('_', ' '); // Making it look a bit cleaner
				attributeSelect.appendChild(opt);
			});

			updateDatalist(); // Updating the autocomplete list immediately
		}

		// This function updates Autocomplete Datalist based on selection
		function updateDatalist() {
		plotList.innerHTML = ''; // Clearing datalist initially
		const selectedKey = layerSelect.value;
		const selectedAttr = attributeSelect.value;
		const cacheKey = `${selectedKey}-${selectedAttr}`;
		
		if (!valueCache[cacheKey]) {
			const targetLayer = searchConfig[selectedKey].layer;
			const values = new Set();
			targetLayer.eachLayer(function(layer) {
				const val = layer.feature.properties?.[selectedAttr];
				if (val) values.add(String(val));
			});
			valueCache[cacheKey] = Array.from(values).sort();
		}
		}

		// There are event listeners for when the user changes dropdowns
		layerSelect.addEventListener('change', function() {
			clearHighlights();
			updateDropdowns();
			searchInput.value = '';
		});	
		attributeSelect.addEventListener('change', function() {
			clearHighlights();
			updateDatalist();
			searchInput.value = '';
			searchInput.dispatchEvent(new Event('input'));
		});

		// Initialising dropdowns on load
		updateDropdowns();
		// This is the Plot Number Search Functionality
		const highlightingStyle = {
			color:'#ffff00',// Yellow Boundary
			weight:3, // Thicker Boundary
		};
		let previousHighlightLayers = [];
		let previousHighlightGroup = null; //Tracking the parent layer group
		
		// This function clears all highlights
		function clearHighlights() {
		if (previousHighlightLayers.length > 0 && previousHighlightGroup) {
        previousHighlightLayers.forEach(layer => {
            previousHighlightGroup.resetStyle(layer);
        });
        previousHighlightLayers = [];
        previousHighlightGroup = null;
		}
		}
		// Getting the search elements
		const searchInput = document.getElementById('plot-search-input');
		const awesomplete = new Awesomplete(searchInput, { minChars: 1, maxItems: 200, filter: function() { 
        return true; // Letting all items in our custom list pass through
		} });
		const searchButton = document.getElementById('search-button');
		// This is the Debounce function
		function debounce(fn, delay) {
		let timeout;
		return function(...args) {
			clearTimeout(timeout);
			timeout = setTimeout(() => fn(...args), delay);
		};
		}
		// Dynamic filter function 
		const updateSuggestions = debounce(function() {
		const inputValue = searchInput.value.trim().toLowerCase();
		if (!inputValue) {
			awesomplete.list = [];
			return;
		}

		const selectedKey = layerSelect.value;
		const selectedAttr = attributeSelect.value;
		const cacheKey = `${selectedKey}-${selectedAttr}`;
		const allValues = valueCache[cacheKey] || [];

		// Splitting search terms into words (ignoring extra spaces)
		const searchWords = inputValue.split(/\s+/).filter(w => w.length > 0);

		// Filtering: every search word must appear somewhere in the value
		const matches = allValues
        .filter(val => {
            const valLower = val.toLowerCase();
            // All words must be found in the value
            return searchWords.every(word => valLower.includes(word));
        })
        // Sorting features by how well they match (closer to start = better)
        .sort((a, b) => {
            const aLower = a.toLowerCase();
            const bLower = b.toLowerCase();
            const aIndex = aLower.indexOf(searchWords[0]);
            const bIndex = bLower.indexOf(searchWords[0]);
            return aIndex - bIndex;
        });

		// Feeding to Awesomplete
		awesomplete.list = matches;
		awesomplete.evaluate();
		}, 300);
		// Attaching to the input event
		searchInput.addEventListener('input', updateSuggestions);
		
		//Search Logic
		function performSearch() {
			const rawSearchTerm = searchInput.value.trim();

			if (!rawSearchTerm) {
				alert("Please enter a search term or coordinates.");
				return;
			}
		// SEARCHING USING WGS84 LAT, LON COORDINATES
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

	// This is the Search Block
	const utmMatch = rawSearchTerm.match(/^(\d{6,7}(?:\.\d+)?),\s*(\d{6,7}(?:\.\d+)?)$/);

	if (utmMatch) {
    // Using parseFloat to ensure decimals are preserved
    const easting = parseFloat(utmMatch[1]);
    const northing = parseFloat(utmMatch[2]);

    // DEBUGGING: Open your browser console (F12) to check these numbers!
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

        clearSearchMarkers(); // Clearing previous marker on the map

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
		// LAYER ATTRIBUTE SEARCH
			const cleanSearchTerm = rawSearchTerm.replace(/\s/g, '').toLowerCase();
			let found = false;

			// Getting the currently selected layer and attribute
			const selectedKey = layerSelect.value;
			const selectedAttr = attributeSelect.value;
			const targetLayer = searchConfig[selectedKey].layer;

			// Resetting previous highlights first
			clearHighlights(); //Use the new clear function

			// Collecting all matching layers
			const matchedLayers = [];
			const combinedBounds = L.latLngBounds();

			targetLayer.eachLayer(function (layer) {
			if (layer.feature.properties) {
			const attrValue = layer.feature.properties[selectedAttr];
			if (attrValue) {
			const cleanAttrValue = String(attrValue).replace(/\s/g, '').toLowerCase();
			if (cleanAttrValue === cleanSearchTerm) {
				// Found a match!
				layer.setStyle(highlightingStyle);
				matchedLayers.push(layer);
				combinedBounds.extend(layer.getBounds()); // Extending bounds
				found = true;
			}
			}
			}
			});

			if (found) {
				previousHighlightLayers = matchedLayers;
				previousHighlightGroup = targetLayer;

				// Fitting to combined bounds if multiple, or single if one
				if (matchedLayers.length > 0) {
					map.invalidateSize();
					map.fitBounds(combinedBounds, {
						padding: [50, 50],
						maxZoom: 18
					});
					// Optionally opening popup on the first match
					matchedLayers[0].openPopup();
				}
				searchInput.value = rawSearchTerm; //Ensuring input reflects the searched term
			} else {
				alert(`No match found for "${rawSearchTerm}" in the selected layer.`);
			}
			}
	// End of performSearch function
		// Event listener 1: Search Button click
		searchButton.addEventListener('click',performSearch);
		// Event listener 1: Enter Key Press in the input field
		searchInput.addEventListener('keydown',function(e) {
			//Checking if the pressed key is 'Enter'
			if(e.key === 'Enter'){
				e.preventDefault();// Prevents default form submission if input was in a form
				performSearch();
		}
		});
	document.getElementById("full-extent-btn").addEventListener("click", function() {
    map.fitBounds(geo.getBounds());
});
	// --- CLEARING HIGHLIGHT WHEN CLICKING ANYWHERE ON MAP ---
	map.on("click", function () {
	    // Close any open popup
	    map.closePopup();
		
		// Remove the UTM/WGS84 search markers
	    clearSearchMarkers();
	    
        // Remove highlight from previously selected feature
		clearHighlights();
	});
	window.addEventListener('resize', function() {
    map.invalidateSize();
});
}