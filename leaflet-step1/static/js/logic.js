// Creating map object
// MAKE SURE #MAP MATCHES IN ALL SHEETS
var myMap = L.map("mapid", {
    center: [39.8283, -98.5795],
    // CHANGE ZOOM IF YOU CAN'T SEE ANYTHING
    zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Store API query variables
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a variable to use for the color/choropleth scale
var geojson;

// Assemble API query URL
// var url = baseURL + date + complaint + limit;

// Create function to grab data from the geojson with d3
d3.json(url).then(function (response) {
    var data = response.features
    // console.log(data)
    // console.log(Math.max(data.geometry.coordinates[2]));
    
    // Create a new marker cluster group
    // var markers = L.markerClusterGroup();
    // // Loop through data
    for (var i = 0; i < data.length; i++) {

        //     // Set the data location property to a variable
        var geometry = data[i].geometry;
        // console.log(geometry)
        
        // Create function to divvy up color groups by depth
        function getColor(d) {
            if (d > -10 && d < 10) {
                return "#66ff33"
            }
            else if (d> 10 && d < 30) {
                return "#ffff00"
            }
            else if (d> 30 && d<50) {
                return "#ff9900"
            }
            else if (d> 50 && d<70) {
                return "#fc8d59"
            }
            else if (d> 70 && d<90) {
                return "#800000"
            }
            else {
                return "#000000"
            }

        };

        //     // Check for location property
        if (geometry) {

            //         // Add a new marker to the cluster group and bind a pop-up
            //     markers.addLayer(L.marker([geometry.coordinates[1], geometry.coordinates[0]])
            //         .bindPopup("A " + data[i].properties.mag + " magnitude earthquake occured " + data[i].properties.place));
            var marker = L.circle([geometry.coordinates[1], geometry.coordinates[0]], {
                color: 'd7301f',
                fillColor: getColor(geometry.coordinates[2]),
                fillOpacity: 0.5,
                opacity: 0,
                radius: 15000 * (data[i].properties.mag)
            }).bindPopup("A " + data[i].properties.mag + " magnitude earthquake occured " + data[i].properties.place);
            marker.addTo(myMap);
        }
    }

// Set up the legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend');
    var grades = ['-10', '10', '30', '50', '70', '90'];
    var colors = [
        "#66ff33",
        "#ffff00",
        "#ff9900",
        "#fc8d59",
        "#800000",
        "#000000"
    ];
    // var labels = [];
    div.innerHTML = "<h3>Depth of Earthquake Source (km)</h3>"
    // loop through our grades and generate a label with a colored square for each interval
    // grades.forEach(function(grade, index){
    //     labels.push("<div class = 'row'><li style=\"background-color: " + colors[index] +  "; width: 10px"+ "; height: 10px" + "\"></li>" + "<li>" + grade + "</li></div>");
    // })
    // div.innerHTML += "<ul>" + labels.join("") +"</ul>";
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        console.log(colors[i])
    }
    return div;  
};

legend.addTo(myMap);

//   // Add min & max
//   var legendInfo = "<h1>Median Income</h1>" +
//     "<div class=\"labels\">" +
//       "<div class=\"min\">" + limits[0] + "</div>" +
//       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//     "</div>";

//   div.innerHTML = legendInfo;

//   limits.forEach(function(limit, index) {
//     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//   });

//   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//   return div;
// };

// // Adding legend to the map
// legend.addTo(myMap);
});