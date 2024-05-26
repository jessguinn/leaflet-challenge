// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
  });

    // Function to set marker color based on depth
    function markerColor(depth) {
        return depth > 90 ? "#ea2c2c" :
               depth > 70 ? "#ea822c" :
               depth > 50 ? "#ee9c00" :
               depth > 30 ? "#eecc00" :
               depth > 10 ? "#d4ee00" :
                            "#98ee00";
    }

function createFeatures(earthquakeData) {

  // Give each feature a popup that describes the place and mag of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
  }

  // Function to set marker size based on magnitude
  function markerSize(magnitude) {
    return magnitude * 4;
  }

// Create a GeoJSON layer with the earthquake data
let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    },
    onEachFeature: onEachFeature
});

    // Send earthquakes layer to the createMap function/
    createMap(earthquakes);
}

function createMap(earthquakes) {

// Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// Create a legend
let legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
    let div = L.DomUtil.create("div", "legend"),
        grades = [0, 10, 30, 50, 70, 90],
        labels = [];

    div.innerHTML += "<h4>Depth (km)</h4>";
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(myMap);
}
